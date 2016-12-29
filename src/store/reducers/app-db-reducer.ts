import {StoreData, MyStoreData, IAppDb} from "../store-data";
import {Action} from "@ngrx/store";
import * as _ from 'lodash';
import {List, Map} from 'immutable';
import {WeatherModel} from "../model/WeatherModel";
import {WEATHER_LOADED_ACTION} from "../actions";
import {StoreModel} from "../model/StoreModel";
import {UserModel} from "../../models/UserModel";
import * as StoreActions from "../actions/app-db-actions";

const baseUrl = 'https://galaxy.signage.me/WebService/ResellerService.ashx';
// const baseUrl = 'https://secure.digitalsignage.com/Digg';
export const appBaseUrlCloud = 'https://secure.digitalsignage.com';

export function appDb(state: IAppDb, action: any): IAppDb {

    switch (action.type) {

        // case 'RECEIVE_TOTAL_STATIONS':
        //     return state.merge({
        //         totalStations: {
        //             time: Date.now(),
        //             totalStations: action.totalStations
        //         }
        //     });
        //
        // case 'TEST':{
        //     state.credentials = new UserModel({
        //         user: 'sean',
        //         pass: '123'
        //     })
        //     return state;
        // }

        // case 'AUTH_END':
        //     // if (!action.payload.Businesses){
        //     //     console.log('auth fail')
        //     // } else {
        //     //     console.log('auth pass ' + _.size(action.payload.Businesses.BusinessInfo));
        //     // }
        //     return state;

        case StoreActions.APP_INIT:
            state.appStartTime = Date.now();
            state.appBaseUrl = `${baseUrl}`;
            return state;

        case StoreActions.ACTION_AUTH_PROGRESS:
            var userModel:UserModel = action.payload;
            state.userModel = userModel.setTime();
            state.appBaseUrlUser = `${baseUrl}?resellerUserName=${userModel.getKey('user')}&resellerPassword=${userModel.getKey('pass')}`;
            state.appBaseUrlCloud = `${appBaseUrlCloud}/END_POINT/${userModel.getKey('user')}/${userModel.getKey('pass')}`;
            return state;

        case StoreActions.ACTION_AUTH_FAIL:
            var userModel:UserModel = action.payload;
            state.userModel = userModel.setTime();
            return state;

        case StoreActions.ACTION_AUTH_PASS:
            var userModel:UserModel = action.payload;
            state.userModel = userModel.setTime();
            return state;


        //
        // case AppdbAction.TWO_FACTOR_SERVER_RESULT:
        //     return state.set('twoFactorStatus', {
        //         'status': action.status,
        //         'twoFactorStatusReceived': Date.now()
        //     });
        //
        // case 'APP_INIT':
        //     return state.merge({
        //         appStartTime: Date.now(),
        //         appBaseUrl: `${baseUrl}`
        //     });
        //
        // case 'RECEIVE_ACCOUNT_TYPE':
        //     return state.merge({
        //         accountType: action.accountType
        //     });
        //
        // case 'CLOUD_SERVERS':
        //     return state.merge({
        //         cloudServers: action.payload
        //     });
        //
        // case 'SERVERS_STATUS':
        //     return state.merge({serversStatus: action.payload});

        default:
            return state;
    }


}



