import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';
import { BurnFormData } from 'src/app/models/burn-form-data.model';

export interface MainState {
    userInfo: User;
    patientInfo: Patient;
    burnFormData: BurnFormData;
    canvasUrl: string;
    prevCanvasUrl: string;
    isInEditMode: boolean;
}
