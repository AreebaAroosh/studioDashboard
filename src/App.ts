/********************************************************************
 *
 * DigitalSignage.com Inc (c), FREE Digital Signage
 * StudioDashboard for Enterprise userrs
 * See GitHub for License
 *
 * for Development install and run:
 1. npm install chokidar-socket-emitter --save-dev ;
 2. npm install http-server --save-dev ;
 3. jspm i --dev systemjs-hot-reloader
 4. npm run devserver
 *
 ****************************************************************/
///<reference path="../typings/app.d.ts" />

import "zone.js/dist/zone";
import "reflect-metadata";
import {
    Router,
    ActivatedRoute,
    Route,
    NavigationEnd
} from "@angular/router";
import {routing} from "./App.routes";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {
    FormsModule,
    ReactiveFormsModule
} from "@angular/forms";
import {
    Component,
    enableProdMode,
    ViewEncapsulation,
    NgModule,
    NgModuleRef, ViewContainerRef
} from "@angular/core";
import * as platform from "platform";
import "jspm_packages/github/twbs/bootstrap@3.3.6";
import "twbs/bootstrap/dist/css/bootstrap.css!";
import "ng2-toastr/bundles/ng2-toastr.min.css!";
import "primeng/resources/themes/omega/theme.css!";
import "primeng/resources/primeng.min.css!";
import "./styles/style.css!";
import {StyleService} from "./styles/StyleService";
import {appInjService} from "./services/AppInjService";
import {LocalStorage} from "./services/LocalStorage";
import {StoreService} from "./services/StoreService";
import {BusinessAction} from "./business/BusinessAction";
import {ResellerAction} from "./reseller/ResellerAction";
import {OrdersAction} from "./comps/app1/orders/OrdersAction";
import {orders} from "./comps/app1/orders/OrdersReducer";
import {StationsAction} from "./stations/StationsAction";
import {
    HttpModule,
    JsonpModule
} from "@angular/http";
import {CommBroker} from "../src/services/CommBroker";
import {Filemenu} from "../src/comps/filemenu/Filemenu";
import {FilemenuItem} from "../src/comps/filemenu/FilemenuItem";
import {Logo} from "./comps/logo/Logo";
import {Footer} from "./comps/footer/Footer";
import {Consts} from "../src/Conts";
import {AppStore} from "angular2-redux-util";
import {Lib} from "./Lib";
import {CreditService} from "./services/CreditService";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/finally";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/retry";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/do";
import notify from "./appdb/NotifyReducer";
import appdb from "./appdb/AppdbReducer";
import {business} from "./business/BusinessReducer";
import {reseller} from "./reseller/ResellerReducer";
import {adnet} from "./adnet/AdnetReducer";
import {stations} from "./stations/StationsReducer";
import {AppdbAction} from "./appdb/AppdbAction";
import {LogoCompany} from "./comps/logo/LogoCompany";
import {Observable} from "rxjs/Rx";
import {
    LazyMapsAPILoaderConfig,
    AgmCoreModule
} from "angular2-google-maps/core/core.umd.js";
import {AdnetActions} from "./adnet/AdnetActions";
import {AUTH_PROVIDERS} from "./services/AuthService";
import {
    BrowserModule,
    Title
} from "@angular/platform-browser";
import {SimpleList} from "./comps/simplelist/Simplelist";
import {Orders} from "./comps/app1/orders/Orders";
import {UsersDetails} from "./comps/app1/users/UsersDetails";
import {LoginPanel} from "./comps/entry/LoginPanel";
import {Menu} from "./comps/sidemenu/Menu";
import {MenuItem} from "./comps/sidemenu/MenuItem";
import {Whitelabel} from "./comps/app1/whitelabel/Whitelabel";
import {Apps} from "./comps/app1/apps/Apps";
import {Privileges} from "./comps/app1/privileges/Privileges";
import {Dashboard} from "./comps/app1/dashboard/Dashboard";
import {Logout} from "./comps/logout/Logout";
import {Tabs} from "./comps/tabs/tabs";
import {Tab} from "./comps/tabs/tab";
import {Account} from "./comps/app1/account/Account";
import {BlurForwarder} from "./comps/blurforwarder/BlurForwarder";
import {Loading} from "./comps/loading/Loading";
import {InputEdit} from "./comps/inputedit/InputEdit";
import {Users} from "./comps/app1/users/Users";
import {Adnet} from "./comps/app1/adnet/Adnet";
import {App1} from "./comps/app1/App1";
import {RatesTable} from "./comps/app1/adnet/rates/RatesTable/RatesTable";
import {AdnetConfigCustomer} from "./comps/app1/adnet/config/AdnetConfigCustomer";
import {AdnetConfig} from "./comps/app1/adnet/config/AdnetConfig";
import {AdnetConfigTargets} from "./comps/app1/adnet/targets/AdnetConfigTargets";
import {AdnetConfigRates} from "./comps/app1/adnet/rates/AdnetConfigRates";
import {MODAL_DIRECTIVES} from "./comps/ng2-bs3-modal/ng2-bs3-modal";
import {Infobox} from "./comps/infobox/Infobox";
import {StationsGrid} from "./comps/app1/dashboard/StationsGrid";
import {StationsMap} from "./comps/app1/dashboard/StationsMap";
import {ServerAvg} from "./comps/app1/dashboard/ServerAvg";
import {ServerStats} from "./comps/app1/dashboard/ServerStats";
import {StationDetails} from "./comps/app1/dashboard/StationDetails";
import {Ng2Highcharts} from "./comps/ng2-highcharts/src/directives/ng2-highcharts";
import {StationSnapshot} from "./comps/app1/dashboard/StationSnapshot";
import {OrderDetails} from "./comps/app1/orders/OrderDetails";
import {PrivilegesDetails} from "./comps/app1/privileges/PrivilegesDetails";
import {UserStorage} from "./comps/app1/users/UserStorage";
import {ChangePass} from "./comps/app1/users/ChangePass";
import {ModalDialog} from "./comps/modaldialog/ModalDialog";
import {UserInfo} from "./comps/app1/users/UserInfo";
import {AddUser} from "./comps/app1/users/AddUser";
import {Samplelist} from "./comps/app1/users/SampleList";
import {ImgLoader} from "./comps/imgloader/ImgLoader";
import {Ng2Highmaps} from "./comps/ng2-highcharts/src/directives/ng2-highmaps";
import {Ng2Highstocks} from "./comps/ng2-highcharts/src/directives/ng2-highstocks";
import {SimplelistEditable} from "./comps/simplelist/SimplelistEditable";
import {OrderBy} from "./pipes/OrderBy";
import {SortBy} from "./pipes/SortBy";
import {FilterPipe} from "./pipes/FilterPipe";
import {AdnetConfigTargetStations} from "./comps/app1/adnet/targets/AdnetConfigTargetStations";
import {AdnetConfigTargetProps} from "./comps/app1/adnet/targets/AdnetConfigTargetProps";
import {AdnetLocation} from "./comps/app1/adnet/targets/AdnetLocation";
import {MapAddress} from "./comps/mapaddress/MapAddress";
import {AdnetNetwork} from "./comps/app1/adnet/network/AdnetNetwork";
import {AdnetNetworkPackageEditor} from "./comps/app1/adnet/network/AdnetNetworkPackageEditor";
import {AdnetNetworkCustomerSelector} from "./comps/app1/adnet/network/AdnetNetworkCustomerSelector";
import {AdnetNetworkPackageViewer} from "./comps/app1/adnet/network/AdnetNetworkPackageViewer";
import {AdnetNetworkPackageProps} from "./comps/app1/adnet/network/AdnetNetworkPackageProps";
import {AdnetNetworkPackageContent} from "./comps/app1/adnet/network/AdnetNetworkPackageContent";
import {AdnetNetworkPackageContentProps} from "./comps/app1/adnet/network/AdnetNetworkPackageContentProps";
import {AdnetNetworkTarget} from "./comps/app1/adnet/network/AdnetNetworkTarget";
import {AdnetNetworkTargetProps} from "./comps/app1/adnet/network/AdnetNetworkTargetProps";
import {DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';
import {AccordionModule} from 'ng2-bootstrap/ng2-bootstrap';
import {ResourceViewer} from "./comps/resourceviewer/ResourceViewer";
import AppTemplate from './App.html!text';
import {AdnetNetworkPackageViewProps} from "./comps/app1/adnet/network/AdnetNetworkPackageViewProps";
import {AdnetNetworkPairProps} from "./comps/app1/adnet/network/AdnetNetworkPairProps";
import {AdnetNetworkTargetSearch} from "./comps/app1/adnet/network/AdnetNetworkTargetSearch";
import {SimpleGridModule} from "./comps/simplegridmodule/SimpleGridModule";
import {AdnetResolver} from "./comps/app1/adnet/targets/AdnetResolver";
import {AdnetLoader} from "./comps/app1/adnet/AdnetLoader";
import {InputNumeric} from "./comps/inputnumeric/InputNumeric";
import {InputString} from "./comps/inputstring/InputString";
import {InputTextModule, SelectButtonModule} from 'primeng/primeng';
import {DropdownModule as DropdownModulePrime} from 'primeng/primeng';
import {Dropbox} from "./comps/dropbox/Dropbox";
import {TreeModule} from 'primeng/primeng';
import {Twofactor} from "./comps/twofactor/Twofactor";
import {AdnetReports} from "./comps/app1/adnet/network/AdnetReports";
import {ToastModule, ToastOptions, ToastsManager} from 'ng2-toastr/ng2-toastr';
import {StringJSPipe} from "./pipes/StringJSPipe";
import {NgArrayPipesModule, NgStringPipesModule} from 'angular-pipes';
import {JoinPipe} from 'angular-pipes/src/array/join.pipe';
import {AdnetBilling} from "./comps/app1/adnet/billing/AdnetBilling";
import {AdnetPayment} from "./comps/app1/adnet/billing/AdnetPayment";
import {AdnetTransfer} from "./comps/app1/adnet/billing/AdnetTransfer";
import {FilterPipeEqual} from "./pipes/FilterPipeNot";
import {Ngmslib} from "ng-mslib";

//import {TreeModule} from 'angular2-tree-component'; // removed 11-1-2016 using prime tree
//import "zone.js/dist/long-stack-trace-zone"; // removed 9-7-2016

export enum ServerMode {
    CLOUD,
    PRIVATE,
    HYBRID
}

/**
 Main application bootstrap
 @class App
 **/
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.Emulated,
    providers: [StyleService, AppdbAction],
    template: AppTemplate
})

