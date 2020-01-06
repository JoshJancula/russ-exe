export class User {

    userName: string = null;
    userEsig: string = null;
    userId: string = null;

    constructor(values?: any) {
        if (values) {
            Object.keys(values).map(key => {
                this[key] = values[key];
            });
        }
    }
}
