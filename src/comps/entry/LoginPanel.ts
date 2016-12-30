import {
    Component,
    Injectable,
    ViewChild,
    ElementRef,
    Renderer,
    keyframes,
    trigger,
    state,
    style,
    transition,
    animate
} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {BusinessAction} from "../../business/BusinessAction";
import {LocalStorage} from "../../services/LocalStorage";
import {AuthService, FlagsAuth} from "../../services/AuthService";
import {Map} from "immutable";
import {AuthState} from "../../appdb/AppdbAction";
import {Compbaser} from "../compbaser/Compbaser";
import {Ngmslib} from "ng-mslib";
import {ToastsManager} from "ng2-toastr";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {UserModel} from "../../models/UserModel";
import {AuthenticateFlags} from "../../store/actions/app-db-actions";
import {Observable, Subscriber} from "rxjs";

@Injectable()
@Component({
    selector: 'LoginPanel',
    providers: [BusinessAction, LocalStorage],
    animations: [

        trigger('loginState', [
            state('inactive', style({
                backgroundColor: 'red',
                transform: 'scale(1)',
                alpha: 0
            })),
            state('default', style({
                backgroundColor: '#313131',
                transform: 'scale(1)',
                alpha: 1
            })),
            state('active', style({
                backgroundColor: 'green',
                transform: 'scale(0.98)'
            })),
            transition('* => active', animate('600ms ease-out')),
            transition('* => inactive', animate('2000ms ease-out'))
        ]),
        trigger('showTwoFactor', [
            state('true', style({
                transform: 'scale(1)'
            })),
            transition(':enter', [
                animate('1s 2s cubic-bezier(0.455,0.03,0.515,0.955)', keyframes([
                    style({
                        opacity: 0,
                        transform: 'translateX(-400px)'
                    }),
                    style({
                        opacity: 1,
                        transform: 'translateX(0)'
                    })
                ]))
            ]),
            transition(':leave', animate('500ms cubic-bezier(.17,.67,.83,.67)'))
        ])
    ],
    template: `<div [@loginState]="loginState" class="login-page" id="appLogin">
                <br/>
                <br/>
                  <form class="form-signin" role="form">
                    <h2 class="form-signin-heading"></h2>     
                    <input (keyup.enter)="passFocus()" #userName id="userName" spellcheck="false" type="text" name="m_user" [(ngModel)]="m_user" class="input-underline input-lg form-control" placeholder="user name" required autofocus>
                    <input (keyup.enter)="onClickedLogin()" #userPass id="userPass" type="password" [(ngModel)]="m_pass" name="m_pass" class="input-underline input-lg form-control" placeholder="password" required>
                    <div [@showTwoFactor]="m_showTwoFactor" *ngIf="m_showTwoFactor">
                        <br/>     
                        <br/>
                        <span style="color: #989898; position: relative; left: -40px; top: 34px" class="fa fa-key fa-2x pull-right"></span>
                        <input #twoFactor spellcheck="false" type="text" name="m_twoFactor" [(ngModel)]="m_twoFactor" class="input-underline input-lg form-control" placeholder="enter two factor key" required autofocus>
                        <br/>     
                        <br/>
                    </div>
                    <br/> 
                    <a id="loginButton" (click)="onClickedLogin()" type="submit" class="btn rounded-btn"> enterprise member login
                     <span *ngIf="m_showTwoFactor" style="font-size: 9px; max-height: 15px; display: block; padding: 0; margin: 0; position: relative; top: -20px">with Google authenticator</span>
                    </a>&nbsp;
                     <br/>
                     <div *ngIf="!m_showTwoFactor">
                         <label class="checkbox" style="padding-left: 20px">
                            <input #rememberMe type="checkbox" [checked]="m_rememberMe" (change)="m_rememberMe = rememberMe.checked" />
                          <span style="color: gray"> remember me for next time </span>
                    </label>
                    </div>
                    <br/>     
                    <br/>
                    <br/>
                   <a href="http://www.digitalsignage.com/_html/benefits.html" target="_blank">not an enterprise member? learn more</a>
                    <!-- todo: add forgot password in v2-->                    
                    <div id="languageSelectionLogin"></div>
                  </form>
                </div>
               `
})
export class LoginPanel extends Compbaser {
    private m_user: string = '';
    private m_pass: string = '';
    private m_twoFactor: string;
    private m_showTwoFactor: boolean = false;
    private m_rememberMe: any;
    private loginState: string = '';
    private userModel: UserModel;

    constructor(private store: Store<ApplicationState>,
                private renderer: Renderer,
                private router: Router,
                private toast: ToastsManager,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService) {
        super();
        this.listenEvents();

        // this.appStore.select(state => state.appDb.credentials).subscribe((e:UserModel)=>{
        //     console.log(e.user());
        // });
        //
        // this.appStore.dispatch({type: 'APP_INIT'})
        //
        // setInterval(()=>{
        //     this.appStore.dispatch({type: 'APP_INIT'})
        // },1000)
    }

