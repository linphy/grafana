import  GenericDatasource from './datasource';
import { GenericDatasourceQueryCtrl } from './query_ctrl';

class GenericAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

class KDMDatasourceConfigCtrl {
  static templateUrl = 'partials/config.html';
  private current: any;
  constructor($scope) {
    this.current.jsonData = this.current.jsonData || {};
    this.current.jsonData.kdmUrl = this.current.jsonData.kdmUrl || "http://127.0.0.1:8082/kdmService/rest/1.0";
  }
}

export {
  GenericDatasource as Datasource,
  GenericDatasourceQueryCtrl as QueryCtrl,
  KDMDatasourceConfigCtrl as ConfigCtrl,
  GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
