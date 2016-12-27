import {Injectable} from "@angular/core";
import {PrivelegesModel} from "./PrivelegesModel";
import {PrivelegesTemplateModel} from "./PrivelegesTemplateModel";
import * as Immutable from "immutable";
import {List, Map} from "immutable";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/finally";
import "rxjs/add/observable/throw";
import {AppModel} from "./AppModel";
import {WhitelabelModel} from "./WhitelabelModel";
import {AccountModel} from "./AccountModel";
import {Http, Request, RequestOptions, RequestMethod, RequestOptionsArgs} from "@angular/http";
import {CreditService} from "../services/CreditService";
// import * as bootbox from "bootbox";
import * as _ from "lodash";
import * as xml2js from "xml2js";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";

export const RECEIVE_PRIVILEGES = 'RECEIVE_PRIVILEGES';
export const RECEIVE_PRIVILEGES_SYSTEM = 'RECEIVE_PRIVILEGES_SYSTEM';
export const UPDATE_PRIVILEGES = 'UPDATE_PRIVILEGES';
export const UPDATE_PRIVILEGE_NAME = 'UPDATE_PRIVILEGE_NAME';
export const UPDATE_PRIVILEGE_ATTRIBUTE = 'UPDATE_PRIVILEGE_ATTRIBUTE';
export const RECEIVE_DEFAULT_PRIVILEGE = 'RECEIVE_DEFAULT_PRIVILEGE';
export const RECEIVE_APPS = 'RECEIVE_APPS';
export const RECEIVE_WHITELABEL = 'RECEIVE_WHITELABEL';
export const RECEIVE_ACCOUNT_INFO = 'RECEIVE_ACCOUNT_INFO';
export const UPDATE_APP = 'UPDATE_APP';
export const UPDATE_DEFAULT_PRIVILEGE = 'UPDATE_DEFAULT_PRIVILEGE';
export const UPDATE_WHITELABEL = 'UPDATE_WHITELABEL';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const ADD_PRIVILEGE = 'ADD_PRIVILEGE';
export const REMOVE_PRIVILEGE = 'REMOVE_PRIVILEGE';
export const PAY_SUBSCRIBER: number = 4;

@Injectable()
export class ResellerAction {

    constructor(private appStore: Store<ApplicationState>, private _http: Http, private creditService: CreditService) {
        // this.m_parseString = require('xml2js').parseString;
        this.m_parseString = xml2js.parseString;
    }

    private m_parseString;
    private m_privilegesSystemModels: Array<PrivelegesTemplateModel> = [];

    private privilegesModelFactory(i_defaultPrivId, i_defaultPrivName, i_existingGroups?: Array<any>): PrivelegesModel {
        let groups = List();
        let tablesDst = [];
        if (i_existingGroups) {
            i_existingGroups.forEach((privilegesGroups: any)=> {
                var tableName = privilegesGroups._attr.name;
                var visible = privilegesGroups._attr.visible;
                tablesDst.push(tableName)
                var values = {
                    tableName: tableName,
                    visible: visible,
                    columns: Immutable.fromJS(privilegesGroups.Tables["0"]._attr)
                };
                _.forEach(privilegesGroups._attr, (v, k)=> {
                    values[k] = v;
                })
                var group = Map(values);
                groups = groups.push(group);
            })
        }
        // fill up any new or missing tables
        this.m_privilegesSystemModels.forEach((privelegesTemplateModel: PrivelegesTemplateModel)=> {
            var srcTableName = privelegesTemplateModel.getTableName();
            if (tablesDst.indexOf(srcTableName) == -1)
                groups = groups.push(privelegesTemplateModel.getData());
        })
        let privilegesModel: PrivelegesModel = new PrivelegesModel({
            privilegesId: i_defaultPrivId,
            name: i_defaultPrivName,
            groups: groups
        });
        return privilegesModel;
    }

    public getResellerIsActive(): boolean {
        // accountStatus:"value"
        //      0 = not verified
        //      1 = intermediate state while the account is been created
        //      2 = account is created
        //      3 = intermediate state
        //      4 = account paid | this.PAY_SUBSCRIBER

        //todo: fix gets
        // var i_reseller = this.appStore.getState().reseller;
        // var whitelabelModel = i_reseller.getIn(['whitelabel']);
        // if (whitelabelModel && whitelabelModel.getAccountStatus() == PAY_SUBSCRIBER) {
        //     return true;
        // } else {
        //     return false;
        // }
        return true;
    }

