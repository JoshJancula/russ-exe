export class User {

    userName: string = null;
    userEsig: string = null;
    userId: string = null;

    constructor(values?: any) {
        if (values) {
            Object.keys(values).forEach(key => {
                this[key] = values[key];
            });
        }
    }
}
