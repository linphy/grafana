/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class RESTDatasourceQueryCtrl extends QueryCtrl {
    private uiSegmentSrv;
    static templateUrl: string;
    messureType: any;
    tagName: string;
    inputMomodel: any;
    modernBrowsers: any;
    outputBrowsers: any;
    /** @ngInject **/
    constructor($scope: any, $injector: any, uiSegmentSrv: any);
    getOptions(): any;
    getCategory(): any;
    onChangeInternal(): void;
}
