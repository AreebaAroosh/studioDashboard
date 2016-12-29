import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
// import {Actions, AppStore} from "angular2-redux-util";
import {BusinessModel} from "./BusinessModel";
import {Map, List} from 'immutable';
import {BusinessUser} from "./BusinessUser";
import {Subject} from "rxjs/Subject";
import {BusinessSourcesModel} from "./BusinessSourcesModel";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import {SampleModel} from "../business/SampleModel";
import {Lib} from "../Lib";
import * as _ from 'lodash'
import * as xml2js from 'xml2js'
import {ApplicationState} from "../store/application-state";
import {Store} from "@ngrx/store";

export const REQUEST_BUSINESS_USER = 'REQUEST_BUSINESS_USER';
export const RECEIVE_BUSINESSES_SOURCES = 'RECEIVE_BUSINESSES_SOURCES';
export const RECEIVE_BUSINESS_USER = 'RECEIVE_BUSINESS_USER';
export const RECEIVE_BUSINESS_SAMPLES = 'RECEIVE_BUSINESS_SAMPLES';
export const REQUEST_BUSINESSES = 'REQUEST_BUSINESSES';
export const RECEIVE_BUSINESSES = 'RECEIVE_BUSINESSES';
export const RECEIVE_BUSINESSES_STATS = 'RECEIVE_BUSINESSES_STATS';
export const SET_BUSINESS_DATA = 'SET_BUSINESS_DATA';
export const SET_BUSINESS_ACCOUNT_DATA = 'SET_BUSINESS_ACCOUNT_DATA';
export const CHANGE_BUSINESS_USER_NAME = 'CHANGE_BUSINESS_USER_NAME';
export const SET_BUSINESS_USER_ACCESS = 'SET_BUSINESS_USER_ACCESS';
export const ADD_BUSINESS_USER = 'ADD_BUSINESS_USER';
export const REMOVE_BUSINESS = 'REMOVE_BUSINESS';
export const REMOVE_BUSINESS_USER = 'REMOVE_BUSINESS_USER';

@Injectable()
export class BusinessAction {
    parseString;
    businessesRequest$: Subject<any>;
    unsub;

    constructor(private _http: Http, private appStore: Store<ApplicationState>) {
        this.parseString = xml2js.parseString;
        // this.parseString = require('xml2js').parseString;
        this.listenFetchBusinessUser();
    }

    private listenFetchBusinessUser() {
        var self = this;
        this.businessesRequest$ = new Subject();
        // this.unsub = this.businessesRequest$
        //     .map(v => {
        //         return v;
        //     })
        //     .debounceTime(100)
        //     .switchMap((values: {businessIds: Array<string>, dispatch: (value: any) => any}): any => {
        //         if (values.businessIds.length == 0)
        //             return 'CANCEL_PENDING_NET_CALLS';
        //         var businessIds: string = values.businessIds.join('.');
        //         var dispatch = values.dispatch;
        //         var appdb: Map<string,any> = this.appStore.getState().appdb;
        //         var url = appdb.get('appBaseUrlUser') + `&command=GetBusinessUsers&businessList=${businessIds}`;
        //         return this._http.get(url)
        //             .map(result => {
        //                 var xmlData: string = result.text()
        //                 // xmlData = xmlData.replace(/}\)/, '').replace(/\(\{"result":"/, '');
        //                 this.parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
        //                     var businessUsers: List<BusinessUser> = List<BusinessUser>();
        //                     for (var business of result.Users.User) {
        //                         const businessUser: BusinessUser = new BusinessUser({
        //                             accessMask: business._attr.accessMask,
        //                             privilegeId: business._attr.privilegeId,
        //                             password: '',
        //                             name: business._attr.name,
        //                             businessId: business._attr.businessId,
        //                         });
        //                         businessUsers = businessUsers.push(businessUser)
        //                     }
        //                     dispatch(self.receiveBusinessUsers(businessUsers));
        //                 });
        //             });
        //     }).publish().connect()
        // // }).share().subscribe()

    }

    public fetchBusinessUser(businessIds: Array<string>) {
        return (dispatch) => {
            dispatch(this.requestBusinessUser());
            this.businessesRequest$.next({businessIds: businessIds, dispatch: dispatch});
        };
    }

    public findBusinessIndex(business: BusinessModel|BusinessUser, businesses: List<BusinessModel|BusinessUser>): number {
        var res = businesses.findIndex((i_business: BusinessModel|BusinessUser) => {
            return i_business.getBusinessId() === business.getBusinessId();
        });
        return Lib.CheckFoundIndex(res);
    }

    public findBusinessIndexById(businessId: string, businesses: List<BusinessModel|BusinessUser>): number {
        var res = businesses.findIndex((i_business: BusinessModel|BusinessUser) => {
            return businessId === i_business.getBusinessId();
        });
        return Lib.CheckFoundIndex(res);
    }

   

    /**
     * Redux middleware action for getting server businesses
     * **/
    public setBusinessField(businessId: string, key: string, value: any) {
        return {
            type: SET_BUSINESS_DATA,
            businessId: businessId,
            key: key,
            value: value
        }
    }

    public setBusinessUserName(businessId: string, key: string, value: any) {
        return {
            type: CHANGE_BUSINESS_USER_NAME,
            businessId: businessId,
            key: key,
            value: value
        }
    }




   


    public saveAccountInfo(payload) {
        return {
            type: SET_BUSINESS_ACCOUNT_DATA,
            payload: payload
        }

    }

    public requestBusinessUser() {
        return {type: REQUEST_BUSINESS_USER};
    }

    public requestBusinesses() {
        return {type: REQUEST_BUSINESSES};
    }

    public receiveBusinesses(businesses) {
        return {
            type: RECEIVE_BUSINESSES,
            businesses
        }
    }

    public receiveBusinessesSources(businessSources) {
        return {
            type: RECEIVE_BUSINESSES_SOURCES,
            businessSources
        }
    }

    public receiveBusinessUsers(businessUsers: List<BusinessUser>) {
        return {
            type: RECEIVE_BUSINESS_USER,
            businessUsers
        }
    }

    public receiveBusinessSamples(sampleModels: List<SampleModel>) {
        return {
            type: RECEIVE_BUSINESS_SAMPLES,
            sampleModels
        }
    }

    public receiveBusinessesStats(stats) {
        return {
            type: RECEIVE_BUSINESSES_STATS,
            stats
        }
    }

    // ngOnDestroy() {
    //     this.unsub.unsubscribe();
    // }

}
