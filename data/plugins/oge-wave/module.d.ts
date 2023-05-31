import KDMWaveDatasource from './datasource';
import { KDMWaveDatasourceQueryCtrl } from './query_ctrl';
import { KDMWaveQueryOptionsCtrl } from './query_option';
declare class GenericAnnotationsQueryCtrl {
    static templateUrl: string;
}
declare class KDMWaveDatasourceConfigCtrl {
    static templateUrl: string;
    private current;
    constructor($scope: any);
}
export { KDMWaveDatasource as Datasource, KDMWaveDatasourceQueryCtrl as QueryCtrl, KDMWaveDatasourceConfigCtrl as ConfigCtrl, KDMWaveQueryOptionsCtrl as QueryOptionsCtrl, GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl };
