import { Component, OnInit, OnDestroy } from '@angular/core';
import { Predictions } from 'aws-amplify';
import { from, BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { concatMap, delay, mergeMap, tap, map } from 'rxjs/operators';
import { IdentifyLabelsOutput } from '@aws-amplify/predictions/lib/types';
import { APIService } from 'src/app/API.service.service';
import { SubSink } from 'subsink';

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

  constructor(
    private apiservice: APIService
  ) {
  }

  subs = new SubSink();

  loading$ = new BehaviorSubject<boolean>(false);
  labels$ = new BehaviorSubject<PredictionLabel[]>([]);
  globalLabels$ = new BehaviorSubject<PredictionLabel[]>([]);
  image$ = new Subject<any>();
  queryData$ = new BehaviorSubject<void>(null);

  queryPredictions$ = () =>
    from(this.apiservice.ListPredictions())
      .pipe(
        map(response => response.items),
        map(items => this.uniqClassify(items)),
        tap(items => this.globalLabels$.next(items))
      )

  ngOnInit() {
    this.subs.add(
      this.queryData$.pipe(
        concatMap(() => this.queryPredictions$())
      ).subscribe(),
      this.image$.pipe(
        tap(() => this.loading$.next(true)),
        concatMap(image => this.predictLabel$(image)),
        map((predictLabels) => this.classifyLabel(predictLabels)),
        tap((orginLabels) => this.labels$.next(orginLabels)),
        concatMap((orginLabels) => this.postPredictions$(orginLabels)),
        tap(() => this.loading$.next(false)),
      ).subscribe(),
      this.apiservice.OnCreatePredictionListener.subscribe(() => {
        this.queryData$.next();
      })
      // this.queryPredictions$().subscribe()
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

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

  postPredictions$ = (orginLabels: PredictionLabel[]) =>
    forkJoin(
      orginLabels.map(label => from(this.apiservice.CreatePrediction(label)))
    )

}
