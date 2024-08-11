export class DynamicParameters {
    private parameters: { [key: string]: { value: any, } };

    constructor() {
        this.parameters = {};
    }

    public Add(name: string, value: any): void {
        this.parameters[name] = { value };
    }

    public Get(name: string): any {
        const param = this.parameters[name];
        return param ? param.value : null;
    }

    public GetAll(): { [key: string]: any } {
        const allParams: { [key: string]: any } = {};
        for (const name in this.parameters) {
            if (this.parameters.hasOwnProperty(name)) {
                allParams[name] = this.parameters[name].value;
            }
        }
        return allParams;
    }
}

