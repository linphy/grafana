System.register(['app/plugins/sdk'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var sdk_1;
    var RESTDatasourceQueryCtrl;
    return {
        setters:[
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }],
        execute: function() {
            RESTDatasourceQueryCtrl = (function (_super) {
                __extends(RESTDatasourceQueryCtrl, _super);
                /** @ngInject **/
                function RESTDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
                    _super.call(this, $scope, $injector);
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.modernBrowsers = [];
                    this.outputBrowsers = [];
                    var messureType = [
                        { name: '三维-模型-时间列表', value: 'd3_model_timeList' },
                        { name: '三维-模型', value: 'd3model_models' },
                        { name: '指标值', value: 'kpi_data' },
                        { name: '指标值-Json', value: 'kpi_json_data' },
                    ];
                    this.messureType = messureType;
                    this.target.tagName = this.target.tagName;
                    this.target.target = this.target.tagName;
                    this.target.messureType = this.target.messureType || 'kpi_data';
                }
                RESTDatasourceQueryCtrl.prototype.getOptions = function () {
                    return this.datasource.metricFindQuery(this.target).then(this.uiSegmentSrv.transformToSegments(false));
                };
                RESTDatasourceQueryCtrl.prototype.getCategory = function () {
                    var _this = this;
                    return this.datasource.metricFindQuery(this.target).then(function (data) {
                        _this.inputMomodel = data;
                    });
                };
                RESTDatasourceQueryCtrl.prototype.onChangeInternal = function () {
                    this.panelCtrl.refresh(); // Asks the panel to refresh data.
                };
                RESTDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
                return RESTDatasourceQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("RESTDatasourceQueryCtrl", RESTDatasourceQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map