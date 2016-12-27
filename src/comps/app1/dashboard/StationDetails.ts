import {Component, Input, ChangeDetectionStrategy, ViewChild, Renderer, ElementRef} from "@angular/core";
import {StationModel} from "../../../stations/StationModel";
import {AppStore} from "angular2-redux-util";
import * as _ from "lodash";
import {BusinessAction} from "../../../business/BusinessAction";
import {StationSnapshot} from "./StationSnapshot";

@Component({
    selector: 'stationDetails',
    templateUrl: './StationDetails.html',
    styleUrls: ['./StationDetails.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class StationDetails {

    constructor(private appStore: AppStore,
                private businessActions: BusinessAction,
                private elRef: ElementRef,
                private renderer: Renderer) {
    }


    private snapshots: Array<any> = [];

    private onModalClose($event) {
    }


    private m_selectedStation: StationModel;

    // @Input() station:StationModel;

    @ViewChild(StationSnapshot)
    stationSnapshot: StationSnapshot;


    @Input()
    set station(i_selectedStation: StationModel) {
        if (_.isUndefined(i_selectedStation))
            return;
        this.m_selectedStation = i_selectedStation;

        // this.m_selectedStation.getPublicIp()
        // this.m_selectedStation.getLocalIp()
        // this.m_selectedStation.getLocation().lat
        // this.m_selectedStation.getLocation().lon
        // this.m_selectedStation.getLocation().city
        // this.m_selectedStation.getLocation().country
    }


}

