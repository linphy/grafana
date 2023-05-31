System.register(['app/plugins/sdk'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var sdk_1;
    var GenericQueryOptionsCtrl;
    return {
        setters:[
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }],
        execute: function() {
            GenericQueryOptionsCtrl = (function (_super) {
                __extends(GenericQueryOptionsCtrl, _super);
                /** @ngInject **/
                function GenericQueryOptionsCtrl($scope, $injector) {
                    _super.call(this, $scope, $injector);
                    var dataTypeOptions = [{ name: '实时值', value: 1 }, { name: '历史值', value: 2 }];
                    this.dataTypeOptions = dataTypeOptions;
                    this.panelCtrl.panel.kdm = this.panelCtrl.panel.kdm || {};
                    this.panelCtrl.panel.kdm.dataType = this.panelCtrl.panel.kdm.dataType || 1; //默认取实时值
                    this.panelCtrl.panel.kdm.isAlert = this.panelCtrl.panel.kdm.isAlert || false; //默认无告警
                }
                GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
                return GenericQueryOptionsCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("GenericQueryOptionsCtrl", GenericQueryOptionsCtrl);
        }
    }
});
//# sourceMappingURL=query_option.js.map