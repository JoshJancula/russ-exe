import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { BurnFormData } from 'src/app/models/burn-form-data.model';
import { Patient } from 'src/app/models/patient.model';

@Injectable()

export class MainStateSelectors {

    constructor(private store: Store<AppState>) {}

    canvasUrl: Observable<string> =  this.store.select(state => state.main.canvasUrl);
    userInfo: Observable<User> = this.store.select(state => state.main.userInfo);
    burnFormData: Observable<BurnFormData> = this.store.select(state => state.main.burnFormData);
    patientInfo: Observable<Patient> = this.store.select(state => state.main.patientInfo);

}
