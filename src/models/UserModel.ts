import {StoreModel} from "../models/StoreModel";
export class UserModel extends StoreModel {

    constructor(data: {user: string, pass: string, reason: string, authenticated: boolean, businessId: number, rememberMe: boolean, authTime?: Date}) {
        super(data);
    }

    public setTime() {
        return this.setKey<UserModel>(UserModel, 'authTime', new Date());
    }

    public getTime() {
        return this.getKey('authTime');
    }

    setAuthenticated(value:boolean) {
        return this.setKey<UserModel>(UserModel, 'authenticated', value);
    }

    getAuthenticated(): boolean {
        return this.getKey('authenticated');
    }

    user() {
        return this.getKey('user');
    }

    pass() {
        return this.getKey('pass');
    }

    setReason(value:number) {
        return this.setKey<UserModel>(UserModel, 'reason', value);
    }

    getReason(): boolean {
        return this.getKey('reason');
    }

    setBusinessId(value:number) {
        return this.setKey<UserModel>(UserModel, 'businessId', value);
    }

    getBusinessId(): boolean {
        return this.getKey('businessId');
    }

    businessId() {
        return this.getKey('businessId');
    }

    rememberMe() {
        return this.getKey('rememberMe');
    }


    // public setField(i_field, i_value) {
    //     var value = this.getKey('Value');
    //     value[i_field] = i_value;
    //     return this.setKey<AdnetRateModel>(AdnetRateModel, 'Value', value);
    // }

}