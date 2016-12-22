import {Routes, RouterModule} from "@angular/router";
import {App1} from "./comps/app1/App1";
import {LoginPanel} from "./comps/entry/LoginPanel";
import {Logout} from "./comps/logout/Logout";
import {Dashboard} from "./comps/app1/dashboard/Dashboard";
import {Users} from "./comps/app1/users/Users";
import {Privileges} from "./comps/app1/privileges/Privileges";
import {Whitelabel} from "./comps/app1/whitelabel/Whitelabel";
import {Apps} from "./comps/app1/apps/Apps";
import {Account} from "./comps/app1/account/Account";
import {Orders} from "./comps/app1/orders/Orders";
import {AuthService} from "./services/AuthService";
import {AutoLogin} from "./comps/entry/AutoLogin";

const routes: Routes = [
    {path: 'index.html', data: {title: 'Login'}, component: AutoLogin},
    {path: 'AutoLogin', data: {title: 'Login'}, component: AutoLogin},
    {path: 'UserLogin', data: {title: 'Login'}, component: LoginPanel},
    {path: 'UserLogin/:twoFactor', data: {title: 'Login'}, component: LoginPanel},
    {path: 'UserLogin/:twoFactor/:user/:pass', data: {title: 'Login'}, component: LoginPanel},
    {path: 'Logout', component: Logout},
    {path: '', component: App1, canActivate: [AuthService]},
    {
        path: 'src', component: App1,
        children: [
            {path: 'public', component: Dashboard, canActivate: [AuthService]}
        ]
    },
    {
        path: 'App1', component: App1,
        children: [
            {path: '', component: App1, canActivate: [AuthService]},
            {path: 'Dashboard', component: Dashboard, data: {title: 'Dashboard'}, canActivate: [AuthService]},
            {path: 'Orders', component: Orders, data: {title: 'Orders'}, canActivate: [AuthService]},
            {path: 'Users', component: Users, data: {title: 'Users'}, canActivate: [AuthService]},
            {path: 'Privileges', component: Privileges, data: {title: 'Privileges'}, canActivate: [AuthService]},
            {path: 'White label', component: Whitelabel, data: {title: 'Branding'}, canActivate: [AuthService]},
            {path: 'Apps', component: Apps, data: {title: 'Apps'}, canActivate: [AuthService]},
            {path: 'Account', component: Account, data: {title: 'Account'}, canActivate: [AuthService]},
            {path: 'Orders', component: Orders, data: {title: 'Orders'}, canActivate: [AuthService]},
            {path: 'Logout', component: Logout, data: {title: 'Logout'}, canActivate: [AuthService]},
            {path: '**', redirectTo: 'Dashboard'}
        ]
    }
];

export const routing = RouterModule.forRoot(routes, {enableTracing: false});


