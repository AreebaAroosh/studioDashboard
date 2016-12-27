import {StoreData, MyStoreData, IAppDb} from "../store-data";
import {Action} from "@ngrx/store";
import * as _ from 'lodash';
import {List, Map} from 'immutable';
import {WeatherModel} from "../model/WeatherModel";
import {WEATHER_LOADED_ACTION} from "../actions";
import {StoreModel} from "../model/StoreModel";



export function appDb (state: IAppDb, action: any): IAppDb {

    switch (action.type) {

        // case 'RECEIVE_TOTAL_STATIONS':
        //     return state.merge({
        //         totalStations: {
        //             time: Date.now(),
        //             totalStations: action.totalStations
        //         }
        //     });
        //
        case 'APP_INIT':
            state.appStartTime = Date.now();
            state.appBaseUrl = 'http';
            return state;
            // return state.merge({
            //     appStartTime: Date.now(),
            //     appBaseUrl: `${baseUrl}`
            // });
        //
        // case 'AUTH_FAIL':
        // case 'AUTH_PASS_WAIT_TWO_FACTOR':
        // case 'AUTH_PASS':
        //     return state.merge({
        //         credentials: {
        //             authenticated: action.authenticated,
        //             user: action.user,
        //             pass: action.pass,
        //             remember: action.remember,
        //             reason: action.reason,
        //             businessId: action.businessId
        //         },
        //         appBaseUrlUser: `${baseUrl}?resellerUserName=${action.user}&resellerPassword=${action.pass}`,
        //         appBaseUrlCloud: `${appBaseUrlCloud}/END_POINT/${action.user}/${action.pass}`
        //     });
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



