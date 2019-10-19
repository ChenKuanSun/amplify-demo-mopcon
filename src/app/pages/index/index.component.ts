import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Predictions, API, Storage } from 'aws-amplify';
import { from, BehaviorSubject, forkJoin, Subject, Observable, Observer } from 'rxjs';
import { concatMap, delay, mergeMap, tap, map, filter } from 'rxjs/operators';
import { IdentifyLabelsOutput } from '@aws-amplify/predictions/lib/types';
import { APIService } from 'src/app/API.service.service';
import { SubSink } from 'subsink';
// @ts-ignore
// import { EXIF as exifShim, EXIFStatic } from 'exif-js/exif';
// const EXIF: EXIFStatic = exifShim;

declare var EXIF: any;

interface PredictionLabel {
  label: string;
  count: number;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  orientation: any;
  subs = new SubSink();
  loading$ = new BehaviorSubject<boolean>(false);
  labels$ = new BehaviorSubject<PredictionLabel[]>([]);
  globalLabels$ = new BehaviorSubject<PredictionLabel[]>([]);

  image$ = new Subject<any>();
  queryData$ = new BehaviorSubject<void>(null);

  apiName = 'api3be66bd4';
  path = '/rekognition';

  @ViewChild('cameraInput', { static: false }) cameraInput: ElementRef;

  constructor(
    private apiservice: APIService
  ) { }

  queryPredictions$ = () =>
    from(this.apiservice.ListPredictions())
      .pipe(
        map(response => response.items),
        map(items => this.uniqClassify(items)),
        tap(items => this.globalLabels$.next(items))
      )

  loadedImages$ = (file: any) => new Observable<HTMLImageElement>((observer: Observer<any>) => {
    EXIF.getData(file, () => {
      this.orientation = EXIF.getTag(file, 'Orientation');
      const image = new Image();
      image.onload = () => {
        observer.next(image);
        observer.complete();
      };
      image.src = URL.createObjectURL(file);
    });
  })

  predictLabel$ = (file: any) => from(
    Predictions.identify({
      labels: {
        source: {
          file,
        },
        type: 'LABELS'
      }
    })
  )

  uploadFileToS3$ = (file: any) =>
    from(Storage.put('temp.png', file, {
      contentType: 'image/png'
    }))

  deleteFileFormS3$ = () =>
    from(Storage.remove('temp.png'))

  predictEmoction$ = () =>
    from(
      API.post(this.apiName, this.path, { body: 'temp.png' })
    )



  postPredictions$ = (orginLabels: PredictionLabel[]) =>
    forkJoin(
      orginLabels.map(label => from(this.apiservice.CreatePrediction(label)))
    )


