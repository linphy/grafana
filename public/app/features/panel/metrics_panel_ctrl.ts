import config from 'app/core/config';
import $ from 'jquery';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import { PanelCtrl } from 'app/features/panel/panel_ctrl';

import * as rangeUtil from 'app/core/utils/rangeutil';
import * as dateMath from 'app/core/utils/datemath';

import { metricsTabDirective } from './metrics_tab';
var targetPointObject = {};
class MetricsPanelCtrl extends PanelCtrl {
  scope: any;
  loading: boolean;
  datasource: any;
  datasourceName: any;
  $q: any;
  $timeout: any;
  datasourceSrv: any;
  timeSrv: any;
  templateSrv: any;
  timing: any;
  range: any;
  interval: any;
  intervalMs: any;
  resolution: any;
  timeInfo: any;
  skipDataOnInit: boolean;
  dataStream: any;
  dataSubscription: any;
  dataList: any;
  nextRefId: string;
  metricsOptionSettings = {
    showPrecision: false,
  }; //[OGE]

  constructor($scope, $injector, metricsOptionSettings?) {
    super($scope, $injector);

    this.metricsOptionSettings = _.extend(this.metricsOptionSettings, metricsOptionSettings); //[OGE]
    // make metrics tab the default
    this.editorTabIndex = 1;
    this.$q = $injector.get('$q');
    this.datasourceSrv = $injector.get('datasourceSrv');
    this.timeSrv = $injector.get('timeSrv');
    this.templateSrv = $injector.get('templateSrv');
    this.scope = $scope;
    this.panel.datasource = this.panel.datasource || null;

    if (!this.panel.targets) {
      this.panel.targets = [{}];
    }
    //[OGE]
    if (!this.panel.metricsOptionsAll) {
      this.panel.metricsOptionsAll = [];
    }
    //END
    this.events.on('refresh', this.onMetricsPanelRefresh.bind(this));
    this.events.on('init-edit-mode', this.onInitMetricsPanelEditMode.bind(this));
    this.events.on('panel-teardown', this.onPanelTearDown.bind(this));
  }

