///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['app/plugins/sdk'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var sdk_1;
    var KDMWaveDatasourceQueryCtrl;
    return {
        setters:[
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }],
        execute: function() {
            KDMWaveDatasourceQueryCtrl = (function (_super) {
                __extends(KDMWaveDatasourceQueryCtrl, _super);
                function KDMWaveDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
                    _super.call(this, $scope, $injector);
                    this.uiSegmentSrv = uiSegmentSrv;
                    this.target.target = this.target.target || '输入kks搜索条件';
                    var dataSource = [
                        { name: '波形频谱', value: 1 },
                        { name: '气隙', value: 2 },
                        { name: '空间轴线', value: 3 }
                    ];
                    this.dataSource = dataSource;
                    this.target.dataSource = this.target.dataSource || 1;
                }
                KDMWaveDatasourceQueryCtrl.prototype.getOptions = function () {
                    return this.datasource.metricFindQuery(this.target).then(this.uiSegmentSrv.transformToSegments(false));
                };
                KDMWaveDatasourceQueryCtrl.prototype.onChangeInternal = function () {
                    this.panelCtrl.refresh();
                };
                KDMWaveDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
                return KDMWaveDatasourceQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("KDMWaveDatasourceQueryCtrl", KDMWaveDatasourceQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map