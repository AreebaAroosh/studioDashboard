import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "../compbaser/Compbaser";
import {AuthState} from "../../appdb/AppdbAction";
import {Router} from "@angular/router";
import {Ngmslib} from "ng-mslib";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Observable} from "rxjs";

@Component({
    selector: 'AutoLogin',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<h5 style="padding-left: 10px"><span class="fa fa-key"></span> verifying access...</h5>`
})
export class AutoLogin extends Compbaser {

    constructor(private appStore: Store<ApplicationState>, private router:Router) {
        super();
        debugger;
        this.appStore.select(state => state.appDb.credentials).subscribe((e)=>{
            console.log(e);
        });

        // this.cancelOnDestroy(
        //     appStore.sub((credentials: Map<string,any>) => {
        //         var state = credentials.get('authenticated');
        //         var user = Ngmslib.Base64().encode(credentials.get('user'));
        //         var pass = Ngmslib.Base64().encode(credentials.get('pass'));
        //         switch (state) {
        //             case AuthState.FAIL: {
        //                 this.navigateTo(['/UserLogin'])
        //                 break;
        //             }
        //             case AuthState.TWO_FACTOR: {
        //                 this.navigateTo([`/UserLogin/twoFactor/${user}/${pass}`])
        //                 break;
        //             }
        //             case AuthState.PASS: {
        //                 this.navigateTo(['/App1/Dashboard'])
        //
        //                 break;
        //             }
        //         }
        //     }, 'appdb.credentials', false)
        // )
    }

    private currentSelectedThreadId$:Observable<any>;

    private navigateTo(to){
        // setTimeout(()=>{
        //     this.router.navigate(to)
        // },1)
    }
}