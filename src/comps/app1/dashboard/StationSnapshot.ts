import {Directive, Renderer, ElementRef} from "@angular/core";
import {AppStore} from "angular2-redux-util";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/interval";
import {BusinessAction} from "../../../business/BusinessAction";
import {StationModel} from "../../../stations/StationModel";

@Directive({
    selector: 'StationSnapshot',
})

export class StationSnapshot {

  
   
}