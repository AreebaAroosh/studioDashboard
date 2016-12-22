import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    trigger,
    transition,
    animate,
    state,
    style
} from "@angular/core";
import {AppModel} from "../../../reseller/AppModel";
import {List} from "immutable";
import {AppStore} from "angular2-redux-util";
import {ResellerAction} from "../../../reseller/ResellerAction";
// import {ComponentInstruction} from "@angular/router";

@Component({
    selector: 'apps',
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
    animations: [
        trigger('routeAnimation', [
            state('*', style({opacity: 1})),
            transition('void => *', [
                style({opacity: 0}),
                animate(333)
            ]),
            transition('* => void', animate(333, style({opacity: 0})))
        ])
    ],
    styles: [`
        .page {
            padding-left: 100px;
            padding-top: 40px;
        }
    `],
    template: `
               <Sliderpanel style="padding: 200px">
                  <div>
                    <Slideritem class="page center todo1 selected" [toDirection]="'left'" [to]="'todo2'">
                      <h1>todo 1</h1>
                    </Slideritem>
                    <Slideritem class="page right todo2" class="page right todo2" [toDirection]="'left'" [fromDirection]="'right'" [from]="'todo1'" [to]="'todo3'">
                      <h1>todo 2</h1>
                    </Slideritem>
                    <Slideritem class="page right todo3" [fromDirection]="'right'" [from]="'todo2'" >
                      <h1>todo 3</h1>
                    </Slideritem>
                  </div>
                </Sliderpanel>
           
            
     
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class Apps {

    constructor(private appStore: AppStore, private resellerAction: ResellerAction, private ref: ChangeDetectorRef) {
        var i_reseller = this.appStore.getState().reseller;
        this.apps = i_reseller.getIn(['apps']);
        this.unsub = this.appStore.sub((apps) => {
            this.apps = apps;
            this.ref.markForCheck();
        }, 'reseller.apps');
    }

    private sort: {field: string, desc: boolean} = {field: null, desc: false};
    private apps: List<AppModel>;
    private unsub;

    private getInstalledStatus(item: AppModel) {
        return [Number(item.getInstalled())];
    }

    private onAppInstalledChange(event, index) {
        // let animation of slide complete
        setTimeout(() => {
            this.appStore.dispatch(this.resellerAction.appStatus(event.item, event.value["0"]));
        }, 1000)
    }

    private ngOnDestroy() {
        this.unsub();
    }

}

