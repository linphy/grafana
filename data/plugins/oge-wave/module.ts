import  KDMWaveDatasource  from './datasource';
import { KDMWaveDatasourceQueryCtrl } from './query_ctrl';
import { KDMWaveQueryOptionsCtrl } from './query_option';

class GenericAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

class KDMWaveDatasourceConfigCtrl {
  static templateUrl = 'partials/config.html';
  private current: any;

  constructor($scope) {
    this.current.jsonData = this.current.jsonData || {};
    this.current.jsonData.kdmUrl = this.current.jsonData.kdmUrl || "http://127.0.0.1:8082/kdmService/rest/1.0";
  }
}

export {
  KDMWaveDatasource as Datasource,
  KDMWaveDatasourceQueryCtrl as QueryCtrl,
  KDMWaveDatasourceConfigCtrl as ConfigCtrl,
  KDMWaveQueryOptionsCtrl as QueryOptionsCtrl,
  GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