    @ViewChild('userPass') userPass: ElementRef;

    private listenEvents() {

        this.cancelOnDestroy(
            this.store.select(store => store.appDb.userModel).subscribe((userModel: UserModel) => {
                this.userModel = userModel
            })
        )

        this.cancelOnDestroy(
            this.store.select(store => store.appDb.appAuthStatus).subscribe((authStatus: AuthenticateFlags) => {

                if (this.checkFailedLogin(authStatus))
                    return;

                switch(authStatus){
                    case AuthenticateFlags.TWO_FACTOR_ENABLED: {
                        this.m_showTwoFactor = true;
                        break;
                    }
                    case AuthenticateFlags.TWO_FACTOR_DISABLED: {
                        alert('enter app')
                        break;
                    }
                 }
            })
        )


        // this.store.select(store => store.appDb.userModel)
        //     .filter((userModel: UserModel) => {
        //         console.log('aaaa' + userModel.getReason());
        //         if (userModel.getReason() == -1)
        //             return false;
        //         return userModel;
        //     })
        //     .distinctUntilChanged((current: UserModel, previous: UserModel) => {
        //         debugger;
        //         var a = previous.getReason();
        //         var b = current.getReason()
        //         return previous.getReason() === current.getReason()
        //     })
        //     .subscribe((userModel: UserModel) => {
        //         debugger;
        //         // if (userModel.getReason() > -1) {
        //         //     this.checkFailedLogin(userModel.getReason());
        //         // }
        //     });

        this.cancelOnDestroy(
            this.activatedRoute.params.subscribe(params => {
                if (params['twoFactor']) {
                    this.m_user = Ngmslib.Base64().decode(params['user']);
                    this.m_pass = Ngmslib.Base64().decode(params['pass']);
                    this.m_showTwoFactor = true;
                }
            })
        )

        // this.cancelOnDestroy(
        //     this.appStore.sub((credentials: Map<string,any>) => {
        //         var state = credentials.get('authenticated');
        //         var reason = credentials.get('reason');
        //         switch (state) {
        //             case AuthState.FAIL: {
        //                 this.checkFailedLogin(reason);
        //                 break;
        //             }
        //             case AuthState.PASS: {
        //                 this.enterApplication();
        //                 break;
        //             }
        //             case AuthState.TWO_FACTOR: {
        //                 this.m_showTwoFactor = true;
        //                 this.m_rememberMe = false;
        //                 this.loginState = 'default';
        //                 break;
        //             }
        //         }
        //     }, 'appdb.credentials'))

        // this.cancelOnDestroy(
        //     this.appStore.sub((twoFactorStatus: {status: boolean, twoFactorStatusReceived: Date}) => {
        //         // twoFactorStatus.status = false;//debug
        //         if (twoFactorStatus.status) {
        //             this.enterApplication();
        //         } else {
        //             this.checkFailedLogin(FlagsAuth.WrongTwoFactor);
        //         }
        //     }, 'appdb.twoFactorStatus'))
    }

    private passFocus() {
        this.renderer.invokeElementMethod(this.userPass.nativeElement, 'focus', [])
    }

    private onClickedLogin() {
        if (this.m_showTwoFactor) {
            // this.toast.warning('Authenticating Two factor...');
            // this.authService.authServerTwoFactor(this.m_twoFactor);
        } else {
            // this.toast.info('Authenticating...');
            this.authService.authUser(this.m_user, this.m_pass, this.m_rememberMe);
            // this.authService.authUser('reseller@ms.com','123123', this.m_rememberMe);

        }
    }

    private enterApplication() {
        this.loginState = 'active';
        // this.router.navigate(['/App1/Dashboard']);
    }

    private checkFailedLogin(i_reason:AuthenticateFlags):boolean {
        let msg1: string;
        let msg2: string;
        switch (i_reason) {
            case AuthenticateFlags.WRONG_PASS: {
                msg1 = 'User or password are incorrect...'
                msg2 = 'Please try again or click forgot password to reset your credentials'
                break;
            }
            case AuthenticateFlags.WRONG_TWO_FACTOR: {
                msg1 = 'Invalid token'
                msg2 = 'Wrong token entered or the 60 seconds limit may have exceeded, try again...'
                break;
            }
            default: {
                return false;
            }
        }
        this.loginState = 'inactive';
        setTimeout(() => {
            bootbox.dialog({
                closeButton: true,
                title: msg1,
                message: msg2
            });
        }, 200);
        return true;
    }
}


// this.m_rememberMe = this.authService.getLocalstoreCred().r;
