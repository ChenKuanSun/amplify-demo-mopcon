import { Component, OnInit } from '@angular/core';
import { Predictions } from 'aws-amplify';
import { from, BehaviorSubject } from 'rxjs';
import { IdentifyLabelsOutput } from '@aws-amplify/predictions/lib/types';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  loading$ = new BehaviorSubject<boolean>(false);
  labels$ = new BehaviorSubject<any[]>([]);
  displayedColumns = ['label', 'count'];

  constructor() { }

  ngOnInit() {
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

  uploadImage(event: any) {
    this.loading$.next(true);
    // 取得圖片物件
    const img = event.target.files[0];
    this.predictLabel$(img).subscribe({
      next: (predictLabel: IdentifyLabelsOutput) => {
        this.classifyLabel(predictLabel);
        this.loading$.next(false);
      },
      error: () => this.loading$.next(false)
    });
  }

  classifyLabel(predictLabels: IdentifyLabelsOutput) {
    const orginLabels = this.labels$.value;
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
    this.labels$.next(orginLabels);
  }
}
