import { MainState } from './main.state';
import { MainActionsTypes } from './main.actions';
import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';
import { SaveObject } from 'src/app/models/save-object.model';

export const mainAppState: MainState = {
 userInfo: new User(),
 patientInfo: new Patient(),
 saveData: new SaveObject(),
 canvasUrl: null,
 prevCanvasUrl: null
};

export function mainReducer(state = mainAppState, action: any): MainState {

    switch (action.type) {

        case MainActionsTypes.SET_USER_INFO: {
            return Object.assign(state, {
                ...state,
                userInfo: action.payload
            });
        }

        case MainActionsTypes.SET_PATIENT_INFO: {
            return Object.assign(state, {
                ...state,
                patientInfo: action.payload
            });
        }

        case MainActionsTypes.SET_CANVAS_URL: {
            return Object.assign(state, {
                ...state,
                canvasUrl: action.payload
            });
        }

        case MainActionsTypes.SET_PREV_CANVAS_URL: {
            return Object.assign(state, {
                ...state,
                prevCanvasUrl: action.payload
            });
        }

        case MainActionsTypes.SET_SAVE_DATA: {
            return Object.assign(state, {
                ...state,
                saveData: action.payload
            });
        }

        default: {
            return state;
        }
    }
}
