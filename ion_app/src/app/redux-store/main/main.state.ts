import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';
import { SaveObject } from 'src/app/models/save-object.model';

export interface MainState {
    userInfo: User;
    patientInfo: Patient;
    saveData: SaveObject;
    canvasUrl: string;
    prevCanvasUrl: string;
    isInEditMode: boolean;
}
