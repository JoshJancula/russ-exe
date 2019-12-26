export class SaveObject {

    tableData: any[] = [];
    formType: string = null;
    burnType: string = null;
    skinType: string = null;
    createdBy: any = null;
    dateOfInjury: any = null;
    timeOfInjury: any = null;
    amendmentHistory: any[] = [];

    constructor(values?: any) {
        if (values) {
            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
