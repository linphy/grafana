System.register(['app/plugins/sdk'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var sdk_1;
    var KDMWaveQueryOptionsCtrl;
    return {
        setters:[
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }],
        execute: function() {
            KDMWaveQueryOptionsCtrl = (function (_super) {
                __extends(KDMWaveQueryOptionsCtrl, _super);
                function KDMWaveQueryOptionsCtrl($scope, $injector, uiSegmentSrv) {
                    _super.call(this, $scope, $injector);
                    this.uiSegmentSrv = uiSegmentSrv;
                }
                KDMWaveQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
                return KDMWaveQueryOptionsCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("KDMWaveQueryOptionsCtrl", KDMWaveQueryOptionsCtrl);
        }
    }
});
//# sourceMappingURL=query_option.js.map