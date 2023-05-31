import { GenericDatasource } from './datasource';
import { GenericDatasourceQueryCtrl } from './query_ctrl';
import { GenericQueryOptionsCtrl } from './query_option';

class GenericAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

class KDMDatasourceConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  GenericDatasource as Datasource,
  GenericDatasourceQueryCtrl as QueryCtrl,
  KDMDatasourceConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
  GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
