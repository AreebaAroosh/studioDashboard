import {StoreModel} from "../models/StoreModel";
export class UserModel extends StoreModel {

    constructor(data: any = {}) {
        super(data);
    }

    // public setId(value) {
    //     return this.setKey<AdnetRateModel>(AdnetRateModel,'Key',value);
    // }

    authenticated() {
        return this.getKey('authenticated');
    }

    user() {
        return this.getKey('user');
    }

    pass() {
        return this.getKey('pass');
    }

    reason() {
        return this.getKey('reason');
    }

    businessId() {
        return this.getKey('businessId');
    }

    // public setField(i_field, i_value) {
    //     var value = this.getKey('Value');
    //     value[i_field] = i_value;
    //     return this.setKey<AdnetRateModel>(AdnetRateModel, 'Value', value);
    // }

}