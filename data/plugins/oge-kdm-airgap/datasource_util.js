'use strict';

System.register(['jquery', 'lodash', 'moment'], function (_export, _context) {
  "use strict";

  var $, _, moment, _createClass, DatasourceUtil;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_jquery) {
      $ = _jquery.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
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

      DatasourceUtil = function () {
        function DatasourceUtil() {
          _classCallCheck(this, DatasourceUtil);
        }

        _createClass(DatasourceUtil, null, [{
          key: 'getWaveDataByTime',
          value: function getWaveDataByTime(datasource, inputTime, dataType, kksInfo) {
            var _this = this;

            if (inputTime === "无效数据") {
              return null;
            }
            this.datasource = datasource;

            var formData = new FormData();
            formData.append("kksCodes", kksInfo.kks ? kksInfo.kks : kksInfo);
            formData.append("waveTime", inputTime);
            formData.append("waveType", dataType);
            formData.append("kdmUrl", this.datasource.kdmUrl);
            var options = {
              method: 'POST',
              data: formData
            };

            //如果连接的数据源地址为KDM Link地址
            if (this.datasource.linkUser && this.datasource.linkPassword) {
              options.url = this.datasource.url + '/rest/v1/data-points/wave/getAirgap';
            } else options.url = this.datasource.url + '/wave/getAirgap';

            var promise = new Promise(function (resolve, reject) {
              _this.datasource.getLoginStatus().then(function (data) {

                _this.datasource.request(options).then(function (body) {
                  if (body.data) body.data.kksInfo = kksInfo;
                  resolve(body.data);
                }, function (error) {
                  _this.datasource.relogin(error, options).then(function (body) {
                    if (body.data) body.data.kksInfo = kksInfo;
                    resolve(body.data);
                  }, function (error) {
                    return reject(error);
                  });
                });
              });
            });
            return promise;
          }
        }, {
          key: 'getFormatter',
          value: function getFormatter(num, unit) {
            return function (value, index) {
              if (value == undefined) {
                return "";
              }
              if (value == 0 || value == parseInt(value)) {
                return value;
              }
              if (unit == null) {
                unit = "";
              }
              if (num == 0) {
                return parseInt(value) + unit;
              }
              return value.toFixed(num) + unit;
            };
          }
        }, {
          key: 'getXAxis',
          value: function getXAxis(xAxisData, isShowLabel, dataType) {
            if (dataType == 1) {
              //棒图
              for (var i = 0; i < xAxisData.length; i++) {
                xAxisData[i] = i + 1 + "#";
              }
            }

            var xAxis = {
              data: xAxisData,
              name: "时间",
              axisLabel: {
                show: false
              }
            };

            if (isShowLabel) {
              xAxis.axisLabel.show = true;
              if (dataType == 0) {
                xAxis.axisLabel.formatter = DatasourceUtil.getFormatter(2, "s");
              }
            }

            return xAxis;
          }
        }, {
          key: 'getChartDefaults',
          value: function getChartDefaults(kksNameArr, isShowDatazoom) {
            return {
              title: {
                text: '气隙',
                show: false
              },
              grid: {
                left: 40,
                top: 5,
                bottom: 30,
                right: 8
              },
              tooltip: {
                trigger: 'axis',
                showDelay: 0,
                axisPointer: {
                  show: true,
                  type: 'line',
                  lineStyle: {
                    type: 'dashed',
                    width: 2
                  }
                },
                zlevel: 1
              },
              legend: {
                data: kksNameArr,
                right: "0px",
                top: "0px",
                z: 3,
                orient: "horizontal",
                textStyle: {
                  color: "white" //图例字体颜色
                }
              },
              textStyle: {
                color: "white"
              },
              dataZoom: [{
                show: isShowDatazoom,
                handleSize: '80%',
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                backgroundColor: 'transparent',
                fillerColor: 'rgba(0,0,0,0.4)',
                showDataShadow: false,
                borderColor: 'transparent',
                bottom: 0,
                handleStyle: {
                  color: 'rgba(255,255,255,0.7)',
                  shadowBlur: 3,
                  shadowColor: 'rgba(0, 0, 0, 0.6)',
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                }
              }]
            };
          }
        }, {
          key: 'getKeyPhaseSeries',
          value: function getKeyPhaseSeries(data) {
            var keyPhaseOffsetData = [];
            var keyPhaseOffsetIndex = data.keyPhaseOffsetIndex;
            for (var i = 0; i < keyPhaseOffsetIndex.length; i++) {
              keyPhaseOffsetData.push([keyPhaseOffsetIndex[i], data.y[keyPhaseOffsetIndex[i]]]);
            }
            var series = {
              name: '键相',
              symbol: "circle", //键相显示方式,
              data: keyPhaseOffsetData,
              type: 'scatter',
              symbolSize: 5,
              itemStyle: {
                normal: {
                  color: "white"
                } //键相全部显示白色
              } };
            return series;
          }
        }]);

        return DatasourceUtil;
      }();

      _export('default', DatasourceUtil);
    }
  };
});
//# sourceMappingURL=datasource_util.js.map
