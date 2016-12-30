import {Participant} from "../../shared/model/participant";
import {Thread} from "../../shared/model/thread";
import {Message} from "../../shared/model/message";
import {Map, List} from 'immutable';
import {WeatherModel} from "./model/WeatherModel";
import {UserModel} from "../models/UserModel";
import {AuthenticateFlags} from "./actions/app-db-actions";

export interface StoreData {

    participants: { [key: number]: Participant };
    threads: { [key: number]: Thread };
    messages: { [key: number]: Message };

}

export interface MyStoreData {
    local: Map<string,any>;
    customers: List<any>;
    weather: List<WeatherModel>;
}

interface IUserInfo {

}

export interface IAppDb {
    totalStations: string;
    appStartTime: number;
    appBaseUrl: string;
    userModel: UserModel,
    cloudServers: string;
    serversStatus: string;
    appAuthStatus: Map<string,AuthenticateFlags>;
    appBaseUrlUser: string;
    appBaseUrlCloud: string;
}

export const INITIAL_STORE_DATA: StoreData = {
    threads: {},
    messages: {},
    participants: {}
};

export const INITIAL_WEATHER_DATA: MyStoreData = {
    local: Map<string,any>(),
    customers: List<any>([1, 2, 3, 4]),
    weather: List<WeatherModel>()
};

export const INITIAL_APP_DB: IAppDb = {
    totalStations: '',
    appStartTime: -1,
    appBaseUrl: '',
    userModel: new UserModel({
        user: '',
        pass: '',
        authenticated: false,
        businessId: -1,
        rememberMe: false,
        twoFactorRequired: false,
        accountType: -1
    }),
    appAuthStatus: Map({authStatus: AuthenticateFlags.NONE}),
    cloudServers: '',
    serversStatus: '',
    appBaseUrlUser: '',
    appBaseUrlCloud: ''
};