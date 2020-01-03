import * as moment from 'moment';

export class SaveObject {

    tableData: any[] = [];
    formType: string = 'burn';
    burnType: string = null;
    skinType: string = null;
    createdBy: any = null;
    dateOfInjury: any = null;
    timeOfInjury: any = null;
    amendmentHistory: any[] = [];

    constructor(values?: any) {
        if (values) {

            if (values.dateOfInjury) {
                const m = moment(values.dateOfInjury);
                values.dateOfInjury = m.format('YYYY-MM-DD');
            }

            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
