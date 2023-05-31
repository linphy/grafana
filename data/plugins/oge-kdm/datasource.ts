///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';

export default class GenericDatasource {
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
  constructor(instanceSettings, private $q, private backendSrv, private templateSrv, private templateChange) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.kdmUrl = instanceSettings.url;
  }

  // Called once per panel (graph)
  query(options) {
    var query = this.buildQueryParameters(options);
    var that = this;
    if (!query || !_.isArray(query.targets) || query.targets.length <= 0) {
      return this.$q.when([]);
    }
    if (options.kdm.pointOrWave === 2) {
      if (this.templateSrv.wave_kks && this.templateSrv.wave_kks.length > 0 && this.templateSrv.wave_time) {
        var existTar = query.targets[0];
        //只有在特定的页面才生效
        if (existTar.target == this.templateSrv.page_name) {
          //修改时间
          var time = this.templateSrv.wave_time.replace(/-/g, "/");
          query.range.to._d = new Date(time);
          query.range.from._d = new Date(time);

          query.targets = [];
          var selectTargets = this.templateSrv.wave_kks;
          for (var j = 0; j < selectTargets.length; j++) {
            var targetObj = {
              dataSource: existTar.dataSource,
              target: selectTargets[j]
            };
            query.targets.push(targetObj); //每次query.targets都是空的，不需要考虑是否重复
          }

        } else {
          return this.$q.when([]);
        }
      } else if (query.targets[0].target === 'custom') {
        return this.$q.when([]);
      } else if (query.targets[0].target.indexOf('zhou-xian-fen-xi') > -1  || query.targets[0].target.indexOf('pin-pu-fen-xi') > -1 || query.targets[0].target.indexOf('qi-xi-fen-xi') > -1) {
        return this.$q.when([]);
      }
      delete query.kdm;
      //更换机组号
      this.templateChange.changeTargets(query.targets);
      options = {
        url: this.buildRequestUrl('/query'),
        data: query,
        method: 'POST',
        headers: {}
      };
      options.headers['Content-Type'] = 'application/json;charset=UTF-8';
      return this.getLoginStatus().then(data => {
        return this.request(options)
      })
    }
    //专业工具页面，过滤oge-kdm-selector无效请求
    if (query.targets[0].target === '__zhou-xian-fen-xi' || query.targets[0].target === '__pin-pu-fen-xi' || query.targets[0].target === '__qi-xi-fen-xi' || query.targets[0].target === '__te-zheng-zhi-fen-xi') {
      return this.$q.when([]);
    }
    //趋势分析 动态增加kks
    this.addPoints(query.targets, undefined);
    var promises = [];
    for (var j = 0; j < query.targets.length; j++) {
      if (query.targets[j].target.indexOf('_') > 0 && !query.targets[j].targetCode && !query.targets[j].targetName) {
        query.targets[j].targetCode = query.targets[j].target.split('_')[0];
        query.targets[j].targetName = query.targets[j].target.split('_')[1];
      }
      let queryInfo = query.targets[j].targetCode.indexOf('%') !== -1 || query.targets[j].targetCode.indexOf('json:') === 0;
      if (queryInfo) {
        promises[j] = this.getKksCodes(query.targets[j].targetCode);
      } else {
        if (query.targets[j].targetName) {
          promises[j] = query.targets[j].targetCode + '_' + query.targets[j].targetName;
        } else {
          promises[j] = query.targets[j].targetCode;
        }
      }
    }
    return Promise.all(promises)
      .then(function (results) {
        var targetArr = [];
        if (results && results.length > 0) {
          for (var ind = 0; ind < results.length; ind++) {
            if (results[ind].data) {
              for (var kksind = 0; kksind < results[ind].data.KKSInfos.length; kksind++) {
                targetArr.push({
                  target: results[ind].data.KKSInfos[kksind].kksCode,
                  targetName: results[ind].data.KKSInfos[kksind].kksName,
                  refId: ind + "-" + kksind,
                });
              }
            } else {
              let refIdName;
              for (let m = 0; m < query.targets.length; m++) {
                let kksC = results[ind].indexOf('_') > 0 ? results[ind].split('_')[0] : results[ind];
                if (query.targets[m].targetCode === kksC) {
                  refIdName = query.targets[m].refId;
                }
              }
              targetArr.push({
                target: results[ind].indexOf('_') > 0 ? results[ind].split('_')[0] : results[ind],
                targetName: results[ind].indexOf('_') > 0 ? results[ind].split('_')[1] : results[ind],
                refId: refIdName,
              });
            }
          }
          return that.getSpotDataValue(targetArr, query);
        } else {
          return { data: [] };
        }
      })
      .catch(function (reason) {
        console.log(reason);
      });
  }

  addPoints(targets, attribute) {
    if (attribute === undefined) {
      attribute = 'target';
    }

    if (this.templateSrv.selectTargets && targets.length === 1 && targets[0][attribute] === '__shu-zhi-fen-xi') {
      targets.splice(0, targets.length); //不可targets = []
      let selectTargets = this.templateSrv.selectTargets;
      for (var j = 0; j < selectTargets.length; j++) {
        var targetObj = {}; //查询kdm历史点值
        targetObj[attribute] = selectTargets[j];
        targets.push(targetObj); //每次query.targets都是空的，不需要考虑是否重复
      }
    }
  }

  //获取值
  getSpotDataValue(targets, query) {
    var kksCodeName = '';
    var promises = [];
    var obj = this;
    var paramsName;
    var paramsAlert;
    var dataContent;
    var urlVal;
    var urlAlert;
    for (var x = 0; x < targets.length; x++) {
      if (x === 0) {
        kksCodeName = targets[0].target;
      } else {
        kksCodeName += ',' + targets[x].target;
      }
    }
    if (query.kdm && query.kdm.dataType === 2) {
      //历史
      let startT = query.range.from.valueOf();
      let endT = query.range.to.valueOf();
      paramsName = {
        kksCodes: kksCodeName,
        startTime: startT,
        endTime: endT,
        resultType: 2,
        sampled: query.kdm.isStep ? Math.floor((endT - startT) / 1000 / query.kdm.queryPoints) : 0,
      };
      paramsAlert = {
        method: 'getHistoryAlarm',
        kksCodes: kksCodeName,
        startTime: query.range.from.format("YYYY-MM-DD HH:mm:ss"),
        endTime: query.range.to.format("YYYY-MM-DD HH:mm:ss"),
      }
      urlVal = '/kksData?method=getRTDataHistory';
      urlAlert = '/kxmData';
    } else {
      //实时
      paramsName = {
        kksCodes: kksCodeName,
      };
      paramsAlert = {
        method: 'getLatestAlarm',
        kksCodes: kksCodeName,
      }
      urlVal = '/kksData?method=getRTDataSnapshot';
      urlAlert = '/kxmData';
    }
    promises[0] = this.backendSrv.datasourceRequest({
      url: this.url + urlVal,
      params: paramsName,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (query.kdm && query.kdm.isAlert) {
      promises[1] = this.backendSrv
        .datasourceRequest({
          url: this.url + urlAlert,
          method: 'GET',
          params: paramsAlert,
        })
        .catch(function (err) {
          console.log('获取告警值失败：' + err);
        }); //当报警值取不到的时候，无值返回
    }

    return Promise.all(promises)
      .then(function (resSpot) {
        return obj.resultsToGrafanaData(targets, resSpot, query.kdm.isAlert, query.kdm.isStep); //query.kdm.isAlert
      })
      .catch(function (reason) {
        console.log('获取实时值失败：' + reason);
      });
  }
  //获取编码
  getKksCodes(target) {
    var queryName = "[('kksCode','like','" + target + "')]"; //判断条件中已加入%
    var orderby = "[('facilityG','ASC'),('facilityF0','ASC')]";
    if (target.indexOf('json:') === 0) { //当target为json数据时
      var codeStr = '';
      var targStr = target.split('json:');
      var jsonArr = targStr[1].split('|');
      if (jsonArr.length > 1) {
        codeStr = "['&',('kksCode','like','" + jsonArr[0] + "%')";
        for (let codeInd = 0; codeInd < jsonArr.length; codeInd++) {
          if (codeInd === jsonArr.length - 1) {
            codeStr += ",('kksCode','like','%" + jsonArr[codeInd] + "%')]";
          } else {
            codeStr += ",'|',('kksCode','like','%" + jsonArr[codeInd] + "%')";
          }
        }
      } else {
        codeStr = "[('kksCode','like','" + jsonArr[0] + "%')]";
      }
      queryName = codeStr;
    }
    return new Promise((resolve, reject) => {
      resolve(
        this.backendSrv.datasourceRequest({
          url: this.url + '/kksInfo?method=searchKKSInfos&',
          params: {
            limit: 1000,
            offset: 1,
            fields: 'facilityG,facilityF0,kksCode,kksName',
            query: queryName,
            orderby: orderby
          },
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  }
  //数据处理
  resultsToGrafanaData(targets, resSpot, isAlert, isStep) {
    var resultResponSnap = [];
    if (resSpot[0].data && resSpot[0].data.RTDataSets.length > 0) {
      var kksMap = {};
      for (let n = 0; n < targets.length; n++) {
        if (kksMap[targets[n].target]) {
          continue;
        }
        kksMap[targets[n].target] = n;
        resultResponSnap[n] = {
          target: targets[n].targetName,
          refId: targets[n].refId,
          datapoints: [],
        };
      }
      for (let j = 0; j < resSpot[0].data.RTDataSets.length; j++) {
        var arrRes = [];
        var kks = resSpot[0].data.RTDataSets[j].kksCode;
        var rIndex = kksMap[kks];
        if (resSpot[0].data.RTDataSets[j].RTDataValues && rIndex != undefined) {
          for (var i = 0; i < resSpot[0].data.RTDataSets[j].RTDataValues.length; i++) {
            if (isStep && (resSpot[0].data.RTDataSets[j].RTDataValues[i].Value === 922337180000000 || resSpot[0].data.RTDataSets[j].RTDataValues[i].Value > 922337180000000)) continue;
            arrRes = [];
            arrRes.push(resSpot[0].data.RTDataSets[j].RTDataValues[i].Value);
            arrRes.push(resSpot[0].data.RTDataSets[j].RTDataValues[i].Time);
            resultResponSnap[rIndex].datapoints.push(arrRes);
          }
        }
        if (isAlert) {
          if (resSpot[1] && resSpot[1].data && resSpot[1].data.BasicResponse.succeeded === 1) {
            if (resSpot[1].data.Alarm === undefined || resSpot[1].data.Alarm.length === 0) {
              resultResponSnap[rIndex].alarm = { level: 0 };
            } else {
              for (let m = 0; m < resSpot[1].data.Alarm.length; m++) {
                if (resSpot[1].data.Alarm[m].code === resSpot[0].data.RTDataSets[j].kksCode) {
                  resultResponSnap[rIndex].alarm = {
                    level: resSpot[1].data.Alarm[m].value,
                    value: resSpot[1].data.Alarm[m].value,
                    time: resSpot[1].data.Alarm[m].time,
                  };
                }
              }
            }
          }
        }
      }
      return { data: resultResponSnap };
    } else {
      return { data: [] };
    }
  }
  // Required
  // Used for testing datasource in datasource configuration pange
  testDatasource() {
    //验证kdm插件、kdm server是否连接成功
    return this.backendSrv
      .datasourceRequest({
        url: this.url + '/kksStruct?method=getAllKKSStructureDomains',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(result => {
        if (result.data.BasicResponse.succeeded) {
          return { status: 'success', message: 'web plugin and kdm server connect succeed', title: '连接成功' };
        } else {
          return { status: 'faild', message: 'kdm server connect error，please check network', title: '连接失败' };
        }
      })
      .catch(function (err) {
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
    if (typeof options === 'string' || options.kdm.pointOrWave === 1) {
      return this.metricFindQueryPoint(options);
    } else {
      return this.metricFindQueryWave(options);
    }
  }
  metricFindQueryPoint(options) {
    var fieldsName;
    var queryValue;
    var limitCount;
    var orderbyCount;
    if (options === 'jz') {
      let dc = this.templateSrv.replace('$dc');
      if (dc === '$dc') {
        //机组查询
        dc = '';
      }
      fieldsName = 'facilityF0,facilityF0Value,facilityG,facilityGValue';
      queryValue = "[('kksCode','like','%%')]";
      limitCount = 100;
      orderbyCount = "[('facilityG','ASC'),('facilityF0','ASC')]";
    } else if (options === 'dc') {
      fieldsName = 'manageA1A2,manageAN,manageANValue';
      queryValue = "[('kksCode','like','%%')]";
      limitCount = 20;
      orderbyCount = "[('manageAN','ASC')]";
    } else if (options === 'jz:$dc') {
      let dc = this.templateSrv.replace('$dc');
      fieldsName = 'facilityF0,facilityF0Value,facilityG,facilityGValue';
      queryValue = "[('kksCode','like','" + dc + "%')]";
      limitCount = 100;
      orderbyCount = "[('facilityG','ASC'),('facilityF0','ASC')]";
    } else {
      fieldsName = 'kksCode,kksName';
      queryValue = "['|',('kksCode','like','%" + options.target + "%'),('kksName','like','%" + options.target + "%')]";
      limitCount = 20;
      orderbyCount = "[('kksCode','ASC')]";
    }
    return this.backendSrv
      .datasourceRequest({
        url: this.url + '/kksInfo?method=searchKKSInfos',
        params: {
          limit: limitCount,
          offset: 1,
          fields: fieldsName,
          query: queryValue,
          orderby: orderbyCount,
        },
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(this.mapToTextValue);
  }

  mapToTextValue(result) {
    if (result.data && result.data.KKSInfos && result.data.KKSInfos.length > 0) {
      let arr = [];
      for (let i = 0; i < result.data.KKSInfos.length; i++) {
        if (result.data.KKSInfos[i].facilityF0) {
          //机组
          let textVal = result.data.KKSInfos[i].facilityF0Value;
          let valVal = result.data.KKSInfos[i].facilityG + '' + result.data.KKSInfos[i].facilityF0;
          if (result.data.KKSInfos[i].facilityF0 == 0 && valVal == 'A0') continue;
          let jzObj = { text: textVal, value: valVal };
          arr.push(jzObj);
        } else if (result.data.KKSInfos[i].manageAN) {
          //电厂
          let dcObj = {
            text: result.data.KKSInfos[i].manageANValue,
            value: result.data.KKSInfos[i].manageA1A2 + result.data.KKSInfos[i].manageAN,
          };
          arr.push(dcObj);
        } else {
          let kksStr;
          if (result.data.KKSInfos[i].kksName && result.data.KKSInfos[i].kksName !== '') {
            //如果有名字返回
            kksStr = result.data.KKSInfos[i].kksCode + '_' + result.data.KKSInfos[i].kksName;
          } else {
            kksStr = result.data.KKSInfos[i].kksCode;
          }
          arr.push(kksStr);
        }
      }
      result.data.KKSInfos = arr;
    }
    //Templating
    if (result.data.KKSInfos && result.data.KKSInfos.length > 0 && typeof result.data.KKSInfos[0] === 'object') {
      return result.data.KKSInfos;
    }
    //kks标签
    return _.map(result.data.KKSInfos, (d, i) => {
      return { text: d, value: i };
    });
  }

  metricFindQueryWave(options) {
    if (options === "jz") {
      var dc = this.templateSrv.replace("$dc");
      if (dc === "$dc") { //机组查询
        dc = "";
      }
      options = {
        target: dc,
        dataType: -2,
      };
    } else if (options === "dc") {
      options = {
        target: "",
        dataType: -1,
      };
    }

    return this.getLoginStatus().then((data) => {

      var options1 = {
        url: this.buildRequestUrl('/search'),
        data: options,
        method: 'POST',
        headers: {}
      };
      options1.headers['Content-Type'] = 'application/json;charset=UTF-8';

      return this.request(options1).then(this.mapToTextValueWave);
    });
  }

  mapToTextValueWave(result) {
    if (result.data && result.data.length > 0 && typeof (result.data[0]) === "object") {
      return result.data;
    } else
      return _.map(result.data, (d, i) => {
        return {
          text: d,
          value: i
        };
      });
  }

  getLoginStatus() {
    let deferred = this.$q.defer();
    deferred.resolve(true);
    return deferred.promise;
  }

  buildRequestUrl(relativePath) {
      return this.url + "/wave" + relativePath;
  }

  request(rawOptions) {
    if (!rawOptions.headers) {
      rawOptions.headers = {};
      rawOptions.headers['Accept'] = 'application/json;charset=UTF-8';
      rawOptions.headers['Content-Type'] = undefined;
    }
    return this.backendSrv.datasourceRequest(rawOptions)
  }

  buildQueryParameters(options) {
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== '输入kks搜索条件';
    });
    var targets;
    var kdm = options.kdm;
    if (!kdm) {
      kdm = options.targets.length > 0 ? options.targets[0].kdm : {};
    }
    if (kdm.pointOrWave && kdm.pointOrWave === 1) {
      var targetsArr = [];
      for (let i = 0; i < options.targets.length; i++) {
        if (!options.targets[i].hide) {
          options.targets[i].targetCode = this.templateSrv.replace(options.targets[i].target, options.scopedVars);
          if (options.targets[i].targetCode && options.targets[i].targetCode.indexOf('_') > 0) {
            let queryTargetArr = options.targets[i].targetCode.split('_');
            options.targets[i].targetCode = queryTargetArr[0];
            options.targets[i].targetName = queryTargetArr[1];
          }
          targetsArr.push({
            target: options.targets[i].target,
            targetCode: options.targets[i].targetCode,
            targetName: options.targets[i].targetName ? options.targets[i].targetName : options.targets[i].target,
            refId: options.targets[i].refId,
          });
        }
      }
      targets = targetsArr;
    } else {
      targets = _.map(options.targets, target => {
        return {
          target: this.templateSrv.replace(target.target),
          refId: target.refId,
          dataSource: target.dataSource, //数据来源
          jsonType: target.jsonType, //数据来源细类
          dataType: target.dataType, //取数方式：实时、历史
        };
      });
    }
    options.targets = targets;
    options.kdm = kdm;
    return options;
  }
}
