'use strict';

System.register(['app/plugins/sdk', 'angular', 'lodash', 'jquery', './css/polar-panel.css!', 'app/core/utils/kbn', 'app/core/config', 'app/core/time_series2', 'vendor/echarts/echarts.min.js'], function (_export, _context) {
  "use strict";

  var OgeAlertMetricsPanelCtrl, angular, _, $, kbn, config, TimeSeries, echarts, _createClass, panelDefaults, that, PolarCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      OgeAlertMetricsPanelCtrl = _appPluginsSdk.OgeAlertMetricsPanelCtrl;
    }, function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_cssPolarPanelCss) {}, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_vendorEchartsEchartsMinJs) {
      echarts = _vendorEchartsEchartsMinJs.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      panelDefaults = {
        theCircleNum: 2, //轨迹圆的数量
        theAlarmCirR: 0, //告警圆直径
        theDangerCirR: 0, //危险圆直径
        tiltAmountDataMax: [], //倾斜量最大值
        tiltAmountDataMin: [],
        tiltAmountDataAver: 0,
        max_index: 0,
        thelengedQXLNum: 2,
        thelengedQJNum: 2,
        northwestCount: [], //西北
        southwestCount: [], //西南
        northeastCount: [], //东北
        southeastCount: [], //东南
        thelengedText: '',
        thelengedUnit: '',
        theDirectivelengedText: '',
        theDirectivelengedUnit: '',
        datapointColor: 'white',
        showLenged: true
      };

      _export('PolarCtrl', PolarCtrl = function (_OgeAlertMetricsPanel) {
        _inherits(PolarCtrl, _OgeAlertMetricsPanel);

        function PolarCtrl($scope, $injector, backendSrv, templateSrv, timeSrv, linkSrv) {
          _classCallCheck(this, PolarCtrl);

          var _this = _possibleConstructorReturn(this, (PolarCtrl.__proto__ || Object.getPrototypeOf(PolarCtrl)).call(this, $scope, $injector, { showCover: true }));

          _.defaults(_this.panel, panelDefaults);
          _this.data = [];
          _this.newArr = []; //数据对齐
          _this.timeSrv = timeSrv;
          _this.linkSrv = linkSrv;
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          that = _this;
          return _this;
        }

        _createClass(PolarCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/oge-polar/editor.html', 2);
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.onDataReceived([]);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            this.dataTwo = "";
            var allData = [];
            if (dataList && dataList.length >= 2 && dataList[0].target && dataList[0].datapoints && dataList[0].datapoints.length > 0) {
              if (!dataList[0].target || !dataList[0].datapoints || !dataList[1].target || !dataList[1].datapoints) return;
              for (var t = 0; t < dataList.length; t++) {
                this.dataTwo += dataList[t].target + ',';
              }
              if (this.panel.thelengedUnit) {
                this.dataTwo = this.dataTwo + this.panel.thelengedUnit;
              }
              this.dataLength = dataList.length;
              // allData[0] = dataList[0].datapoints;//倾角方向
              // allData[1] = dataList[1].datapoints;//倾斜量
              this.panel.tiltAmountDataMax = this.tiltAmountMax(dataList[0].datapoints);
              this.panel.tiltAmountDataMin = this.tiltAmountMin(dataList[0].datapoints);
              this.panel.tiltAmountDataAver = this.tiltAmountAver(dataList[0].datapoints);
              this.tiltKksStart = dataList[0].datapoints[0][1]; //kks1开始时间 zy
              this.tiltKksEnd = dataList[0].datapoints[dataList[0].datapoints.length - 1][1]; //kks1结束时间 zy
              this.tiltLastValue = dataList[0].datapoints[dataList[0].datapoints.length - 1][0]; //kks1最后一条数据 zy
              this.tiltDirectiveLastValue = dataList[1].datapoints[dataList[1].datapoints.length - 1][0]; //kks1最后
              this.countDirection(dataList[1].datapoints);
              for (var i = 0; i < dataList.length; i++) {
                if (!dataList[i].target || !dataList[i].datapoints) continue;
                allData[i] = dataList[i].datapoints;
              }
              this.arrChangeObj(allData);
              if (allData[0].length > 0 && allData[1].length > 0) {
                var noData = [];
                for (var _i = 0; _i < dataList[0].datapoints.length; _i++) {
                  this.data[_i] = [];
                  for (var j = 0; j < this.dataLength; j++) {
                    if (allData[j]) {
                      if (this.newArr[j][allData[0][_i][1]] != null) {
                        this.data[_i][j] = this.newArr[j][allData[0][_i][1]];
                        noData[j] = this.newArr[j][allData[0][_i][1]];
                      } else {
                        this.data[_i][j] = noData[j]; //这里应该比较相邻的时间
                      }
                      this.data[_i][this.dataLength] = allData[0][_i][1];
                    } else {
                      this.data[_i][j] = 'undefined';
                    }
                  }
                }
              } else {
                this.data = []; //[半径,角度,散点的直径]
              }
            }
            this.drawPolar();
          }
        }, {
          key: 'arrChangeObj',
          value: function arrChangeObj(arr) {
            this.newArr = [];
            for (var j = 0; j < this.dataLength; j++) {
              this.newArr[j] = {};
              if (arr[j] && arr[j].length > 0) {
                for (var i = 0; i < arr[j].length; i++) {
                  this.newArr[j][arr[j][i][1]] = arr[j][i][0];
                }
              } else {
                for (var _i2 = 0; _i2 < arr[0].length; _i2++) {
                  this.newArr[j][arr[0][_i2][1]] = null;
                }
              }
            }
          }
        }, {
          key: 'countDirection',
          value: function countDirection(arr) {
            //方位点数统计
            this.panel.northeastCount = [];
            this.panel.southeastCount = [];
            this.panel.southwestCount = [];
            this.panel.northwestCount = [];
            for (var i = 0; i < arr.length; i++) {
              if (arr[i][0] >= 0 && arr[i][0] < 90) {
                this.panel.northeastCount.push(arr[i]);
              } else if (arr[i][0] >= 90 && arr[i][0] < 180) {
                this.panel.southeastCount.push(arr[i]);
              } else if (arr[i][0] >= 180 && arr[i][0] < 270) {
                this.panel.southwestCount.push(arr[i]);
              } else {
                this.panel.northwestCount.push(arr[i]);
              }
            }
            this.northeastPer = (this.panel.northeastCount.length / arr.length * 100).toFixed(2) + '%';
            this.southeastPer = (this.panel.southeastCount.length / arr.length * 100).toFixed(2) + '%';
            this.southwestPer = (this.panel.southwestCount.length / arr.length * 100).toFixed(2) + '%';
            this.northwestPer = (this.panel.northwestCount.length / arr.length * 100).toFixed(2) + '%';
          }
        }, {
          key: 'tiltAmountMax',
          value: function tiltAmountMax(arr) {
            //二维数组，比arr[0][0],取最大值
            var max = arr[0];
            this.panel.max_index = 0;
            for (var i = 0; i < arr.length; i++) {
              if (arr[i][0] > max[0]) {
                max = arr[i];
                this.panel.max_index = i;
              }
            }
            return max;
          }
        }, {
          key: 'tiltAmountMin',
          value: function tiltAmountMin(arr) {
            //二维数组，比arr[0][0],取最小值
            var min = arr[0];
            for (var i = 1; i < arr.length; i++) {
              var cur = arr[i];
              cur[0] < min[0] ? min = cur : null;
            }
            return min;
          }
        }, {
          key: 'tiltAmountAver',
          value: function tiltAmountAver(arr) {
            //平均值
            var all = 0;
            for (var i = 0; i < arr.length; i++) {
              all += arr[i][0];
            }
            return (all / arr.length).toFixed(4);
          }
        }, {
          key: 'drawPolar',
          value: function drawPolar() {
            that = this;
            var polarStatePanel = this.polarElem.find('.polarMain')[0];
            var myChart = echarts.init(polarStatePanel);
            var heightPolar = polarStatePanel.offsetHeight;
            var widthPolar = polarStatePanel.offsetWidth;
            var radiusAll = heightPolar > widthPolar ? widthPolar / 2 * 0.7 : heightPolar / 2 * 0.7;
            var radiusOne = 0;
            var radiusTwo = 0;
            var radiusAxisMax = this.panel.theDangerCirR > this.panel.tiltAmountDataMax[0] ? this.panel.theDangerCirR * 1.2 : this.panel.tiltAmountDataMax[0] * 1.2; //半径显示最大值
            if (this.panel.tiltAmountDataMax.length > 0 && this.panel.tiltAmountDataMin.length > 0 && (this.panel.theAlarmCirR !== 0 || this.panel.theDangerCirR !== 0)) {
              radiusOne = radiusAll / radiusAxisMax * this.panel.theAlarmCirR;
              radiusTwo = radiusAll / radiusAxisMax * this.panel.theDangerCirR;
            }

            var option = {
              // title: {
              //   text: this.panel.showLenged?'轨迹圆半径:' + radiusAxisMax.toFixed(2) +''+ that.panel.thelengedUnit:'',
              //   left:'5%',
              //   textStyle:{
              //     color:'#ccc',
              //     fontSize:16
              //   }
              // },
              radar: {
                indicator: [{ text: '北' }, { text: '西' }, { text: '南' }, { text: '东' }],
                center: ['50%', '50%'],
                startAngle: 90,
                radius: radiusAll,
                splitNumber: 4,
                shape: 'circle',
                name: {
                  formatter: '【{value}】',
                  textStyle: {
                    color: 'white',
                    fontSize: 14,
                    padding: [0, 0, 5, 0]
                  }
                },
                splitArea: {
                  areaStyle: {
                    color: 'rgba(255,255,255,0)'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0)'
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0)'
                  }
                }
              },
              polar: [{
                center: ['50%', '50%'],
                radius: radiusAll
              }, {
                center: ['50%', '50%'],
                radius: radiusOne > radiusAll ? radiusAll : radiusOne
              }],
              tooltip: {
                formatter: function formatter(params) {
                  var strArr = params.seriesName.split(",");
                  var str = '时间：' + that.formatDate(new Date(params.value[that.dataLength])) + '</br>';
                  // for(let i = 0; i <that.dataTwo.length; i ++) {
                  str += strArr[0] + ':' + params.value[0].toFixed(that.panel.thelengedQXLNum) + strArr[strArr.length - 1] + '</br>' + strArr[1] + ':' + params.value[1].toFixed(that.panel.thelengedQJNum) + '°';

                  // }
                  return str;
                }
              },
              angleAxis: [
              // {
              //   polarIndex: 2,
              //   min: 0,
              //   max: 360,
              //	 clockwise: false,
              //   interval: 90,
              //   axisLabel:{
              //       show:false
              //   },
              //   axisTick:{
              //     show: false
              //   },
              //   axisLine:{
              //     lineStyle:{
              //         color:'rgba(255, 255, 255, 0)'
              //     }
              //   },
              //   splitLine:{
              //     show:true,
              //     lineStyle:{
              //       color:'white',
              //       width:1,
              //       type:'dashed'
              //     }
              //   }
              // },
              {
                polarIndex: 1,
                min: 0,
                max: 360,
                interval: 360,
                clockwise: false,
                axisLabel: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: 'orange',
                    width: 2
                  }
                }
              }, {
                polarIndex: 0,
                min: 0,
                max: 360,
                interval: 90,
                clockwise: false,
                axisLabel: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: 'red',
                    width: 2
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: 'white',
                    width: 1,
                    type: 'dashed'
                  }
                }
              }],
              radiusAxis: [
              // {
              //   polarIndex: 0,
              //   min:0,
              //   max:radiusAxisMax,
              //   interval: radiusAxisMax/that.panel.theCircleNum,
              //   axisLabel: {
              //     show: true,
              //     padding: [0, 0, 20, 0],
              //     color: "white",
              //     fontSize: 16
              //   },
              //   axisLine:{
              //     lineStyle:{
              //         color:'red'
              //     },
              //   }
              // },
              {
                polarIndex: 1,
                min: 0,
                max: that.panel.theAlarmCirR,
                interval: radiusOne > radiusAll ? radiusAll : radiusOne,
                axisLabel: {
                  show: true,
                  padding: [0, 0, 20, 0],
                  color: "orange",
                  fontSize: 14
                },
                axisLine: {
                  show: false
                }
              }, {
                polarIndex: 0,
                min: 0,
                max: that.panel.theDangerCirR,
                interval: radiusTwo > radiusAll ? radiusAll : radiusTwo,
                axisLabel: {
                  show: true,
                  padding: [0, 0, 20, 0],
                  color: "red",
                  fontSize: 14
                },
                axisLine: {
                  show: false
                }
              }],
              series: [{
                name: '雷达图',
                type: 'radar'
              }, {
                name: this.dataTwo,
                type: 'scatter',
                polarIndex: 0,
                coordinateSystem: 'polar',
                symbolSize: 7,
                itemStyle: {
                  normal: {
                    color: this.panel.datapointColor //散点的颜色
                  }
                },
                large: true,
                largeThreshold: 1000, //限定大于1000个值自动优化
                data: this.data
              }, {
                name: this.dataTwo,
                type: 'scatter',
                polarIndex: 0,
                coordinateSystem: 'polar',
                symbolSize: 7,
                itemStyle: {
                  normal: {
                    color: 'red' //散点的颜色
                  }
                },
                data: [this.data[this.data.length - 1]]
              }]
            };
            myChart.setOption(option);
          }
        }, {
          key: 'formatDate',
          value: function formatDate(now) {
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            ctrl.polarElem = elem;
          }
        }]);

        return PolarCtrl;
      }(OgeAlertMetricsPanelCtrl));

      _export('PolarCtrl', PolarCtrl);

      PolarCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=polar-ctrl.js.map
