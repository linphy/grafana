/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export default class GenericDatasource {
    private $q;
    private backendSrv;
    private templateSrv;
    private templateChange;
    type: string;
    url: string;
    name: string;
    isStep: any;
    isAlert: any;
    dataType: any;
    queryPoints: any;
    pointOrWave: any;
    kdmUrl: string;
    /** @ngInject */
    constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any, templateChange: any);
    query(options: any): any;
    addPoints(targets: any, attribute: any): void;
    getSpotDataValue(targets: any, query: any): Promise<{
        data: any[];
    }>;
    getKksCodes(target: any): Promise<{}>;
    resultsToGrafanaData(targets: any, resSpot: any, isAlert: any, isStep: any): {
        data: any[];
    };
    testDatasource(): any;
    annotationQuery(options: any): any;
    metricFindQuery(options: any): any;
    metricFindQueryPoint(options: any): any;
    mapToTextValue(result: any): any;
    metricFindQueryWave(options: any): any;
    mapToTextValueWave(result: any): any;
    getLoginStatus(): any;
    buildRequestUrl(relativePath: any): string;
    request(rawOptions: any): any;
    buildQueryParameters(options: any): any;
}
