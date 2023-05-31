import GenericDatasource from './datasource';
import { GenericDatasourceQueryCtrl } from './query_ctrl';
declare class GenericAnnotationsQueryCtrl {
    static templateUrl: string;
}
declare class KDMDatasourceConfigCtrl {
    static templateUrl: string;
    private current;
    constructor($scope: any);
}
export { GenericDatasource as Datasource, GenericDatasourceQueryCtrl as QueryCtrl, KDMDatasourceConfigCtrl as ConfigCtrl, GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl };
