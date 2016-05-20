import {Component, EventEmitter, ChangeDetectionStrategy, Input} from 'angular2/core';
import {ModalDialog} from "../../modaldialog/ModalDialog";
import {
    FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control
} from 'angular2/common'
import {BusinessUser} from "../../../business/BusinessUser";
import {Lib} from "../../../Lib";
import {AppStore} from "angular2-redux-util/dist/index";
import {BusinessAction} from "../../../business/BusinessAction";
import {PrivelegesModel} from "../../../reseller/PrivelegesModel";
import {ModalComponent} from "../../ng2-bs3-modal/components/modal";
import * as _ from 'lodash'

@Component({
    selector: 'addUser',
    directives: [ModalDialog, FORM_DIRECTIVES],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '/src/comps/app1/users/AddUser.html',
    styleUrls: ['../comps/app1/users/AddUser.css']
})

/**
 The first Note1 slider component in a series of sliders / notes.
 Demonstrates the usage of explicit form configuration.
 **/
export class AddUser {

    constructor(private appStore:AppStore, private businessActions:BusinessAction, private fb:FormBuilder, private modal:ModalComponent) {
        this.notesForm = fb.group({
            'userName': ['', Validators.required],
            'businessName': [],
            matchingPassword: fb.group({
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required]
            }, {validator: this.areEqual}),
            'privileges': ['', Validators.required]
        });

        this.sub = modal.onClose.subscribe(()=> {
            var userNameControl:Control = this.notesForm.controls['userName'] as Control;
            var businessNameControl:Control = this.notesForm.controls['businessName'] as Control;
            this.passwordGroup.controls['password'].updateValue('')
            this.passwordGroup.controls['confirmPassword'].updateValue('')
            userNameControl.updateValue('')
            businessNameControl.updateValue('')
        })
        this.passwordGroup = this.notesForm.controls['matchingPassword'];
        this.userName = this.notesForm.controls['userName'];
    }

    private accessKeysArr:any = _.times(8, _.uniqueId as any);
    private accessKeys:Array<boolean> = _.times(8, ()=>false);

    @Input()
    businessId:number;

    @Input()
    priveleges:Array<PrivelegesModel> = [];

    @Input()
    mode:'fromSample'|'fromClean'|'fromUser' = null;

    private privilegeName:string = '';
    private notesForm:ControlGroup;
    private userName:AbstractControl;
    private businessName:AbstractControl;
    private passwordGroup;
    private sub:EventEmitter<any>;

    private onKeyChange(event, index) {
        // console.log(event.target.checked + ' ' + index);
    }

    private areEqual(group:ControlGroup) {
        let valid = true, val;
        for (name in group.controls) {
            if (val === undefined) {
                val = group.controls[name].value
                if (val.length < 4) {
                    valid = false;
                    break;
                }
            } else {
                if (val !== group.controls[name].value) {
                    valid = false;
                    break;
                }
            }
        }
        if (valid) {
            return null;
        }
        return {
            areEqual: true
        };
    }

    private onPriveleges(event) {
        this.privilegeName = event.target.value;
    }

    private onSubmit(event) {
        let privilegeId = '-1';
        let computedAccessMask = Lib.ComputeAccessMask(this.accessKeys);
        var privileges:Array<PrivelegesModel> = this.appStore.getState().reseller.getIn(['privileges']);
        privileges.forEach((privelegesModel:PrivelegesModel)=> {
            if (privelegesModel.getName() == this.privilegeName) {
                privilegeId = privelegesModel.getPrivelegesId();
            }
        })
        var userData = {
            accessMask: computedAccessMask,
            privilegeId: privilegeId,
            password: event.matchingPassword.password,
            name: event.userName,
            businessName: event.businessName,
            businessId: this.businessId,
        }
        

        switch (this.mode) {
            case 'fromSample':
            {
                userData['businessId'] = this.businessId; 
                var businessUser:BusinessUser = new BusinessUser(userData);
                this.appStore.dispatch(this.businessActions.duplicateAccount(businessUser));
                break;
            }
            case 'fromClean':
            {
                userData['businessId'] = 999;
                var businessUser:BusinessUser = new BusinessUser(userData);
                this.appStore.dispatch(this.businessActions.duplicateAccount(businessUser));
                break;
            }
            case 'fromUser':
            {
                var businessUser:BusinessUser = new BusinessUser(userData);
                this.appStore.dispatch(this.businessActions.addNewBusinessUser(businessUser));
                break;
            }
        }
        this.modal.close();
    }

    private onChange(event) {
        if (event.target.value.length < 3)
            console.log('text too short for subject');
    }

    private ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

// this.observeNameChange();
// this.observeFormChange();
// /**
//  * Listen to observable emitted events from name control
//  * use one of the many RX operators debounceTime to control
//  * the number of events emitted per milliseconds
//  **/
// private observeNameChange() {
//     this.userName.valueChanges.debounceTime(100).subscribe(
//         (value:string) => {
//             console.log('name changed, notified via observable: ', value);
//         }
//     );
// }
//
// private observeFormChange() {
//     this.notesForm.valueChanges.debounceTime(100).subscribe(
//         (value:string) => {
//             console.log('forum changed, notified via observable: ', value);
//         }
//     );
// }