import {Action} from "@ngrx/store";
export const APP_INIT = 'APP_INIT';


export class AppInit implements Action {
    readonly type = APP_INIT;

    constructor(public payload?: string) {
    }
}