export class Main {
    constructor(private localStorage: LocalStorage,
                private router: Router,
                private appStore: AppStore,
                private commBroker: CommBroker,
                private activatedRoute: ActivatedRoute,
                private titleService: Title,
                styleService: StyleService,
                private appdbAction: AppdbAction,
                private toastr: ToastsManager,
                private vRef: ViewContainerRef) {

        /** remove localstore **/
        // this.localStorage.removeItem('remember_me')
        // this.localStorage.removeItem('business_id')
        this.localStorage.removeItem('adnet_customer_id')
        this.localStorage.removeItem('adnet_token_id')

        // todo: add logic to as when on each env
        // 0 = cloud, 1 = private 2 = hybrid
        this.checkPlatform();

        Ngmslib.GlobalizeStringJS();

        this.commBroker.setValue(Consts.Values().SERVER_MODE, ServerMode.CLOUD);
        this.m_styleService = styleService;
        this.commBroker.setService(Consts.Services().App, this);
        Observable.fromEvent(window, 'resize').debounceTime(250).subscribe(() => {
            this.appResized();
        });
        if (!Lib.DevMode()) {
            setTimeout(() => {
                router.navigate(['/App1/Dashboard']);
            }, 1000);
        }

        this.toastr.setRootViewContainerRef(vRef);
    }

