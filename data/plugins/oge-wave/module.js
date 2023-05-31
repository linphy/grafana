System.register(['./datasource', './query_ctrl', './query_option'], function(exports_1) {
    var datasource_1, query_ctrl_1, query_option_1;
    var GenericAnnotationsQueryCtrl, KDMWaveDatasourceConfigCtrl;
    return {
        setters:[
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            },
            function (query_option_1_1) {
                query_option_1 = query_option_1_1;
            }],
        execute: function() {
            GenericAnnotationsQueryCtrl = (function () {
                function GenericAnnotationsQueryCtrl() {
                }
                GenericAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
                return GenericAnnotationsQueryCtrl;
            })();
            KDMWaveDatasourceConfigCtrl = (function () {
                function KDMWaveDatasourceConfigCtrl($scope) {
                    this.current.jsonData = this.current.jsonData || {};
                    this.current.jsonData.kdmUrl = this.current.jsonData.kdmUrl || "http://127.0.0.1:8082/kdmService/rest/1.0";
                }
                KDMWaveDatasourceConfigCtrl.templateUrl = 'partials/config.html';
                return KDMWaveDatasourceConfigCtrl;
            })();
            exports_1("Datasource", datasource_1.default);
            exports_1("QueryCtrl", query_ctrl_1.KDMWaveDatasourceQueryCtrl);
            exports_1("ConfigCtrl", KDMWaveDatasourceConfigCtrl);
            exports_1("QueryOptionsCtrl", query_option_1.KDMWaveQueryOptionsCtrl);
            exports_1("AnnotationsQueryCtrl", GenericAnnotationsQueryCtrl);
        }
    }
});
//# sourceMappingURL=module.js.map