import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {FilterPipe} from "../../pipes/FilterPipe";
import {List} from 'immutable';
import {SimplelistEditable} from "./SimplelistEditable";
import * as _ from 'lodash'

export interface  ISimpleListItem {
    item:any,
    index:number,
    selected:boolean
}

@Component({
    selector: 'SimpleList',
    moduleId: __moduleName,
    templateUrl: 'Simplelist.html',
    styleUrls: ['Simplelist.css'],
    directives: [SimplelistEditable],
    pipes: [FilterPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleList {

    private filter:string = '';
    private m_icon:string = '';
    private m_editing:boolean = false;
    private m_iconSelected:string = '';
    private m_iconSelectedIndex:number = -1;
    private m_iconSelectedMode:boolean = false;
    private m_metadata:any = {};

    ngAfterViewInit() {
        // if (this.simpleListEditable)
        //     this.simpleListEditable.setContent(this.content)
    }

    @ViewChild(SimplelistEditable)
    simpleListEditable:SimplelistEditable;
    
    
    @Input()
    list:List<any>;

    @Input()
    editable:boolean = false;

    @Input()
    content:((any)=>string);

    @Input()
    contentId:((any)=>string);

    @Input()
    iconSelected:((index:number, item:any)=>boolean);

    @Input()
    set icon(i_icon:string) {
        this.m_icon = i_icon;
    }

    @Input()
    set iconSelectiondMode(mode:boolean) {
        if (mode) {
            this.m_iconSelectedMode = true;
            this.m_icon = 'fa-circle-o'
            this.m_iconSelected = 'fa-check-circle'
        }
    }

    @Output()
    hover:EventEmitter<any> = new EventEmitter();

    @Output()
    iconClicked:EventEmitter<any> = new EventEmitter();

    @Output()
    selected:EventEmitter<any> = new EventEmitter();

    @Output()
    edited:EventEmitter<any> = new EventEmitter();

    private onEditChanged(event) {
        this.edited.emit((event))
    }

    private itemSelected(item, index) {
        let id = this.contentId ? this.contentId(item) : index;
        for (let id in this.m_metadata) {
            this.m_metadata[id] = {
                selected: false
            }
        }
        this.m_metadata[id] = {
            item: item,
            index: index,
            selected: true //this.m_editClickPending ? true : !this.m_metadata[id].selected

        }
        this.selected.next(this.m_metadata);
    }

    private renderIcon(index, item) {
        if (!this.m_iconSelectedMode)
            return this.m_icon;
        if (this.iconSelected) {
            if (this.iconSelected(index, item)) {
                this.m_iconSelectedIndex = index;
                return this.m_iconSelected;
            } else {
                return this.m_icon;
            }
        }
        if (index == this.m_iconSelectedIndex)
            return this.m_iconSelected;
        return this.m_icon;
    }

    private itemAllSelected() {
        for (let id in this.m_metadata)
            this.m_metadata[id].selected = true;
        this.list.forEach((i_item)=> {
            this.selected.next(this.m_metadata);
        })
    }

    private onIconClick(event, index) {
        var self = this;
        // this.m_editClickPending = true;
        this.m_iconSelectedIndex = index;
        setTimeout(()=> {
            let match = _.find(self.m_metadata, (i:any) => i.index == index);
            // console.log(match.item.getBusinessId() + ' ' + match.item.getKey('name'));
            this.iconClicked.next({
                item: match,
                target: event.target,
                index: index,
                metadata: this.m_metadata
            });
        }, 1)
        return true;
    }

    private getMetadata(index, item) {
        let id = this.contentId ? this.contentId(item) : index;
        return this.m_metadata[id];
    }

    public setContent(f) {
        this.content = f;
        // this.simpleListEditable.setContent(this.content)
    }

    public getContentId(item, index):string {
        let id = this.contentId ? this.contentId(item) : index;
        if (!this.m_metadata[id])
            this.m_metadata[id] = {};
        this.m_metadata[id].index = index;
        return id;
    }

    private getContent(item):string {
        if (this.content) {
            return this.content(item);
        } else {
            return item;
        }
    }

    public deselect(){
        this.itemSelected(null,-1);
    }

    public getSelected() {
        return this.m_metadata;
    }

    public set selectedIconIndex(i_index) {
        this.m_iconSelectedIndex = i_index;
    }

    public get selectedIconIndex() {
        return this.m_iconSelectedIndex;
    }
}