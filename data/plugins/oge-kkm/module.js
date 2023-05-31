System.register(['./datasource', './query_ctrl', './query_option'], function(exports_1) {
    var datasource_1, query_ctrl_1, query_option_1;
    var RESTQueryOptionsCtrl, RESTDatasourceConfigCtrl;
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
            RESTQueryOptionsCtrl = (function () {
                function RESTQueryOptionsCtrl() {
                }
                RESTQueryOptionsCtrl.templateUrl = 'annotations.editor.html';
                return RESTQueryOptionsCtrl;
            })();
            RESTDatasourceConfigCtrl = (function () {
                function RESTDatasourceConfigCtrl() {
                }
                RESTDatasourceConfigCtrl.templateUrl = 'partials/config.html';
                return RESTDatasourceConfigCtrl;
            })();
            exports_1("Datasource", datasource_1.RESTDatasource);
            exports_1("QueryCtrl", query_ctrl_1.RESTDatasourceQueryCtrl);
            exports_1("ConfigCtrl", RESTDatasourceConfigCtrl);
            exports_1("QueryOptionsCtrl", query_option_1.GenericQueryOptionsCtrl);
            exports_1("AnnotationsQueryCtrl", RESTQueryOptionsCtrl);
        }
    }
});
//# sourceMappingURL=module.js.map