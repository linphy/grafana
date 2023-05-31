/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class GenericQueryOptionsCtrl extends QueryCtrl {
    static templateUrl: string;
    dataType: any;
    isAlert: any;
    queryPoints: any;
    dataTypeOptions: any;
    /** @ngInject **/
    constructor($scope: any, $injector: any);
}
