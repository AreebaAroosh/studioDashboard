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
        .switchMap(action => this.authUser(action))
        .map(allUserData => ({type: AUTH_END, payload: allUserData}));

    authUser(action): Observable<any> {
        return this.store.select(store => store.appDb.appBaseUrl)
            .take(1)
            .mergeMap(baseUrl => {
                console.log(action);
                var i_user = 'reseller@ms.com'
                var i_pass = '123123'
                const url = `${baseUrl}?command=GetCustomers&resellerUserName=${i_user}&resellerPassword=${i_pass}`;
                return this.http.get(url)
                    .map(res => {


                        var xmlData = res.text()

                        function callback(datum, cb) {
                            cb('aaaa ' + datum);
                        }
                        const boundCallback = Observable.bindCallback(this.processXml, (xmlData: any) => xmlData);
                        const results = [];
                        boundCallback(this, xmlData)
                            .subscribe((x) => {
                                results.push(x);
                            }, null, () => {
                                results.push('done');
                            });


                        const hello = (message, callback) => callback(`Hello ${message}`);
                        const sayHello = Observable.bindCallback(hello);
                        const source = sayHello(' world');
                        console.log(source);
                        return source;

                    }).map(final=>{
                        return final;
                    })
            })

    }

    private authenticateUser(i_user, i_pass, i_remember): any {
        var self = this;


        this.store.select(store => store.appDb.appBaseUrl).take(1).subscribe((baseUrl) => {
            const url = `${baseUrl}?command=GetCustomers&resellerUserName=${i_user}&resellerPassword=${i_pass}`;
            return this.http.get(url)
                .map(result => {
                    var xmlData: string = result.text()
                    // return Observable.of(processXml(xmlData));
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

    // private authUser(userId:number): Observable<any> {
    //     return this.http.get('/api/threads')
    //         .map(res => res.json());
    // }

    private processXml(context, xmlData, cb) {
        context.parseString(xmlData, {attrkey: 'attr'}, function (err, result) {
            if (err || !result)
                return cb(null);
            return cb(result);
        })

    }

    public initAppDb() {
        return {
            type: APP_INIT,
            payload: Date.now()
        }
    }
}
