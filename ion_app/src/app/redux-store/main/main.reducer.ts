import { MainState } from './main.state';
import { MainActionTypes } from './main.actions';
import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';
import { BurnFormData } from 'src/app/models/burn-form-data.model';

export const mainAppState: MainState = {
 userInfo: new User(),
 patientInfo: new Patient(),
 burnFormData: new BurnFormData(),
 canvasUrl: null,
 prevCanvasUrl: null,
 isInEditMode: false
};

export function mainReducer(state = mainAppState, action: any): MainState {

    switch (action.type) {

        case MainActionTypes.SET_USER_INFO: {
            return Object.assign(state, {
                ...state,
                userInfo: action.payload
            });
        }

        case MainActionTypes.SET_PATIENT_INFO: {
            return Object.assign(state, {
                ...state,
                patientInfo: action.payload
            });
        }

        case MainActionTypes.SET_CANVAS_URL: {
            return Object.assign(state, {
                ...state,
                canvasUrl: action.payload
            });
        }

        case MainActionTypes.SET_PREV_CANVAS_URL: {
            return Object.assign(state, {
                ...state,
                prevCanvasUrl: action.payload
            });
        }

        case MainActionTypes.SET_BURN_FORM_DATA: {
            return Object.assign(state, {
                ...state,
                burnFormData: action.payload
            });
        }

        case MainActionTypes.SET_EDIT_MODE: {
            return Object.assign(state, {
                ...state,
                isInEditMode: action.payload
            });
        }

        default: {
            return state;
        }
    }
}
