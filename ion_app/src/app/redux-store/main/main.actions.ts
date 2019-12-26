import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';
import { SaveObject } from 'src/app/models/save-object.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

export const MainActionsTypes = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_PATIENT_INFO: 'SET_PATIENT_INFO',
  SET_CANVAS_URL: 'SET_CANVAS_URL',
  SET_PREV_CANVAS_URL: 'SET_PREV_CANVAS_URL',
  SET_SAVE_DATA: 'SET_SAVE_DATA'
};

@Injectable()
export class MainStateActions {

  constructor(
    private store: Store<AppState>,
    private apiService: ApiService
  ) { }

  public setUserInfo(data: any): void {
    return this.store.dispatch({ type: MainActionsTypes.SET_USER_INFO, payload: new User(data) });
  }

  public setPatientInfo(data: any): void {
    return this.store.dispatch({ type: MainActionsTypes.SET_PATIENT_INFO, payload: new Patient(data) });
  }

  public setCanvasUrl(url: string): void {
    return this.store.dispatch({ type: MainActionsTypes.SET_CANVAS_URL, payload: url });
  }

  public setPrevCanvasUrl(url: string): void {
    return this.store.dispatch({ type: MainActionsTypes.SET_PREV_CANVAS_URL, payload: url });
  }

  public setSaveData(data: any): void {
    return this.store.dispatch({ type: MainActionsTypes.SET_SAVE_DATA, payload: new SaveObject(data) });
  }

  public async getElectronArgs(): Promise<any> {
    return this.apiService.getArgs().then((res: any) => {
      console.log('electron args... ', res);
    }).catch((e: any) => {
      console.log('e.... ', e);
    });
  }

  public async fetchSavedData(): Promise<any> {
    return this.apiService.getAppData().then((res: any) => {
      console.log('data... ', res);
    }).catch((err: any) => {
      console.log('error.... ', err);
      if (environment.enableTestData) {
        // set fake data
        this.setPatientInfo(environment.defaultPatientInfo);
        this.setUserInfo(environment.defaultUserData);
        this.setSaveData({...environment.defaultDataObject, ...{ tableData: environment.defaultTableData }});
      }
    });
  }

}
