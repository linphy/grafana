/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export declare class RESTDatasource {
    private $q;
    private backendSrv;
    private templateSrv;
    url: string;
    type: string;
    name: string;
    messureType: string;
    options: any;
    /** @ngInject */
    constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any);
    query(options: any): any;
    requestD3Data(target: any, startTime: any, endTime: any, options: any): any;
    requestKPIData(target: any, startTime: any, endTime: any, options: any): any;
    /**
     * 获取KPI报警数据
     */
    requestKPIAlert(target: any, startTime: any, endTime: any, options: any): any;
    /**
     * 测试数据源是否能够正常连接
     */
    testDatasource(): any;
    metricFindQuery(target: any): any;
    mapToTextValue(result: any): any;
    /**
     * 执行Post请求
     */
    postRequest(urlPath: any, data: any): any;
    /**
     * 获取KPI报警数据
     */
    getKpiDataValue(rawData: any, target: any, options: any, dataItem: any): void;
    /**
     * 获取KPI指标报警数据
     */
    getKpiDataAlert(rawData: any, target: any, options: any, dataItem: any): void;
    /**
     * 将Date对象转换成指定格式的字符串
     */
    formatDate(date: any, format: any): any;
    getD3modelData(kpi_datas: any, tagName: any, refId: any): {
        data: any[];
    };
    getTagName(tagName: any): any;
    buildQueryParameters(options: any): any;
    buildSourceParam(options: any): any;
    buildTimeToLong(time: any): number;
    /**
     * 根据配置的电厂和机组以及模板KKS替换成实际的监测量
     */
    buildTagCode(tagName: any): any;
}
