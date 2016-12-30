import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/debounceTime";
import * as xml2js from "xml2js";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../application-state";
import {Actions} from "@ngrx/effects";
import {Observable} from "rxjs";
import {ACTION_TWO_FACTOR_REMOVED} from "../effects/app-db-effects";

export const APP_INIT = 'APP_INIT';

export enum AuthenticateFlags {
    NONE,
    USER_ACCOUNT,
    ENTERPRISE_ACCOUNT,
    WRONG_TWO_FACTOR,
    WRONG_PASS,
    TWO_FACTOR_ENABLED,
    AUTH_PASS_NO_TWO_FACTOR,
    TWO_FACTOR_CHECK,
    TWO_FACTOR_FAIL,
    TWO_FACTOR_PASS,
    TWO_FACTOR_UPDATE_PASS,
    TWO_FACTOR_UPDATE_FAIL
}

@Injectable()
export class AppdbAction {
    parseString;

    constructor(private actions$: Actions, @Inject('OFFLINE_ENV') private offlineEnv, private store: Store<ApplicationState>, private http: Http) {
        this.parseString = xml2js.parseString;
    }

    public getQrCodeTwoFactor(): Observable<string> {
        return this.store.select(store => store.appDb.appBaseUrlCloud)
            .take(1)
            .mergeMap(appBaseUrlCloud => {
                var url = appBaseUrlCloud.replace('END_POINT', 'twoFactorGenQr');
                return this.http.get(url)
                    .catch((err: any) => {
                        return Observable.throw(err);
                    })
                    .map(res => {
                        this.store.dispatch({type: ACTION_TWO_FACTOR_REMOVED})
                        return res.text();
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
