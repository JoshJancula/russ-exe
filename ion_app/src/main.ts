import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { getAllDataFromLocalForage, default as localForage } from 'ngrx-store-persist';

if (environment.production) {
  enableProdMode();
}

if (environment.persistRedux) {
  getAllDataFromLocalForage({
    driver: localForage.LOCALSTORAGE,
    keys: ['main'],
  }).then(() => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.log(err));
  });
} else {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
}
