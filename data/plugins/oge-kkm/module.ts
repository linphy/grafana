import { RESTDatasource } from './datasource';
import { RESTDatasourceQueryCtrl } from './query_ctrl';
import { GenericQueryOptionsCtrl } from './query_option';

class RESTQueryOptionsCtrl {
  static templateUrl = 'annotations.editor.html';
}

class RESTDatasourceConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  RESTDatasource as Datasource,
  RESTDatasourceQueryCtrl as QueryCtrl,
  RESTDatasourceConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
  RESTQueryOptionsCtrl as AnnotationsQueryCtrl,
};
