export class Patient {

    patientName: string = null;
    medRecno: string = null;
    acctNo: string = null;
    patientAge: number = 0;
    birthDate: string = null;
    patientSex: string = null;
    admitDate: string = null;

    constructor(values?: any) {
        if (values) {

            if (values.patientAge && typeof values.patientAge === 'string') {
                values.patientAge = parseFloat(values.patientAge);
            }

            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
