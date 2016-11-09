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
    var Ng2Highcharts;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Ng2Highcharts = (function () {
                function Ng2Highcharts(ele) {
                    this.init = new core_1.EventEmitter();
                    this.hostElement = ele;
                }
                Object.defineProperty(Ng2Highcharts.prototype, "options", {
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
                            if (!opt.chart) {
                                opt.chart = {};
                            }
                            opt.chart.renderTo = this.hostElement.nativeElement;
                            this.chart = new Highcharts.Chart(opt);
                            this.init.emit(this.chart);
                        }
                        else {
                            console.log('No valid options...');
                            console.dir(opt);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input('ng2-highcharts'), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], Ng2Highcharts.prototype, "options", null);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Ng2Highcharts.prototype, "init", void 0);
                Ng2Highcharts = __decorate([
                    core_1.Directive({
                        selector: '[ng2-highcharts]'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], Ng2Highcharts);
                return Ng2Highcharts;
            }());
            exports_1("Ng2Highcharts", Ng2Highcharts);
        }
    }
});
