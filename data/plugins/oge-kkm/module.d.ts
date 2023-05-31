import { RESTDatasource } from './datasource';
import { RESTDatasourceQueryCtrl } from './query_ctrl';
import { GenericQueryOptionsCtrl } from './query_option';
declare class RESTQueryOptionsCtrl {
    static templateUrl: string;
}
declare class RESTDatasourceConfigCtrl {
    static templateUrl: string;
}
export { RESTDatasource as Datasource, RESTDatasourceQueryCtrl as QueryCtrl, RESTDatasourceConfigCtrl as ConfigCtrl, GenericQueryOptionsCtrl as QueryOptionsCtrl, RESTQueryOptionsCtrl as AnnotationsQueryCtrl };
