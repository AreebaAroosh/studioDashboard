import {Component, Input, ChangeDetectionStrategy, ViewChild} from '@angular/core'
import {List, Map} from 'immutable';
import {BusinessModel} from "../../../business/BusinessModel";
import {OrderBy} from "../../../pipes/OrderBy";
import {SIMPLEGRID_DIRECTIVES, ISimpleGridEdit} from "../../simplegrid/SimpleGrid";
import {AppStore} from "angular2-redux-util";
import {BusinessAction} from "../../../business/BusinessAction";
import {UserInfo} from "./UserInfo";
import {BusinessUser} from "../../../business/BusinessUser";
import {SimpleGridTable} from "../../simplegrid/SimpleGridTable";
import {ISimpleListItem} from "../../simplelist/Simplelist";
import {AddUser} from "./AddUser";
import {ChangePass} from "./ChangePass";
import {SimpleGridRecord} from "../../simplegrid/SimpleGridRecord";
import {Lib} from "../../../Lib";
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {MODAL_DIRECTIVES, ModalResult} from "../../ng2-bs3-modal/ng2-bs3-modal";
import * as _ from 'lodash'
import * as bootbox from 'bootbox';

@Component({
    selector: 'UsersDetails',
    changeDetection: ChangeDetectionStrategy.OnPush,
    pipes: [OrderBy],
    moduleId: __moduleName,
    styleUrls: ['UsersDetails.css'],
    templateUrl: 'UsersDetails.html'
})

// moduleId: __moduleName,
// styleUrls: ['UsersDetails.css'],
// templateUrl: 'UsersDetails.html'
// styleUrls: ['../comps/app1/users/UsersDetails.css'],
// templateUrl: '/src/comps/app1/users/UsersDetails.html'

export class UsersDetails {

    constructor(private appStore:AppStore, private businessActions:BusinessAction) {
    }

    @ViewChild(SimpleGridTable)
    simpleGridTable:SimpleGridTable

    // @ViewChild('modalAddUser')
    // modalAddUser:ModalComponent

    @Input()
    showUserInfo:ISimpleListItem = null;

    @Input()
    set businesses(i_businesses) {
        this.m_businesses = i_businesses;
        if (i_businesses && this.simpleGridTable && this.m_businesses.size != this.totalBusinessSelected) {
            this.simpleGridTable.deselect();
            this.totalBusinessSelected = this.m_businesses.size;
        }
    }

    @Input()
    set priveleges(i_priveleges) {
        this.m_priveleges = i_priveleges;
    }

    public sort:{field:string, desc:boolean} = {field: null, desc: false};
    private m_businesses:List<BusinessModel>;
    private m_priveleges:Array<PrivelegesModel>;
    private totalBusinessSelected:number = 0;

    private launchStudio() {
        let businessUser:BusinessUser = this.selectedBusinessUser();
        let businessId = businessUser.getBusinessId();
        let businesses:List<BusinessModel> = this.appStore.getState().business.getIn(['businesses']);
        let index = this.businessActions.findBusinessIndexById(businessId, businesses);
        let businessModel:BusinessModel = this.appStore.getState().business.getIn(['businesses']).get(index);

        if (businessModel.getKey('studioLite') == '0') {
            this.businessActions.getStudioProUrl(businessUser.getName(), (url)=> {
                var newWin = window.open(url, '_blank');
                if (!newWin || newWin.closed || typeof newWin.closed == 'undefined')
                    bootbox.alert('Popup blocked, please allow popups from this site in your browser settings');
            });
        } else {
            this.businessActions.getUserPass(businessUser.getName(), (pass)=> {
                var user = businessModel.getKey('name');
                var credentials = `user=${user},pass=${pass}`;
                credentials = Lib.Base64().encode(credentials);
                var url = this.getStudioLiteURL();
                url = url + '?param=' + credentials;
                var newWin = window.open(url, '_blank');
                if (!newWin || newWin.closed || typeof newWin.closed == 'undefined')
                    bootbox.alert('Popup blocked, please allow popups from this site in your browser settings');
            });


        }
    }

    /**
     Return the url address of StudioLite
     @method getStudioLiteURL
     @return {String} url address
     **/
    getStudioLiteURL() {
        var origin = window.location.toString();
        var pattern = '^(https|http)(:\/\/)(.*?)\/';
        var re:any = new RegExp(pattern);
        var server:any = origin.match(re)[3];
        if (server.match(/gsignage.com/i) || server.match(/signage.me/i) || server.match(/localhost/i) || server.match(/digitalsignage.com/i))
            return 'https://secure.digitalsignage.com/_studiolite-dist/studiolite.html';
        return `${origin}/_studiolite-dist/studiolite.html`;
    }

    private onModalClose(result:ModalResult) {
    }

    private removeBusinessUser() {
        var businessUser:BusinessUser = this.selectedBusinessUser();
        bootbox.confirm(`Are you sure you want to remove the user ${businessUser.getName()}?`, (result) => {
            if (result) {
                this.appStore.dispatch(this.businessActions.removeBusinessUser(businessUser));
            }
        });
    }

    private getBusinessIdSelected():number {
        if (!this.m_businesses || this.m_businesses.size == 0)
            return -1;
        return this.m_businesses.first().getBusinessId();
    }

    private onLabelEdited(event:ISimpleGridEdit, field) {
        var newValue = event.value;
        var businessUser:BusinessUser = event.item as BusinessUser;
        var oldValue = businessUser.getKey('name');
        var businessId = businessUser.getBusinessId();
        this.appStore.dispatch(this.businessActions.setBusinessUserName(businessId, field, {newValue, oldValue}));
    }

    private selectedBusinessUser():BusinessUser {
        if (!this.simpleGridTable)
            return null;
        let selected:SimpleGridRecord = this.simpleGridTable.getSelected();
        return selected ? this.simpleGridTable.getSelected().item : '';
    }

    private setPriveleges(event) {
        let privilegeId = -1;
        let privelegesName:string = event.value;
        var businessUser:BusinessUser = event.item as BusinessUser;
        var businessId = businessUser.getBusinessId();
        var name = businessUser.getName();
        var accessMask = businessUser.getAccessMask();
        var privileges:Array<PrivelegesModel> = this.appStore.getState().reseller.getIn(['privileges']);
        privileges.forEach((privelegesModel:PrivelegesModel)=> {
            if (privelegesModel.getName() == privelegesName) {
                privilegeId = privelegesModel.getPrivelegesId();
            }
        })
        this.appStore.dispatch(this.businessActions.updateBusinessUserAccess(businessId, name, accessMask, privilegeId));
    }

    private selectedPriveleges() {
        return (privelegesModel:PrivelegesModel, businessUser:BusinessUser) => {
            return businessUser.privilegeId() == privelegesModel.getPrivelegesId() ? 'selected' : '';
        }
    }

    private setAccessMask(event) {
        var businessUser:BusinessUser = event.item as BusinessUser;
        var businessId = businessUser.getBusinessId();
        var name = businessUser.getName();
        var privilegeId = businessUser.privilegeId();
        var accessMask = event.value;
        var computedAccessMask = Lib.ComputeAccessMask(accessMask);
        this.appStore.dispatch(this.businessActions.updateBusinessUserAccess(businessId, name, computedAccessMask, privilegeId));
    }

    private getAccessMask(businessUser:BusinessUser) {
        var accessMask = businessUser.getAccessMask();
        return Lib.GetAccessMask(accessMask);
    }
}