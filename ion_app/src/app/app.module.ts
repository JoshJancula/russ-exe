import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainStateActions } from './redux-store/main/main.actions';
import { StoreModule } from '@ngrx/store';
import { reducers } from './redux-store/app.reducer';
import { storageSyncMetaReducer } from 'ngrx-store-persist';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
     IonicModule.forRoot(),
     StoreModule.forRoot(reducers, { metaReducers: [storageSyncMetaReducer] }),
      AppRoutingModule
    ],
  providers: [
    StatusBar,
    MainStateActions,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}