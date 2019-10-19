import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Amplify, { PubSub, API, Storage } from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());
if (environment.production) {
  enableProdMode();
}

PubSub.configure(awsconfig);
API.configure(awsconfig);
Storage.configure({ level: 'private' });

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
