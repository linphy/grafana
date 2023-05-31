/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export default class KDMWaveDatasource {
    private $q;
    private backendSrv;
    private templateSrv;
    private templateChange;
    type: string;
    url: string;
    name: string;
    kdmUrl: string;
    linkUser: string;
    linkPassword: string;
    tokenName: string;
    constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any, templateChange: any);
    query(options: any): any;
    testDatasource(): any;
    annotationQuery(options: any): any;
    metricFindQuery(options: any): any;
    mapToTextValue(result: any): any;
    buildQueryParameters(options: any): any;
    /**
     *
     */
    getLoginStatus(): any;
    /**
     *
     *经测试在link退出登录后,Cookie不会被删除,还是能够正确的获取到,所以当在请求后,如果返回的是401错误,需要再次执行登录以及发送相应的请求
     */
    relogin(error: any, re: any): any;
    /**
     *
     */
    loginRequest(): any;
    request(rawOptions: any): any;
    buildRequestUrl(relativePath: any): string;
    getCookie(c_name: any): string;
    getKDMLinkDefaultToken(): any;
    buildSourceParam(options: any): any;
}
