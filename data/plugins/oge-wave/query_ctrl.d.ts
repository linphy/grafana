/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class KDMWaveDatasourceQueryCtrl extends QueryCtrl {
    private uiSegmentSrv;
    static templateUrl: string;
    dataSource: any;
    constructor($scope: any, $injector: any, uiSegmentSrv: any);
    getOptions(): any;
    onChangeInternal(): void;
}
