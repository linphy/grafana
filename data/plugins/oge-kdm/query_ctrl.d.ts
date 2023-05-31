/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class GenericDatasourceQueryCtrl extends QueryCtrl {
    private uiSegmentSrv;
    static templateUrl: string;
    dataType: any;
    isStep: any;
    isAlert: any;
    queryPoints: any;
    dataTypeOptions: any;
    pointOrWave: any;
    dataSource: any;
    /** @ngInject **/
    constructor($scope: any, $injector: any, uiSegmentSrv: any);
    getOptions(): any;
    onChangeInternal(): void;
    changePW(): void;
}