    public getResellerInfo() {
        var self = this;
        return (dispatch)=> {
            // var appdb: Map<string,any> = this.appStore.getState().appdb;
            // var url = appdb.get('appBaseUrlUser') + `&command=GetBusinessUserInfo`;
            // this._http.get(url)
            //     .map(result => {
            //         /** put a debugger here to see/add new privilege**/
            //         var xmlData: string = result.text()
            //         this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
            //             if (err) {
            //                 bootbox.alert('problem loading user info')
            //                 return;
            //             }
            //             /**
            //              * redux inject reseller info including white label
            //              **/
            //             var whitelabel = {
            //                 createAccountOption: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Application["0"].CreateAccount ? result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Application["0"].CreateAccount["0"]._attr.show : '',
            //                 chatShow: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Chat["0"]._attr.show,
            //                 twitterShow: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Twitter["0"]._attr.show,
            //                 resellerSourceId: result.User.BusinessInfo[0].SourceInfo["0"]._attr.id,
            //                 whitelabelEnabled: result.User.BusinessInfo["0"].WhiteLabel["0"]._attr.enabled,
            //                 accountStatus: result.User.BusinessInfo["0"]._attr.accountStatus,
            //                 applicationId: result.User.BusinessInfo["0"]._attr.applicationId,
            //                 archiveState: result.User.BusinessInfo["0"]._attr.archiveState,
            //                 businessDescription: result.User.BusinessInfo["0"]._attr.businessDescription,
            //                 businessId: result.User.BusinessInfo["0"]._attr.businessId,
            //                 companyName: result.User.BusinessInfo["0"]._attr.name,
            //                 providerId: result.User.BusinessInfo["0"]._attr.providerId,
            //                 resellerId: result.User.BusinessInfo["0"]._attr.resellerId,
            //                 payerId: result.User.BusinessInfo["0"]._attr.payerId,
            //                 linksContact: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Application["0"].Links["0"]._attr.contact,
            //                 linksDownload: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Application["0"].Links["0"]._attr.download,
            //                 linksHome: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Application["0"].Links["0"]._attr.home,
            //                 logoLink: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Application["0"].Logo["0"]._attr.link,
            //                 logoTooltip: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Application["0"].Logo["0"]._attr.tooltip,
            //                 fileName: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Application["0"].Logo["0"]._attr.filename,
            //                 bannerEmbedReference: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Banner["0"]._attr.embeddedReference,
            //                 chatLink: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Chat["0"]._attr.link,
            //                 mainMenuLink0: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["0"]._attr.href,
            //                 mainMenuId0: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["0"]._attr.id,
            //                 mainMenuLabel0: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["0"]._attr.label,
            //                 mainMenuLink1: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["1"]._attr.href,
            //                 mainMenuId1: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["1"]._attr.id,
            //                 mainMenuLabel1: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["1"]._attr.label,
            //                 mainMenuLink2: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["2"]._attr.href,
            //                 mainMenuId2: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["2"]._attr.id,
            //                 mainMenuLabel2: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["2"]._attr.label,
            //                 mainMenuLink3: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["3"]._attr.href,
            //                 mainMenuId3: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["3"]._attr.id,
            //                 mainMenuLabel3: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["3"]._attr.label,
            //                 mainMenuId4: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["4"]._attr.id,
            //                 mainMenuLink4: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["4"]._attr.href,
            //                 mainMenuLabel4: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"].Command["4"]._attr.label,
            //                 icon: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"]._attr.icon,
            //                 iconId: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"]._attr.id,
            //                 iconLabel: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].MainMenu["0"].CommandGroup["0"]._attr.label,
            //                 twitterLink: result.User.BusinessInfo["0"].WhiteLabel["0"].Studio["0"].Twitter["0"]._attr.link
            //             }
            //             var whitelabelModel: WhitelabelModel = new WhitelabelModel(whitelabel);
            //             dispatch(self.receiveWhitelabel(whitelabelModel));
            //
            //             Lib.AppsXmlTemplate((err, xmlTemplate)=> {
            //
            //                 var isAppInstalled = (i_appId): number => {
            //                     var returns = 0;
            //                     result.User.BusinessInfo["0"].InstalledApps["0"].App.forEach((i_app)=> {
            //                         if (i_appId === i_app._attr.id)
            //                             returns = i_app._attr.installed;
            //                     })
            //                     return returns;
            //                 }
            //                 /**
            //                  * redux inject Apps
            //                  **/
            //                 var userApps: List<AppModel> = List<AppModel>();
            //                 xmlTemplate.Apps.App.forEach((i_app) => {
            //                     var app: AppModel = new AppModel({
            //                         desc: i_app.Description["0"],
            //                         appName: i_app._attr.appName,
            //                         appId: i_app._attr.id,
            //                         installed: isAppInstalled(i_app._attr.id),
            //                         moduleId: i_app.Components["0"].Component["0"]._attr.moduleId,
            //                         uninstallable: i_app._attr.uninstallable,
            //                         showInScene: i_app.Components["0"].Component["0"]._attr.showInScene,
            //                         showInTimeline: i_app.Components["0"].Component["0"]._attr.showInTimeline,
            //                         version: i_app.Components["0"].Component["0"]._attr.version
            //                     });
            //                     userApps = userApps.push(app);
            //                 })
            //                 dispatch(self.receiveApps(userApps));
            //             });
            //
            //             /**
            //              * redux inject privileges XML template system
            //              **/
            //
            //         });
            //     }).subscribe();
        }
    }

    public getAccountInfo() {
        var self = this;
        return (dispatch)=> {
            // var appdb: Map<string,any> = this.appStore.getState().appdb;
            // var url = appdb.get('appBaseUrlUser') + `&command=GetAccountInfo`;
            // var accountModelList: List<AccountModel> = List<AccountModel>();
            // this._http.get(url)
            //     .map(result => {
            //         var xmlData: string = result.text();
            //         this.m_parseString(xmlData, {attrkey: '_attr'}, function (err, result) {
            //             if (err) {
            //                 bootbox.alert('problem with account info');
            //                 return;
            //             }
            //             /**
            //              * redux inject account info
            //              **/
            //             ['Billing', 'Recurring', 'Shipping', 'Contact'].forEach((item)=> {
            //                 var values = result.Account[item]["0"]._attr;
            //                 if (_.isUndefined(values))
            //                     values = {};
            //                 values['type'] = item;
            //                 var accountModel: AccountModel = new AccountModel(values);
            //                 accountModelList = accountModelList.push(accountModel);
            //             });
            //             dispatch(self.receiveAccountInfo(accountModelList));
            //         });
            //     }).subscribe();
        }
    }




    public addPrivilege(privelegesModel: PrivelegesModel) {
        return {
            type: ADD_PRIVILEGE,
            privelegesModel
        }
    }

    public receivePrivileges(privilegesModels: List<PrivelegesModel>) {
        return {
            type: RECEIVE_PRIVILEGES,
            privilegesModels
        }
    }

    public receiveWhitelabel(whitelabelModel: WhitelabelModel) {
        return {
            type: RECEIVE_WHITELABEL,
            whitelabelModel
        }
    }

    public receiveAccountInfo(accountModels: List<AccountModel>) {
        return {
            type: RECEIVE_ACCOUNT_INFO,
            accountModels
        }
    }

    public receiveDefaultPrivilege(privilegeId: number) {
        return {
            type: RECEIVE_DEFAULT_PRIVILEGE,
            privilegeId
        }
    }

    public updateDefaultPrivilege(privilegeId: number) {
        return {
            type: UPDATE_DEFAULT_PRIVILEGE,
            privilegeId
        }
    }

    public updateDefaultPrivilegeName(privilegeId: number, privilegeName: string) {
        return {
            type: UPDATE_PRIVILEGE_NAME,
            privilegeId,
            privilegeName
        }
    }

    public updateResellerInfo(payload: any) {
        return {
            type: UPDATE_WHITELABEL,
            payload
        }
    }

    public updateAccountInfo(payload: any) {
        return {
            type: UPDATE_ACCOUNT,
            payload
        }
    }

    public receiveApps(apps: List<AppModel>) {
        return {
            type: RECEIVE_APPS,
            apps
        }
    }

    public updatedApp(app: AppModel, mode: boolean) {
        return {
            type: UPDATE_APP,
            app,
            mode
        }
    }

    public receivePrivilegesSystem(privelegesSystemModels: Array<PrivelegesTemplateModel>) {
        return {
            type: RECEIVE_PRIVILEGES_SYSTEM,
            privelegesSystemModels
        }
    }

    public removePrivilege(privilegeId: number) {
        return {
            type: REMOVE_PRIVILEGE,
            privilegeId
        }
    }

    public updatePrivilegeAttribute(payload) {
        return {
            type: UPDATE_PRIVILEGE_ATTRIBUTE,
            payload
        }
    }

    public updatePrivilegesSystem(payload) {
        return {
            type: UPDATE_PRIVILEGES,
            payload
        }
    }
}
