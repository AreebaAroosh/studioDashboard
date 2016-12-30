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
import {UserModel} from "../../models/UserModel";


export const SERVERS_STATUS = 'SERVERS_STATUS';
export const CLOUD_SERVERS = 'CLOUD_SERVERS';

export const AUTH_PASS = 'AUTH_PASS';
export const AUTH_PASS_WAIT_TWO_FACTOR = 'AUTH_PASS_WAIT_TWO_FACTOR';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_START = 'AUTH_START';
export const AUTH_END = 'AUTH_END';
export const TWO_FACTOR_SERVER_RESULT = 'TWO_FACTOR_SERVER_RESULT';


export const ACTION_UPDATE_USER_MODEL = 'ACTION_UPDATE_USER_MODEL';
export const ACTION_AUTH_STATUS = 'ACTION_AUTH_STATUS';
export const ACTION_TWO_FACTOR_AUTH = 'ACTION_TWO_FACTOR_AUTH';
export const APP_INIT = 'APP_INIT';


export enum AuthenticateFlags {
    USER_ACCOUNT,
    ENTERPRISE_ACCOUNT,
    WRONG_TWO_FACTOR,
    WRONG_PASS,
    TWO_FACTOR_ENABLED,
    TWO_FACTOR_DISABLED,
    TWO_FACTOR_CHECK,
    TWO_FACTOR_FAIL,
    TWO_FACTOR_PASS
}

@Injectable()
export class AppdbAction {
    parseString;

    constructor(private actions$: Actions, @Inject('OFFLINE_ENV') private offlineEnv, private store: Store<ApplicationState>, private http: Http) {
        this.parseString = xml2js.parseString;
    }

    @Effect() authTwoFactor$: Observable<Action> = this.actions$
        .ofType(ACTION_TWO_FACTOR_AUTH)
        .switchMap(action => this.authTwoFactor(action))
        .map(authStatus => ({type: AUTH_END, payload: authStatus}));

    private authTwoFactor(action: Action): Observable<any> {
        this.store.dispatch({type: ACTION_AUTH_STATUS, payload: AuthenticateFlags.TWO_FACTOR_CHECK})

        return this.store.select(store => store.appDb.appBaseUrlCloud)
            .take(1)
            .mergeMap(baseUrl => {
                const url = baseUrl.replace('END_POINT', 'twoFactor') + `/${action.payload.token}/${action.payload.enable}`
                return this.http.get(url)
                    .catch((err: any) => {
                        alert('Error getting two factor');
                        return Observable.throw(err);
                    })
                    .finally(() => {
                    })
                    .map(res => {
                        var status = res.json();
                        if (status.result) {
                            this.store.dispatch({type: ACTION_AUTH_STATUS, payload: AuthenticateFlags.TWO_FACTOR_PASS})
                        } else {
                            this.store.dispatch({type: ACTION_AUTH_STATUS, payload: AuthenticateFlags.TWO_FACTOR_FAIL})
                        }
                        // userModel = userModel.setAuthenticated(true);
                        // userModel = userModel.setAccountType(AuthenticateFlags.USER_ACCOUNT);
                        // this.store.dispatch({type: ACTION_UPDATE_USER_MODEL, payload: userModel});
                    })
            })
    }

    @Effect() authUser$: Observable<Action> = this.actions$
        .ofType(AUTH_START)
        .switchMap(action => this.authUser(action))
        .map(authStatus => ({type: AUTH_END, payload: authStatus}));

    private authUser(action: Action): Observable<any> {
        let userModel: UserModel = action.payload;
        this.store.dispatch({type: ACTION_UPDATE_USER_MODEL, payload: userModel});

        return this.store.select(store => store.appDb.appBaseUrl)
            .take(1)
            .mergeMap(baseUrl => {
                const url = `${baseUrl}?command=GetCustomers&resellerUserName=${userModel.user()}&resellerPassword=${userModel.pass()}`;
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
                            userModel = userModel.setAuthenticated(false);
                            userModel = userModel.setAccountType(-1);
                            this.store.dispatch({type: ACTION_UPDATE_USER_MODEL, payload: userModel});
                            this.store.dispatch({type: ACTION_AUTH_STATUS, payload: AuthenticateFlags.WRONG_PASS})
                            return;

                        } else if (result && !result.Businesses) {
                            userModel = userModel.setAuthenticated(true);
                            userModel = userModel.setAccountType(AuthenticateFlags.USER_ACCOUNT);
                            this.store.dispatch({type: ACTION_UPDATE_USER_MODEL, payload: userModel});
                            this.store.dispatch({
                                type: ACTION_AUTH_STATUS, payload: AuthenticateFlags.USER_ACCOUNT
                            });

                        } else {
                            userModel = userModel.setAuthenticated(true);
                            userModel = userModel.setAccountType(AuthenticateFlags.ENTERPRISE_ACCOUNT);
                            this.store.dispatch({type: ACTION_UPDATE_USER_MODEL, payload: userModel});
                            this.store.dispatch({
                                type: ACTION_AUTH_STATUS, payload: AuthenticateFlags.ENTERPRISE_ACCOUNT
                            });
                        }

                        // if passed check for two factor
                        if (userModel.getAuthenticated()) {
                            this.twoFactorCheck()
                                .take(1)
                                .subscribe((twoFactorResult) => {
                                    userModel = userModel.setBusinessId(twoFactorResult.businessId);
                                    userModel = userModel.setTwoFactorRequired(twoFactorResult.enabled);
                                    this.store.dispatch({type: ACTION_UPDATE_USER_MODEL, payload: userModel});
                                    if (twoFactorResult.enabled) {
                                        this.store.dispatch({
                                            type: ACTION_AUTH_STATUS,
                                            payload: AuthenticateFlags.TWO_FACTOR_ENABLED
                                        });
                                    } else {
                                        this.store.dispatch({
                                            type: ACTION_AUTH_STATUS,
                                            payload: AuthenticateFlags.TWO_FACTOR_DISABLED
                                        });
                                    }
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

    private twoFactorCheck(): Observable<any> {
        return this.store.select(store => store.appDb.appBaseUrlCloud)
            .take(1)
            .mergeMap(appBaseUrlCloud => {
                var url = appBaseUrlCloud.replace('END_POINT', 'twoFactorCheck');
                return this.http.get(url)
                    .catch((err: any) => {
                        return Observable.throw(err);
                    })
                    .map(res => {
                        return res.json()
                    })
            })
    }

    // public authenticateTwoFactor(i_token: string, i_enable: boolean) {
    //     return (dispatch) => {
    //         var appdb: Map<string,any> = this.appStore.getState().appdb;
    //         var url = appdb.get('appBaseUrlCloud').replace('END_POINT', 'twoFactor') + `/${i_token}/${i_enable}`
    //         this._http.get(url)
    //             .map(result => {
    //                 dispatch({
    //                     type: TWO_FACTOR_SERVER_RESULT,
    //                     status: result.json().result
    //                 })
    //             }).subscribe()
    //     };
    // }

    public initAppDb() {
        return {
            type: APP_INIT,
            payload: Date.now()
        }
    }
}
