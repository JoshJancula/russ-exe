import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';
import { BurnFormData } from 'src/app/models/burn-form-data.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

export const MainActionTypes = {
  SET_USER_INFO: 'SET_USER_INFO',
  SET_PATIENT_INFO: 'SET_PATIENT_INFO',
  SET_CANVAS_URL: 'SET_CANVAS_URL',
  SET_PREV_CANVAS_URL: 'SET_PREV_CANVAS_URL',
  SET_BURN_FORM_DATA: 'SET_BURN_FORM_DATA',
  SET_EDIT_MODE: 'SET_EDIT_MODE'
};

@Injectable()
export class MainStateActions {

  constructor(
    private store: Store<AppState>,
    private apiService: ApiService
  ) {
  }

  public setUserInfo(data: any): void {
    return this.store.dispatch({ type: MainActionTypes.SET_USER_INFO, payload: new User(data) });
  }

  public setPatientInfo(data: any): void {
    return this.store.dispatch({ type: MainActionTypes.SET_PATIENT_INFO, payload: new Patient(data) });
  }

  public setCanvasUrl(url: string): void {
    return this.store.dispatch({ type: MainActionTypes.SET_CANVAS_URL, payload: url });
  }

  public setPrevCanvasUrl(url: string): void {
    return this.store.dispatch({ type: MainActionTypes.SET_PREV_CANVAS_URL, payload: url });
  }

  public setburnFormData(data: any): void {
    return this.store.dispatch({ type: MainActionTypes.SET_BURN_FORM_DATA, payload: new BurnFormData(data) });
  }

  private setEditMode(bool: boolean): void {
    return this.store.dispatch({ type: MainActionTypes.SET_EDIT_MODE, payload: bool });
  }

  public async fetchSavedData(): Promise<void> {
    return await this.apiService.getAppData().then((res: any) => {
      this.setPatientInfo(res.patient_data);
      this.setUserInfo(res.user_data);
      if (!res.data_object.tableData) {
        this.setEditMode(false);
        this.setburnFormData({ ...res.data_object, ...{ tableData: environment.defaultTableData } });
      } else {
        this.setEditMode(true);
        this.setburnFormData(res.data_object);
      }
      this.setCanvasUrl(res.canvas_string);
    }).catch((err: any) => {
      if (environment.enableTestData) {
        this.setPatientInfo(environment.defaultPatientInfo);
        this.setUserInfo(environment.defaultUserData);
        this.setburnFormData({ ...environment.dummyDataObject, ...{ tableData: environment.defaultTableData } });
      } else {
        this.setburnFormData({ ...environment.defaultDataObject, ...{ tableData: environment.defaultTableData } });
      }
    });
  }

  public async submitFormData(data: any): Promise<void> {
    return await this.apiService.submitData(data).then(() => {
    }).catch((err: any) => {
      console.log('error.... ', err);
    });
  }

}