    private m_styleService: StyleService;
    private version = '3.55';

    private checkPlatform() {
        switch (platform.name.toLowerCase()) {
            case 'microsoft edge': {
                alert(`${platform.name} browser not supported at this time, please use Google Chrome`);
                break;
            }
            case 'chrome': {
                break;
            }
            default: {
                alert('for best performance please use Google Chrome');
                break;
            }
        }
    }

    public appResized(): void {
        var appHeight = document.body.clientHeight;
        var appWidth = document.body.clientWidth;
        this.commBroker.setValue(Consts.Values().APP_SIZE, {
            height: appHeight,
            width: appWidth
        });
        this.commBroker.fire({
            fromInstance: self,
            event: Consts.Events().WIN_SIZED,
            context: '',
            message: {
                height: appHeight,
                width: appWidth
            }
        })
    }

    ngOnInit() {
        // does not support hot-reload
        if (!Lib.DevMode)
            this.listenRouterUpdateTitle();
    }

    private listenRouterUpdateTitle() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild) {
                    route = route.firstChild
                }
                return route;
            }).filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => {
                this.titleService.setTitle(event['title'])
            });
    }
}

if (!Lib.DevMode())
    enableProdMode();

var googleKey = function () {
    var config = new LazyMapsAPILoaderConfig();
    config.apiKey = 'AIzaSyAGD7EQugVG8Gq8X3vpyvkZCnW4E4HONLI';
    config.libraries = ['places'];
    return config;
}

