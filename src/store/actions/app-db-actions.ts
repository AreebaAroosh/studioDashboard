import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/debounceTime";
import * as xml2js from "xml2js";
import {Action, Store} from "@ngrx/store";
import {ApplicationState} from "../application-state";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import * as _ from 'lodash';


export const SERVERS_STATUS = 'SERVERS_STATUS';
export const CLOUD_SERVERS = 'CLOUD_SERVERS';
export const AUTH_PASS = 'AUTH_PASS';
export const AUTH_PASS_WAIT_TWO_FACTOR = 'AUTH_PASS_WAIT_TWO_FACTOR';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_START = 'AUTH_START';
export const AUTH_END = 'AUTH_END';
export const TWO_FACTOR_SERVER_RESULT = 'TWO_FACTOR_SERVER_RESULT';


export const APP_INIT = 'APP_INIT';

export enum AuthState {
    FAIL,
    PASS,
    TWO_FACTOR
}


export enum FlagsAuth {
    WrongPass,
    NotEnterprise,
    Enterprise,
    WrongTwoFactor
}

@Injectable()
export class AppdbAction {
    parseString;

    constructor(private actions$: Actions, @Inject('OFFLINE_ENV') private offlineEnv, private store: Store<ApplicationState>, private http: Http) {
        this.parseString = xml2js.parseString;
    }

    // action.payload['user'], action.payload['pass'], action.payload['remember']

    // @Effect() userThreads$: Observable<Action> = this.actions$
    //     .ofType(AUTH_START)
    //     .switchMap(action => this.authUser(action))
    //     .map(allUserData => ({type: AUTH_END, payload: allUserData}));
    // authUser(action): Observable<any> {
    //     return this.store.select(store => store.appDb.appBaseUrl)
    //         .take(1)
    //         .mergeMap(baseUrl => {
    //             const url = `${baseUrl}?command=GetCustomers&resellerUserName=${action.payload.user}&resellerPassword=${action.payload.pass}`;
    //             return this.http.get(url)
    //                 .catch((err:any) => {
    //                     alert('Error getting order details');
    //                     return Observable.throw(err);
    //                 })
    //                 .finally(() => {
    //                 })
    //                 .map(res => {
    //                     return res.text()
    //                 }).flatMap((i_xmlData: string) => {
    //                     const boundCallback = Observable.bindCallback(this.processXml, (xmlData: any) => xmlData);
    //                     return boundCallback(this, i_xmlData)
    //                 }).map(businessData => {
    //                     if (_.isNull(businessData))
    //                         return ({})
    //                     return businessData;
    //                 })
    //         })
    // }



    @Effect() userThreads$: Observable<Action> = this.actions$
        .ofType(AUTH_START)
        .switchMap(action => this.authUser(action))
        .map(authStatus => ({type: AUTH_END, payload: authStatus}));

    private authUser(action): Observable<any> {
        action.payload.user = 'reseller@ms.com';
        action.payload.pass = '123123';

        this.store.dispatch({
            type: 'ACTION_AUTH_PROGRESS',
            payload: {
                result: '',
                authenticated: '',
                user: action.payload.user,
                pass: action.payload.pass,
                remember: action.payload.remember,
                reason: ''
            }
        });
        return this.store.select(store => store.appDb.appBaseUrl)
            .take(1)
            .mergeMap(baseUrl => {
                const url = `${baseUrl}?command=GetCustomers&resellerUserName=${action.payload.user}&resellerPassword=${action.payload.pass}`;
                return this.http.get(url)
                    .catch((err: any) => {
                        alert('Error getting order details');
                        return Observable.throw(err);
                    })
                    .finally(() => {
                    })
                    .map(res => {
                        return res.text()
                    }).flatMap((i_xmlData: string) => {
                        const boundCallback = Observable.bindCallback(this.processXml, (xmlData: any) => xmlData);
                        return boundCallback(this, i_xmlData)
                    }).map(result => {
                        if (_.isNull(result)) {
                            return {
                                result: AUTH_FAIL,
                                authenticated: AuthState.FAIL,
                                user: action.payload.user,
                                pass: action.payload.pass,
                                remember: action.payload.remember,
                                reason: 'AuthLoginType.WrongPass'
                            };
                        } else if (result && !result.Businesses) {
                            return {
                                result: AUTH_FAIL,
                                authenticated: AuthState.FAIL,
                                user: action.payload.user,
                                pass: action.payload.pass,
                                remember: action.payload.remember,
                                reason: 'AuthLoginType.NotEnterprise'
                            };
                        } else {
                            // Auth passed, next check if two factor enabled
                            this.twoFactorCheck(action.payload.user, action.payload.pass).subscribe((twoFactorResult) => {
                                if (twoFactorResult.enabled == false) {
                                    var eventType = AUTH_PASS;
                                    var authState = AuthState.PASS;
                                } else {
                                    var eventType = AUTH_PASS_WAIT_TWO_FACTOR;
                                    var authState = AuthState.TWO_FACTOR;
                                }
                                return {
                                    type: eventType,
                                    authenticated: authState,
                                    user: action.payload.user,
                                    pass: action.payload.pass,
                                    businessId: twoFactorResult.businessId,
                                    remember: action.payload.remember,
                                    reason: 'AuthLoginType.Enterprise'
                                };
                            })
                        }
                    })
            })
    }
    private processXml(context, xmlData, cb) {
        context.parseString(xmlData, {attrkey: 'attr'}, function (err, result) {
            if (err || !result)
                return cb(null);
            return cb(result);
        })

    }

    private twoFactorCheck(i_user, i_pass): Observable<any> {
        return this.store.select(store => store.appDb.appBaseUrlCloud)
            .take(1)
            .mergeMap(appBaseUrlCloud => {
                // let appBaseUrlCloud= appBaseUrlCloud.replac;
                var url = appBaseUrlCloud.replace('END_POINT', 'twoFactorCheck');
                console.log(url);
                return this.http.get(url)
                    .catch((err: any) => {
                        return Observable.throw(err);
                    })
                    .map(res => {
                        return res.json()
                    })
            })
    }

    public initAppDb() {
        return {
            type: APP_INIT,
            payload: Date.now()
        }
    }
}
