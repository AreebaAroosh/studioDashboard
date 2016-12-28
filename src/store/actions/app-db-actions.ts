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

    @Effect() userThreads$: Observable<Action> = this.actions$
        .ofType(AUTH_START)
        .debug("action received")
        .switchMap(action => this.loadUserThreads('1', '2', '3'))
        .debug("data received via the HTTP request")
        .map(allUserData => ({type: AUTH_END, payload: allUserData}));

    loadUserThreads(a, b, c): Observable<any> {
        return this.store.select(store => store.appDb.appBaseUrl)
            .take(1)
            .debug('aaa')
            .mergeMap(url => {
                return this.http.get(url)
                    .debug('received ' + url)
                    .map(res => res.json())
            })

    }

    private authenticateUser(i_user, i_pass, i_remember): any {
        var self = this;
        var processXml = (xmlData) => {
            this.parseString(xmlData, {attrkey: 'attr'}, function (err, result) {
                if (!result) {
                    self.store.dispatch({
                        type: AUTH_FAIL,
                        payload: {
                            authenticated: AuthState.FAIL,
                            user: i_user,
                            pass: i_pass,
                            remember: i_remember,
                            reason: FlagsAuth.WrongPass
                        }
                    });
                } else if (result && !result.Businesses) {
                    self.store.dispatch({
                        type: AUTH_FAIL,
                        payload: {
                            authenticated: AuthState.FAIL,
                            user: i_user,
                            pass: i_pass,
                            remember: i_remember,
                            reason: FlagsAuth.NotEnterprise
                        }

                    });
                } else {
                    // Auth passed, next check if two factor enabled
                    // self.twoFactorCheck(i_user, i_pass).subscribe((twoFactorResult) => {
                    //     if (twoFactorResult.enabled == false) {
                    //         var eventType = AUTH_PASS;
                    //         var authState = AuthState.PASS;
                    //     } else {
                    //         var eventType = AUTH_PASS_WAIT_TWO_FACTOR;
                    //         var authState = AuthState.TWO_FACTOR;
                    //     }
                    //     dispatch({
                    //         type: eventType,
                    //         authenticated: authState,
                    //         user: i_user,
                    //         pass: i_pass,
                    //         businessId: twoFactorResult.businessId,
                    //         remember: i_remember,
                    //         reason: FlagsAuth.Enterprise
                    //     });
                    // })
                }
            });
        }

        this.store.select(store => store.appDb.appBaseUrl).take(1).subscribe((baseUrl) => {
            const url = `${baseUrl}?command=GetCustomers&resellerUserName=${i_user}&resellerPassword=${i_pass}`;
            return this.http.get(url)
                .map(result => {
                    var xmlData: string = result.text()
                    return Observable.of(processXml(xmlData));
                });
            // if (this.offlineEnv) {
            //     this.http.get('offline/getCustomers.xml').subscribe((result) => {
            //         var xmlData: string = result.text()
            //         processXml(xmlData);
            //     })
            //     this.http.get('offline/customerRequest.json').subscribe((result) => {
            //         var jData: string = result.json();
            //     })
            // } else {
            //     this.http.get(url)
            //         .map(result => {
            //             var xmlData: string = result.text()
            //             processXml(xmlData);
            //         }).subscribe()
            // }
        });

    }

    // private loadUserThreads(userId:number): Observable<any> {
    //     return this.http.get('/api/threads')
    //         .map(res => res.json());
    // }

    public initAppDb() {
        return {
            type: APP_INIT,
            payload: Date.now()
        }
    }
}
