import _ from 'lodash';

export class GenericDatasource {
  type: string;
  url: string;
  name: string;
  kdmUrl: string;
  kksCache: any;
  isStep: any;
  isAlert: any;
  dataType: any;
  queryPoints: any;

  /** @ngInject */
  constructor(instanceSettings, private $q, private backendSrv, private templateSrv, private templateChange) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.kdmUrl = instanceSettings.jsonData.kdmUrl;
  }

  // Called once per panel (graph)
  query(options) {
    var query = this.buildQueryParameters(options);

    if (query.targets.length <= 0) {
      return this.$q.when([]);
    }

    //趋势分析 动态增加kks
    this.templateChange.addPoints(query.targets);

    //更换机组号
    this.templateChange.changeTargets(query.targets);

    return this.backendSrv.datasourceRequest({
      url: this.url + '/query',
      data: query,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Required
  // Used for testing datasource in datasource configuration pange
  testDatasource() {
    //验证kdm插件、kdm server是否连接成功
    var postData = new Object();
    postData = this.buildSourceParam(postData);

    return this.backendSrv
      .datasourceRequest({
        url: this.url + '/checkServer',
        method: 'POST',
        data: postData,
        headers: { 'Content-Type': 'application/json' },
      })
      .then(result => {
        //console.info(result);
        if (result.data === 'true') {
          return { status: 'success', message: 'web plugin and kdm server connect succeed', title: '连接成功' };
        } else {
          return { status: 'faild', message: 'kdm server connect error，please check network', title: '连接失败' };
        }
      })
      .catch(function(err) {
        return { status: 'faild', message: 'kdm plugin connect error，please check network', title: '连接失败' };
      });
  }

  annotationQuery(options) {
    console.log('自定义数据源annotationQuery');
    console.log(options);
    var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
    var annotationQuery = {
      range: options.range,
      annotation: {
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
        query: query,
      },
      rangeRaw: options.rangeRaw,
    };

    return this.backendSrv
      .datasourceRequest({
        url: this.url + '/annotations',
        method: 'POST',
        data: annotationQuery,
      })
      .then(result => {
        return result.data;
      });
  }

  // Optional
  // Required for templating
  metricFindQuery(options) {
    if (options === 'jz') {
      var dc = this.templateSrv.replace('$dc');
      if (dc === '$dc') {
        //机组查询
        dc = '';
      }
      options = { target: dc, dataType: -2, kdmUrl: this.kdmUrl };
    } else if (options === 'dc') {
      options = { target: '', dataType: -1, kdmUrl: this.kdmUrl };
    } else {
      options = this.buildSourceParam(options);
    }

    return this.backendSrv
      .datasourceRequest({
        url: this.url + '/search',
        data: options,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(this.mapToTextValue);
  }

  mapToTextValue(result) {
    //Templating
    if (result.data && result.data.length > 0 && typeof result.data[0] === 'object') {
      return result.data;
    }
    //kks标签
    return _.map(result.data, (d, i) => {
      return { text: d, value: i };
    });
  }

  buildQueryParameters(options) {
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== '输入查询条件';
    });
    var targetsArr = [];
    for (let i = 0; i < options.targets.length; i++) {
      if (!options.targets[i].hide) {
        targetsArr.push({
          target: this.templateSrv.replace(options.targets[i].target, options.scopedVars),
          refId: options.targets[i].refId,
        });
      }
    }
    var targets = targetsArr;
    options.targets = targets;

    options = this.buildSourceParam(options);
    return options;
  }

  buildSourceParam(options) {
    options.kdmUrl = this.kdmUrl;
    return options;
  }
}
