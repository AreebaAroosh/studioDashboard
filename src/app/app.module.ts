import {BrowserModule} from "@angular/platform-browser";
import {NgModule, Injectable} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {AlertModule, ModalModule} from "ng2-bootstrap/ng2-bootstrap";
import {Ng2Bs3ModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import {AppComponent} from "./app.component";
// import {AppStore} from "angular2-redux-util";
// import {applyMiddleware, createStore, compose, combineReducers} from "redux";
// import thunkMiddleware from "redux-thunk";
// import notify from "../appdb/NotifyReducer";
// import appdb from "../appdb/AppdbReducer";
// import {business} from "../business/BusinessReducer";
// import {reseller} from "../reseller/ResellerReducer";
// import {stations} from "../stations/StationsReducer";
// import {orders} from "../comps/app1/orders/OrdersReducer";
import "hammerjs";
import {LocalStorage} from "../services/LocalStorage";
import {MsLibModule} from "ng-mslib/dist/mslib.module";
import {ToastModule, ToastOptions} from "ng2-toastr";
import {AgmCoreModule} from "angular2-google-maps/core";
import {SimpleGridModule} from "../comps/simplegridmodule/SimpleGridModule";
import {DropdownModule, AccordionModule} from "ng2-bootstrap";
import {TreeModule, InputTextModule, SelectButtonModule, DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {NgStringPipesModule} from "angular-pipes";
import {routing} from "../App.routes";
import {LoginPanel} from "../comps/entry/LoginPanel";
// import {Account} from "../comps/app1/account/Account";
// import {App1} from "../comps/app1/App1";
// import {Privileges} from "../comps/app1/privileges/Privileges";
// import {Dashboard} from "../comps/app1/dashboard/Dashboard";
// import {Logout} from "../comps/logout/Logout";
// import {Orders} from "../comps/app1/orders/Orders";
// import {Logo} from "../comps/logo/Logo";
// import {LogoCompany} from "../comps/logo/LogoCompany";
// import {BlurForwarder} from "../comps/blurforwarder/BlurForwarder";
// import {Footer} from "../comps/footer/Footer";
// import {InputEdit} from "../comps/inputedit/InputEdit";
// import {OrderBy} from "../pipes/OrderBy";
// import {SortBy} from "../pipes/SortBy";
// import {Ngmslib} from "ng-mslib";
// import {FilterPipe} from "../pipes/FilterPipe";
// import {FilterPipeEqual} from "../pipes/FilterPipeNot";
// import {Tabs} from "../comps/tabs/tabs";
// import {Tab} from "../comps/tabs/tab";
// import {ServerStats} from "../comps/app1/dashboard/ServerStats";
// import {ServerAvg} from "../comps/app1/dashboard/ServerAvg";
// import {StationsMap} from "../comps/app1/dashboard/StationsMap";
// import {StationsGrid} from "../comps/app1/dashboard/StationsGrid";
// import {StationDetails} from "../comps/app1/dashboard/StationDetails";
// import {ImgLoader} from "../comps/imgloader/ImgLoader";
// import {Ng2Highcharts} from "../comps/ng2-highcharts/src/directives/ng2-highcharts";
// import {StationSnapshot} from "../comps/app1/dashboard/StationSnapshot";
// import {OrderDetails} from "../comps/app1/orders/OrderDetails";
// import {simplelist} from "../comps/simplelist/simplelist";
// import {ModalDialog} from "../comps/modaldialog/ModalDialog";
// import {Infobox} from "../comps/infobox/Infobox";
// import {Loading} from "../comps/loading/Loading";
import {ChartModule} from "angular2-highcharts";
// import {simplelistEditable} from "../comps/simplelist/simplelistEditable";
// import {MapAddress} from "../comps/mapaddress/MapAddress";
// import {ResourceViewer} from "../comps/resourceviewer/ResourceViewer";
// import {InputNumeric} from "../comps/inputnumeric/InputNumeric";
// import {InputString} from "../comps/inputstring/InputString";
// import {Dropbox} from "../comps/dropbox/Dropbox";
// import {Twofactor} from "../comps/twofactor/Twofactor";
import {CommBroker} from "../services/CommBroker";
import {AUTH_PROVIDERS, AuthService} from "../services/AuthService";
import {StoreService} from "../services/StoreService";
import {BusinessAction} from "../business/BusinessAction";
import {ResellerAction} from "../reseller/ResellerAction";
import {OrdersAction} from "../comps/app1/orders/OrdersAction";
import {StationsAction} from "../stations/StationsAction";
import {AppdbAction} from "../appdb/AppdbAction";
import {CreditService} from "../services/CreditService";
import {Consts} from "../Conts";
// import {ThrottlePipe} from "../pipes/ThrottlePipe";
// import {NgMenu} from "../comps/ng-menu/ng-menu";
// import {NgMenuItem} from "../comps/ng-menu/ng-menu-item";
import {AutoLogin} from "../comps/entry/AutoLogin";
// import {Sliderpanel} from "../comps/sliderpanel/Sliderpanel";
// import {Slideritem} from "../comps/sliderpanel/Slideritem";


import {StoreModule, combineReducers} from "@ngrx/store";
import {INITIAL_APPLICATION_STATE} from "../store/application-state";
import {EffectsModule} from "@ngrx/effects";
import {LoadThreadsEffectService} from "../store/effects/load-threads-effect.service";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {uiState} from "../store/reducers/uiStateReducer";
import {storeData} from "../store/reducers/uiStoreDataReducer";
import weatherReducer from "../store/reducers/weatherReducer";
import {ThreadsService} from "../services/threads.service";

export enum ServerMode {
    CLOUD,
    PRIVATE,
    HYBRID
}

// export function appStoreFactory() {
//     const reducers = combineReducers({
//         notify,
//         appdb,
//         business,
//         stations,
//         reseller,
//         orders
//     });
//     const middlewareEnhancer = applyMiddleware(<any>thunkMiddleware);
//     const isDebug = window['devToolsExtension']
//     const applyDevTools = () => isDebug ? window['devToolsExtension']() : f => f;
//     const enhancers: any = compose(middlewareEnhancer, applyDevTools());
//     const store = createStore(reducers, enhancers);
//     return new AppStore(store);
// }


// export var providing2 = [CommBroker, AUTH_PROVIDERS,
//     {
//         provide: StoreService,
//         useClass: StoreService
//     },
//     {
//         provide: BusinessAction,
//         useClass: BusinessAction
//     },
//     {
//         provide: ResellerAction,
//         useClass: ResellerAction
//     },
//     {
//         provide: OrdersAction,
//         useClass: OrdersAction
//     },
//     {
//         provide: StationsAction,
//         useClass: StationsAction
//     },
//     {
//         provide: AppdbAction,
//         useClass: AppdbAction
//     },
//     {
//         provide: CreditService,
//         useClass: CreditService
//     },
//     {
//         provide: LocalStorage,
//         useClass: LocalStorage
//     },
//     {
//         provide: CommBroker,
//         useClass: CommBroker
//     },
//     {
//         provide: Consts,
//         useClass: Consts
//     },
//     // {
//     //     provide: "DEV_ENV",
//     //     useValue: Ngmslib.DevMode()
//     // },
//     {
//         provide: "OFFLINE_ENV",
//         useValue: false
//     }];


export var providing = [CommBroker, AUTH_PROVIDERS,
    {
        provide: LocalStorage,
        useClass: LocalStorage
    } ,{
        provide: ThreadsService,
        useClass: ThreadsService
    }
];

// let options: ToastOptions = new ToastOptions({
//     toastLife: 4000,
//     animate: 'flyRight'
// });


// var decelerations = [AppComponent, AutoLogin, LoginPanel, Account, App1, Privileges, Dashboard, Logout, Orders, Logo,
//     LogoCompany, Footer, BlurForwarder, InputEdit, OrderBy, SortBy, FilterPipe, FilterPipeEqual, Tabs, Tab, ServerStats, ServerAvg,
//     StationsMap, StationsGrid, StationDetails, ImgLoader, Ng2Highcharts, StationSnapshot, OrderDetails, simplelist, ModalDialog, Infobox,
//     Loading, simplelistEditable, MapAddress, ResourceViewer, InputNumeric, InputString, Dropbox, Twofactor, ThrottlePipe, NgMenu, NgMenuItem, Sliderpanel, Slideritem];

var decelerations = [AppComponent, AutoLogin];

@NgModule({
    declarations: [decelerations],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Bs3ModalModule,
        HttpModule,
        StoreModule.provideStore(combineReducers({uiState, storeData, weatherReducer}), INITIAL_APPLICATION_STATE),
        EffectsModule.run(LoadThreadsEffectService),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        // ChartModule,
        // ToastModule.forRoot({
        //     animate: 'flyRight',
        //     positionClass: 'toast-bottom-right',
        //     toastLife: 5000,
        //     showCloseButton: true,
        //     maxShown: 5,
        //     newestOnTop: true,
        //     enableHTML: true,
        //     dismiss: 'auto',
        //     messageClass: "",
        //     titleClass: ""
        // }),
        // AgmCoreModule.forRoot({
        //     apiKey: 'AIzaSyAGD7EQugVG8Gq8X3vpyvkZCnW4E4HONLI'
        // }),
        // MsLibModule.forRoot(),
        // SimpleGridModule.forRoot(),
        JsonpModule,
        AlertModule,
        ModalModule,
        DropdownModule,
        AccordionModule,
        TreeModule,
        NgStringPipesModule,
        InputTextModule,
        SelectButtonModule,
        InputTextModule,
        DropdownModulePrime,
        routing,
    ],
    providers: [providing],
    // providers: [ThreadsService, AuthService],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
    }

}