  ngOnInit() {
    this.subs.add(
      // If next will list data.
      this.queryData$.pipe(
        concatMap(() => this.queryPredictions$())
      ).subscribe(),

      // Steps
      this.image$.pipe(
        filter(imageFile => !!imageFile),
        tap(() => this.loading$.next(true)),

        // API gateway lambda
        // concatMap(imageFile => this.uploadFileToS3$(imageFile).pipe(map(() => imageFile))),
        // concatMap(imageFile => this.predictEmoction$().pipe(map(() => imageFile))),
        // concatMap(imageFile => this.deleteFileFormS3$().pipe(map(() => imageFile))),

        tap(() => console.log('Predict')),
        concatMap(imageFile => this.predictLabel$(imageFile).pipe(map(predictLabels => [predictLabels, imageFile]))),
        tap(() => console.log('Load Image to blob')),
        concatMap(([predictLabels, imageFile]) => this.loadedImages$(imageFile).pipe(map(image => [predictLabels, image]))),
        tap(() => console.log('Render Canvas')),
        tap(([predictLabels, image]) => this.renderPredictions(predictLabels, image)),
        tap(() => console.log('Classify')),
        map(([predictLabels, image]) => this.classifyLabel(predictLabels)),
        tap(() => console.log('Show List')),
        tap((orginLabels) => this.labels$.next(orginLabels)),
        tap(() => console.log('Post to DB')),
        concatMap((orginLabels) => this.postPredictions$(orginLabels)),
        tap(() => this.loading$.next(false)),
      ).subscribe(),
      this.apiservice.OnCreatePredictionListener.subscribe(() => {
        this.queryData$.next();
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  classifyLabel(predictLabels: IdentifyLabelsOutput) {
    const orginLabels = [];
    predictLabels.labels.forEach(label => {
      if (orginLabels.length) {
        const idx = orginLabels.findIndex(item => item.label === label.name);
        if (idx > -1) {
          orginLabels[idx].count += label.boundingBoxes.length || 1;
        } else {
          orginLabels.push({
            label: label.name,
            count: label.boundingBoxes.length || 1,
          });
        }
      } else {
        orginLabels.push({
          label: label.name,
          count: label.boundingBoxes.length || 1,
        });
      }
    });
    return orginLabels;
  }

  uniqClassify(labels: {
    __typename?: 'Prediction';
    id: string;
    label: string;
    count: number;
  }[]) {
    const orginLabels = [];
    labels.forEach(label => {
      if (orginLabels.length) {
        const idx = orginLabels.findIndex(item => item.label === label.label);
        if (idx > -1) {
          orginLabels[idx].count += label.count || 1;
        } else {
          orginLabels.push({
            label: label.label,
            count: label.count || 1,
          });
        }
      } else {
        orginLabels.push({
          label: label.label,
          count: label.count || 1,
        });
      }
    });
    return orginLabels;
  }

  // 預測完畫進去圖案上
  renderPredictions = (predictions: IdentifyLabelsOutput, image: HTMLImageElement) => {

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.fitToContainer(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const can = document.createElement('canvas');
    const ctx2 = can.getContext('2d');

    can.width = image.width;
    can.height = image.height;

    ctx2.save();
    const tempWidth = can.width;
    const styleWidth = can.style.width;
    const tempHeight = can.height;
    const styleHeight = can.style.height;
    if (this.orientation) {
      if (this.orientation > 4) {
        can.width = tempHeight; can.style.width = styleHeight;
        can.height = tempWidth; can.style.height = styleWidth;
      }
      switch (this.orientation) {
        case 2: ctx2.translate(tempWidth, 0); ctx2.scale(-1, 1); break;
        case 3: ctx2.translate(tempWidth, tempHeight); ctx2.rotate(Math.PI); break;
        case 4: ctx2.translate(0, tempHeight); ctx2.scale(1, -1); break;
        case 5: ctx2.rotate(0.5 * Math.PI); ctx2.scale(1, -1); break;
        case 6: ctx2.rotate(0.5 * Math.PI); ctx2.translate(0, -tempHeight); break;
        case 7: ctx2.rotate(0.5 * Math.PI); ctx2.translate(tempWidth, -tempHeight); ctx2.scale(-1, 1); break;
        case 8: ctx2.rotate(-0.5 * Math.PI); ctx2.translate(-tempWidth, 0); break;
      }
    }
    ctx2.drawImage(image, 0, 0);
    ctx2.restore();

    ctx.drawImage(can, 0, 0, canvas.width, canvas.height);
    // 設定文字
    const font = `14px sans-serif`;
    ctx.font = font;
    ctx.textBaseline = 'top';

    // 把每一個物件畫上去
    predictions.labels.forEach(prediction => {
      // 每個有的boundingBox畫上
      prediction.boundingBoxes.forEach(boundingBox => {

        const width = +boundingBox.width * canvas.width;
        const height = +boundingBox.height * canvas.height;
        const x = +boundingBox.left * canvas.width;
        const y = +boundingBox.top * canvas.height;

        ctx.lineJoin = 'round';
        // 畫上框框
        ctx.strokeStyle = 'rgba(82,127,255,.5)';
        ctx.lineWidth = 5;
        ctx.strokeRect(x, y, width, height);
        // 畫上框框
        ctx.strokeStyle = 'rgba(200,200,200,.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        // 畫上背景
        ctx.fillStyle = 'rgba(82,127,255,.5)';
        const textWidth = ctx.measureText(prediction.name).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x + 2, y + 2, textWidth + 4, textHeight + 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(prediction.name, x, y);
      });
    });

  }

  fitToContainer(canvas: HTMLCanvasElement) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }


}