var providing = [CommBroker, AUTH_PROVIDERS,
    {
        provide: LazyMapsAPILoaderConfig,
        useFactory: () => googleKey()
    },
    {
        provide: AppStore,
        useFactory: Lib.StoreFactory({
            notify,
            appdb,
            business,
            stations,
            reseller,
            adnet,
            orders
        })
    },
    {
        provide: StoreService,
        useClass: StoreService
    },
    {
        provide: BusinessAction,
        useClass: BusinessAction
    },
    {
        provide: ResellerAction,
        useClass: ResellerAction
    },
    {
        provide: AdnetActions,
        useClass: AdnetActions
    },
    {
        provide: OrdersAction,
        useClass: OrdersAction
    },
    {
        provide: StationsAction,
        useClass: StationsAction
    },
    {
        provide: AppdbAction,
        useClass: AppdbAction
    },
    {
        provide: AdnetResolver,
        useClass: AdnetResolver
    },
    {
        provide: CreditService,
        useClass: CreditService
    },
    {
        provide: LocalStorage,
        useClass: LocalStorage
    },
    {
        provide: CommBroker,
        useClass: CommBroker
    },
    {
        provide: Consts,
        useClass: Consts
    },
    {
        provide: "DEV_ENV",
        useValue: Lib.DevMode()
    },
    {
        provide: "OFFLINE_ENV",
        useValue: false
    }];

var decelerations = [Main, RatesTable, UsersDetails, LoginPanel, Menu, MenuItem, Account, Whitelabel, Apps, App1, Users, Adnet, Privileges, Dashboard, Logout, Orders, Filemenu, FilemenuItem, Logo, LogoCompany, Footer, BlurForwarder, InputEdit, OrderBy, StringJSPipe, SortBy, FilterPipe, FilterPipeEqual, AdnetBilling, AdnetConfigTargets, AdnetConfigRates, Tabs, Tab, ServerStats, ServerAvg, StationsMap, StationsGrid, StationDetails, ImgLoader, Ng2Highcharts, AdnetConfigCustomer, AdnetConfig, StationSnapshot, OrderDetails, SimpleList, PrivilegesDetails, ModalDialog, Infobox, UserStorage, Loading, Samplelist, UserInfo, AddUser, AdnetPayment, AdnetTransfer, ChangePass, MODAL_DIRECTIVES, Ng2Highstocks, Ng2Highmaps, SimplelistEditable, AdnetConfigTargetStations, AdnetConfigTargetProps, AdnetLocation, MapAddress, AdnetNetwork, AdnetNetworkCustomerSelector, AdnetNetworkPackageEditor, AdnetNetworkPackageViewer, AdnetNetworkTargetSearch, AdnetNetworkPackageProps, AdnetNetworkPackageContent, AdnetNetworkPackageContentProps, AdnetNetworkTarget, AdnetNetworkTargetProps, ResourceViewer, AdnetNetworkPackageViewProps, AdnetNetworkPairProps, AdnetLoader, InputNumeric, InputString, Dropbox, Twofactor, AdnetReports];

let options: ToastOptions = new ToastOptions({
    toastLife: 4000,
    animate: 'flyRight'
});

@NgModule({
    imports: [BrowserModule, SimpleGridModule.forRoot(), AgmCoreModule.forRoot(), JsonpModule, HttpModule, ReactiveFormsModule, FormsModule, ToastModule.forRoot(options), DropdownModule, AccordionModule, routing, TreeModule, NgStringPipesModule, InputTextModule, SelectButtonModule, InputTextModule, DropdownModulePrime],
    providers: [providing],
    declarations: decelerations,
    bootstrap: [Main],
})
export class App {
}
platformBrowserDynamic().bootstrapModule(App, providing).then((appRef: NgModuleRef<any>) => {
    appInjService(appRef.injector);
});

window['hr'] && window['hr'].on('change', (fileName) => {
    if (fileName.indexOf('html') !== -1) {
        var newBody = document.createElement('body')
        newBody.appendChild(document.createElement('app'))
        document.body = newBody;
        platformBrowserDynamic().bootstrapModule(App, providing).then((appRef: NgModuleRef<any>) => {
            appInjService(appRef.injector);
        });
    }
});

