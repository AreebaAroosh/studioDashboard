import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "../../compbaser/Compbaser";

@Component({
    selector: 'Dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="release">dashboard
                   <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
               </small>
               <small class="debug">{{me}}</small>
           `,
})
export class Dashboard extends Compbaser {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    destroy() {
    }
}