  private onPanelTearDown() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = null;
    }
  }

  private onInitMetricsPanelEditMode() {
    this.addEditorTab('Metrics', metricsTabDirective);
    this.addEditorTab('Time range', 'public/app/features/panel/partials/panelTime.html');
    this.addEditorTab('Metrics Options', 'public/app/partials/metrics-options.html'); //[OGE]
  }

  private onMetricsPanelRefresh() {
    // ignore fetching data if another panel is in fullscreen
    if (this.otherPanelInFullscreenMode()) {
      return;
    }

    // if we have snapshot data use that
    if (this.panel.snapshotData) {
      this.updateTimeRange();
      var data = this.panel.snapshotData;
      // backward compatability
      if (!_.isArray(data)) {
        data = data.data;
      }

      this.events.emit('data-snapshot-load', data);
      return;
    }

    // // ignore if we have data stream
    if (this.dataStream) {
      return;
    }

    // clear loading/error state
    delete this.error;
    this.loading = true;
    // load datasource service
    this.setTimeQueryStart();
    this.datasourceSrv
      .get(this.panel.datasource)
      .then(this.updateTimeRange.bind(this))
      .then(this.issueQueries.bind(this))
      .then(this.handleQueryResult.bind(this))
      .catch(err => {
        // if cancelled  keep loading set to true
        if (err.cancelled) {
          console.log('Panel request cancelled', err);
          return;
        }

        this.loading = false;
        this.error = err.message || 'Request Error';
        this.inspector = { error: err };

        if (err.data) {
          if (err.data.message) {
            this.error = err.data.message;
          }
          if (err.data.error) {
            this.error = err.data.error;
          }
        }

        this.events.emit('data-error', err);
        console.log('Panel data error:', err);
      });
  }

  setTimeQueryStart() {
    this.timing.queryStart = new Date().getTime();
  }

  setTimeQueryEnd() {
    this.timing.queryEnd = new Date().getTime();
  }

  updateTimeRange(datasource?) {
    this.datasource = datasource || this.datasource;
    this.range = this.timeSrv.timeRange();

    this.applyPanelTimeOverrides();

    if (this.panel.maxDataPoints) {
      this.resolution = this.panel.maxDataPoints;
    } else {
      this.resolution = Math.ceil($(window).width() * (this.panel.span / 12));
    }

    this.calculateInterval();

    return this.datasource;
  }

  calculateInterval() {
    var intervalOverride = this.panel.interval;

    // if no panel interval check datasource
    if (intervalOverride) {
      intervalOverride = this.templateSrv.replace(intervalOverride, this.panel.scopedVars);
    } else if (this.datasource && this.datasource.interval) {
      intervalOverride = this.datasource.interval;
    }

    var res = kbn.calculateInterval(this.range, this.resolution, intervalOverride);
    this.interval = res.interval;
    this.intervalMs = res.intervalMs;
  }

  applyPanelTimeOverrides() {
    this.timeInfo = '';

    // check panel time overrrides
    if (this.panel.timeFrom) {
      var timeFromInterpolated = this.templateSrv.replace(this.panel.timeFrom, this.panel.scopedVars);
      var timeFromInfo = rangeUtil.describeTextRange(timeFromInterpolated);
      if (timeFromInfo.invalid) {
        this.timeInfo = 'invalid time override';
        return;
      }

      if (_.isString(this.range.raw.from)) {
        var timeFromDate = dateMath.parse(timeFromInfo.from);
        this.timeInfo = timeFromInfo.display;
        this.range.from = timeFromDate;
        this.range.to = dateMath.parse(timeFromInfo.to);
        this.range.raw.from = timeFromInfo.from;
        this.range.raw.to = timeFromInfo.to;
      }
    }

    if (this.panel.timeShift) {
      var timeShiftInterpolated = this.templateSrv.replace(this.panel.timeShift, this.panel.scopedVars);
      var timeShiftInfo = rangeUtil.describeTextRange(timeShiftInterpolated);
      if (timeShiftInfo.invalid) {
        this.timeInfo = 'invalid timeshift';
        return;
      }

      var timeShift = '-' + timeShiftInterpolated;
      this.timeInfo += ' timeshift ' + timeShift;
      this.range.from = dateMath.parseDateMath(timeShift, this.range.from, false);
      this.range.to = dateMath.parseDateMath(timeShift, this.range.to, true);
      this.range.raw = { from: this.range.from, to: this.range.to };
    }

    if (this.panel.hideTimeOverride) {
      this.timeInfo = '';
    }
  }

  issueQueries(datasource) {
    this.datasource = datasource;

    if (!this.panel.targets || this.panel.targets.length === 0) {
      return this.$q.when([]);
    }

    // make shallow copy of scoped vars,
    // and add built in variables interval and interval_ms
    var scopedVars = Object.assign({}, this.panel.scopedVars, {
      __interval: { text: this.interval, value: this.interval },
      __interval_ms: { text: this.intervalMs, value: this.intervalMs },
    });

    var metricsQuery = {
      timezone: this.dashboard.getTimezone(),
      panelId: this.panel.id,
      range: this.range,
      rangeRaw: this.range.raw,
      interval: this.interval,
      intervalMs: this.intervalMs,
      targets: this.panel.targets,
      format: this.panel.renderer === 'png' ? 'png' : 'json',
      maxDataPoints: this.resolution,
      scopedVars: scopedVars,
      kdm: this.panel.kdm, //[OGE]
      cacheTimeout: this.panel.cacheTimeout,
    };

    return datasource.query(metricsQuery);
  }

  handleQueryResult(result) {
    this.setTimeQueryEnd();
    this.loading = false;

    // check for if data source returns subject
    if (result && result.subscribe) {
      this.handleDataStream(result);
      return;
    }

    if (this.dashboard.snapshot) {
      this.panel.snapshotData = result.data;
    }

    if (!result || !result.data) {
      console.log('Data source query result invalid, missing data field:', result);
      result = { data: [] };
    }
    for (let i = 0; i < this.panel.metricsOptionsAll.length; i++) {
      let targetOneName = this.panel.metricsOptionsAll[i].metricsOptionLists.targetOne;
      if (this.panel.metricsOptionsAll[i].kindOf == '运算' && targetOneName.indexOf('dataSourIndex') >= 0) {
        let ind = targetOneName.split('_')[1].trim();
        this.panel.metricsOptionsAll[i].metricsOptionLists.targetOne =
          result.data[ind] && result.data[ind].target ? result.data[ind].target : targetOneName;
        for (let j = 0; j < this.panel.metricsOptionsAll[i].metricsOptionLists.sign.length; j++) {
          let targetTwoName = this.panel.metricsOptionsAll[i].metricsOptionLists.sign[j].targetTwo;
          if (targetTwoName.indexOf('dataSourIndex') >= 0) {
            let indT = targetTwoName.split('_')[1].trim();
            this.panel.metricsOptionsAll[i].metricsOptionLists.sign[j].targetTwo =
              result.data[indT] && result.data[indT].target ? result.data[indT].target : targetTwoName;
          }
        }
      }
    }

    //[OGE]metrics options 添加‘运算’选项，targetOrigin为option项
    this.panel.targetOrigin = [];
    this.panel.targetName = [];
    // this.panel.targetNameOrigin = []; //添加数据数组---df
    if (this.panel.targetNameOrigin) {
      delete this.panel.targetNameOrigin;
    }
    targetPointObject = {};
    for (let i = 0; i < result.data.length; i++) {
      if (result.data[i] && result.data[i].target) {
        this.panel.targetOrigin.push({ text: '', value: '' });
        this.panel.targetOrigin[i].text = this.panel.targetOrigin[i].value = result.data[i].target;
        // 将数据点集合转化为字符串
        // this.panel.targetOrigin[i].value = result.data[i].target; //取下标，方便取数 ---df
        // this.panel.targetNameOrigin.push(result.data[i].datapoints); //所有数据 ---df
        this.panel.targetName.push(result.data[i].target);
        targetPointObject[result.data[i].target] = result.data[i].datapoints;
      }
    }
    if (this.panel.metricsOptionsAll.length > 0) {
      this.processMetricsOptions(result.data);
    }
    //结束
    this.events.emit('data-received', result.data);
  }
  //[OGE]
  //同一时间的数据进行计算 start
  intersect(arr) {
    if (arr[0] && arr.length > 1) {
      var num = arr.length; //获取数据总条数
      var data_all = []; //声明一个空数组 来存储数据交集
      for (var m = 0; m < arr[0].length; m++) {
        var data = [];
        //获取第一条数据里面的时间
        var m1_time = arr[0][m][1];
        data.push(arr[0][m][1]);
        data.push(arr[0][m][0]);
        //循环从第二条开始
        for (var a = 1; a < num; a++) {
          for (var i = 0; i < arr[a].length; i++) {
            if (m1_time === arr[a][i][1]) {
              //符合条件将数据存在数组
              data.push(arr[a][i][0]);
              break;
            }
          }
        }
        if (data.length === num + 1) {
          //将获取到的交集放在大数组中，
          data_all.push(data);
        }
      }
      if (data_all !== []) {
        return data_all;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  //修改结束end
  //取值方式
  getOneAndTwoVal(val) {
    var oneNumVal = val;
    if (targetPointObject[val]) {
      oneNumVal = targetPointObject[val];
    }
    return oneNumVal;
  }
  processMetricsOptions(resultData) {
    for (let n = 0; n < this.panel.metricsOptionsAll.length; n++) {
      if (this.panel.metricsOptionsAll[n].target) {
        let md;
        for (let j = 0; j < resultData.length; j++) {
          if (this.panel.metricsOptionsAll[n].target === this.panel.targetName[j]) {
            md = resultData[j];
          }
        }
        if (md) {
          if (this.panel.metricsOptionsAll[n].kindOf === '公式') {
            //循环所有数据源选项
            // for (let j = 0; j < resultData.length; j++) {
            let opts = this.panel.metricsOptionsAll[n].metricsOptions;
            if (!opts) {
              continue;
            }
            if (opts.alisa) {
              md.target = opts.alisa;
            }
            opts.target = md.target;
            //opts.index = j;
            if (_.isEmpty(md.datapoints)) {
              continue;
            }
            let needMathMultiply = _.isNumber(opts.math_multiply) && opts.math_multiply !== 1;
            let needMathAdd = _.isNumber(opts.math_add) && opts.math_multiply !== 0;
            if (!needMathMultiply && !needMathAdd && !_.isInteger(opts.precision)) {
              continue;
            }

            for (let i = 0; i < md.datapoints.length; i++) {
              let mdp = md.datapoints[i];
              if (!_.isNumber(mdp[0])) {
                continue;
              }

              if (needMathMultiply) {
                mdp[0] = mdp[0] * opts.math_multiply;
              }

              if (needMathAdd) {
                mdp[0] = mdp[0] + opts.math_add;
              }

              if (_.isInteger(opts.precision)) {
                mdp[0] = _.round(mdp[0], opts.precision);
              }
            }
            //}
          } else {
            //当kindOf为运算时
            let indOne = this.panel.metricsOptionsAll[n].metricsOptionLists.targetOne;
            let valOne = this.getOneAndTwoVal(indOne);
            if (_.isEmpty(valOne) || _.isNaN(valOne)) {
              continue;
            }
            //新代码开始
            var meet = []; //交集初始数组声明
            var valOne_is_array = Array.prototype.isPrototypeOf(valOne);
            //判断valone是否是一个二维数组
            if (valOne_is_array) {
              meet.push(valOne);
            }
            for (var i = 0; i < this.panel.metricsOptionsAll[n].metricsOptionLists.sign.length; i++) {
              let indTwo = this.panel.metricsOptionsAll[n].metricsOptionLists.sign[i].targetTwo;
              var v_TwoT = this.getOneAndTwoVal(indTwo); //第二个选项的数据 ---df
              var Two_is_array = Array.prototype.isPrototypeOf(v_TwoT[0]);
              if (Two_is_array) {
                meet.push(v_TwoT); //valTwoT是二维数组
              }
            }
            if (meet.length >= 2) {
              md.datapoints = [];
              var get_meet = this.intersect(meet); //将meet生成一交集的二维数组
              if (get_meet) {
                for (var mi = 0; mi < get_meet.length; mi++) {
                  var map_data = get_meet[mi];
                  var _numbers = 1;
                  var result_middle = []; //将结果变为数组
                  result_middle[1] = map_data[0]; //结果的第一位改为时间
                  if (valOne_is_array) {
                    mdp_One = map_data[_numbers];
                    _numbers++;
                  } else {
                    mdp_One = valOne;
                  }
                  for (var i_one = 0; i_one < this.panel.metricsOptionsAll[n].metricsOptionLists.sign.length; i_one++) {
                    let i_Two = this.panel.metricsOptionsAll[n].metricsOptionLists.sign[i_one].targetTwo;
                    var val_Two = this.panel.metricsOptionsAll[n].metricsOptionLists.sign[i_one];
                    var val_TwoT = this.getOneAndTwoVal(i_Two);
                    var valTwoT_is_array = Array.prototype.isPrototypeOf(val_TwoT);
                    var mdp_One;
                    var mdp_Two;
                    if (valTwoT_is_array) {
                      mdp_Two = map_data[_numbers];
                      _numbers++;
                    } else {
                      mdp_Two = parseInt(val_TwoT); //str转num
                    }
                    switch (val_Two.sign) {
                      case '+':
                        if (i_one === 0) {
                          result_middle[0] = mdp_One + mdp_Two;
                        } else {
                          result_middle[0] += mdp_Two;
                        }
                        break;
                      case '-':
                        if (i_one === 0) {
                          result_middle[0] = mdp_One - mdp_Two;
                        } else {
                          result_middle[0] = result_middle[0] - mdp_Two;
                        }
                        break;
                      case '*':
                        if (i_one === 0) {
                          result_middle[0] = mdp_One * mdp_Two;
                        } else {
                          result_middle[0] = result_middle[0] * mdp_Two;
                        }
                        break;
                      default:
                        if (i_one === 0) {
                          result_middle[0] = mdp_One / mdp_Two;
                        } else {
                          result_middle[0] = result_middle[0] / mdp_Two;
                        }
                        break;
                    }
                  }
                  md.datapoints.push(result_middle);
                }
              }
              continue;
            }
            //新代码结束
            for (let i = 0; i < this.panel.metricsOptionsAll[n].metricsOptionLists.sign.length; i++) {
              //----用于交集下表数据获取
              let indTwo = this.panel.metricsOptionsAll[n].metricsOptionLists.sign[i].targetTwo;
              let valTwo = this.panel.metricsOptionsAll[n].metricsOptionLists.sign[i];
              let valTwoT = this.getOneAndTwoVal(indTwo);
              if (_.isEmpty(md.datapoints) && (_.isEmpty(valTwoT) || _.isNaN(valTwoT))) {
                continue;
              }
              let TheCountTargetOneBool = Array.prototype.isPrototypeOf(valOne);
              let TheCountTargetTwoBool = Array.prototype.isPrototypeOf(valTwoT);
              let TheCountTargetOne = parseFloat(valOne);
              let TheCountTargetTwo = parseFloat(valTwoT);
              for (let m = 0; m < md.datapoints.length; m++) {
                let mdp = md.datapoints[m];
                if (!TheCountTargetOneBool && !TheCountTargetTwoBool) {
                  switch (valTwo.sign) {
                    case '+':
                      if (i === 0) {
                        mdp[0] = TheCountTargetOne + TheCountTargetTwo;
                      } else {
                        mdp[0] += TheCountTargetTwo;
                      }
                      break;
                    case '-':
                      if (i === 0) {
                        mdp[0] = TheCountTargetOne - TheCountTargetTwo;
                      } else {
                        mdp[0] = mdp[0] - TheCountTargetTwo;
                      }
                      break;
                    case '*':
                      if (i === 0) {
                        mdp[0] = TheCountTargetOne * TheCountTargetTwo;
                      } else {
                        mdp[0] = mdp[0] * TheCountTargetTwo;
                      }
                      break;
                    default:
                      if (i === 0) {
                        mdp[0] = TheCountTargetOne / TheCountTargetTwo;
                      } else {
                        mdp[0] = mdp[0] / TheCountTargetTwo;
                      }
                      break;
                  }
                } else if (!TheCountTargetOneBool) {
                  let mdpTwo = valTwoT[m];
                  switch (valTwo.sign) {
                    case '+':
                      if (i === 0) {
                        mdp[0] = TheCountTargetOne + mdpTwo[0];
                      } else {
                        mdp[0] += mdpTwo[0];
                      }
                      break;
                    case '-':
                      if (i === 0) {
                        mdp[0] = TheCountTargetOne - mdpTwo[0];
                      } else {
                        mdp[0] = mdp[0] - mdpTwo[0];
                      }
                      break;
                    case '*':
                      if (i === 0) {
                        mdp[0] = TheCountTargetOne * mdpTwo[0];
                      } else {
                        mdp[0] = mdp[0] * mdpTwo[0];
                      }
                      break;
                    default:
                      if (i === 0) {
                        mdp[0] = TheCountTargetOne / mdpTwo[0];
                      } else {
                        mdp[0] = mdp[0] / mdpTwo[0];
                      }
                      break;
                  }
                } else if (!TheCountTargetTwoBool) {
                  let mdpOne = valOne[m];
                  switch (valTwo.sign) {
                    case '+':
                      if (i === 0) {
                        mdp[0] = mdpOne[0] + TheCountTargetTwo;
                      } else {
                        mdp[0] += TheCountTargetTwo;
                      }
                      break;
                    case '-':
                      if (i === 0) {
                        mdp[0] = mdpOne[0] - TheCountTargetTwo;
                      } else {
                        mdp[0] = mdp[0] - TheCountTargetTwo;
                      }
                      break;
                    case '*':
                      if (i === 0) {
                        mdp[0] = mdpOne[0] * TheCountTargetTwo;
                      } else {
                        mdp[0] = mdp[0] * TheCountTargetTwo;
                      }
                      break;
                    default:
                      if (i === 0) {
                        mdp[0] = mdpOne[0] / TheCountTargetTwo;
                      } else {
                        mdp[0] = mdp[0] / TheCountTargetTwo;
                      }
                      break;
                  }
                }
              }
            }
          }
        }
      } else {
        alert('请选择要计算的值');
      }
    }
  }
  // 把二维数组转化为字符串
  getString(objarr) {
    var typeNO = objarr.length;
    var tree = '[';
    for (var i = 0; i < typeNO; i++) {
      tree += '[';
      tree += objarr[i][0] + ',';
      tree += objarr[i][1];
      tree += ']';
      if (i < typeNO - 1) {
        tree += ',';
      }
    }
    tree += ']';
    return tree;
  }
  getMetricName(kks_name) {
    if (!kks_name) {
      return kks_name;
    }
    let idx = kks_name.lastIndexOf('_');
    return idx === -1 ? kks_name : kks_name.substring(idx + 1);
  }
  //结束
  handleDataStream(stream) {
    // if we already have a connection
    if (this.dataStream) {
      console.log('two stream observables!');
      return;
    }

    this.dataStream = stream;
    this.dataSubscription = stream.subscribe({
      next: data => {
        console.log('dataSubject next!');
        if (data.range) {
          this.range = data.range;
        }
        this.events.emit('data-received', data.data);
      },
      error: error => {
        this.events.emit('data-error', error);
        console.log('panel: observer got error');
      },
      complete: () => {
        console.log('panel: observer got complete');
        this.dataStream = null;
      },
    });
  }

  setDatasource(datasource) {
    // switching to mixed
    if (datasource.meta.mixed) {
      _.each(this.panel.targets, target => {
        target.datasource = this.panel.datasource;
        if (!target.datasource) {
          target.datasource = config.defaultDatasource;
        }
      });
    } else if (this.datasource && this.datasource.meta.mixed) {
      _.each(this.panel.targets, target => {
        delete target.datasource;
      });
    }

    this.panel.datasource = datasource.value;
    this.datasourceName = datasource.name;
    this.datasource = null;
    this.refresh();
  }

  addQuery(target) {
    target.refId = this.dashboard.getNextQueryLetter(this.panel);

    this.panel.targets.push(target);
    this.nextRefId = this.dashboard.getNextQueryLetter(this.panel);
  }

  removeQuery(target) {
    var index = _.indexOf(this.panel.targets, target);
    this.panel.targets.splice(index, 1);
    this.nextRefId = this.dashboard.getNextQueryLetter(this.panel);
    this.refresh();
  }

  moveQuery(target, direction) {
    var index = _.indexOf(this.panel.targets, target);
    _.move(this.panel.targets, index, index + direction);
  }
  //[OGE]
  addOneCount(item) {
    item.sign.push({ sign: '', targetTwo: '1' });
  }
  removeOneCount(item) {
    var index = item.sign.length - 1;
    item.sign.splice(index, 1);
  }
  addOneRow() {
    this.panel.metricsOptionsAll.push({
      target: null,
      kindOf: '运算',
      metricsOptions: {
        alisa: '',
        math_add: 0,
        math_multiply: 1,
      },
      metricsOptionLists: {
        targetOne: '1',
        sign: [],
      },
    });
  }
  removeOneRow(index) {
    this.panel.metricsOptionsAll.splice(index, 1);
  }
  //结束
}

export { MetricsPanelCtrl };
