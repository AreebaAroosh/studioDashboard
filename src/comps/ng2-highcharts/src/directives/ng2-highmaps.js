System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var Ng2Highmaps;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Ng2Highmaps = (function () {
                function Ng2Highmaps(ele) {
                    this.init = new core_1.EventEmitter();
                    this.jqEle = jQuery(ele.nativeElement);
                }
                Object.defineProperty(Ng2Highmaps.prototype, "options", {
                    set: function (opt) {
                        if (!opt) {
                            console.log('No valid options...');
                            console.log(opt);
                            return;
                        }
                        if (opt.series || opt.data) {
                            if (this.chart) {
                                this.chart.destroy();
                            }
                            this.chart = this.jqEle.highcharts('Map', opt);
                            this.init.emit({ chart: this.chart, el: this.jqEle });
                        }
                        else {
                            console.dir(opt);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input('ng2-highmaps'), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], Ng2Highmaps.prototype, "options", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Ng2Highmaps.prototype, "init", void 0);
                Ng2Highmaps = __decorate([
                    core_1.Directive({
                        selector: '[ng2-highmaps]'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], Ng2Highmaps);
                return Ng2Highmaps;
            }());
            exports_1("Ng2Highmaps", Ng2Highmaps);
        }
    }
});
