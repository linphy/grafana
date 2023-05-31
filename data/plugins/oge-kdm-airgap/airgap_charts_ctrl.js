'use strict';

System.register(['jquery', 'lodash', 'vendor/echarts/echarts.min.js', './datasource_util.js'], function (_export, _context) {
  "use strict";

  var $, _, echarts, DatasourceUtil, _createClass, AirgapChartsCtrl;

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
    }, function (_vendorEchartsEchartsMinJs) {
      echarts = _vendorEchartsEchartsMinJs.default;
    }, function (_datasource_utilJs) {
      DatasourceUtil = _datasource_utilJs.default;
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

      AirgapChartsCtrl = function () {
        function AirgapChartsCtrl(ctrl) {
          _classCallCheck(this, AirgapChartsCtrl);

          // ctrl
          this.ctrl = ctrl;
        }

        _createClass(AirgapChartsCtrl, [{
          key: '_render',
          value: function _render(elem) {
            var ctrl = this.ctrl;
            var obj = elem.find('.data-panel-charts').empty();
            var allHeight = (ctrl.height >= 200 ? ctrl.height : 550) - 73;
            ctrl.$timeout(function () {
              if (!ctrl.panel.isCoaxial) {
                showSplitCharts(obj, allHeight, ctrl.time); //分轴显示
              } else {
                showCoaxialCharts(obj, allHeight, ctrl.time); //同轴显示
              }
            });

            var systemColor = ["#7eb26d", "#EE0000", "#0000EE", "#EEEE00", "#8DEEEE", "#1874CD", "#00EE00", "#008B8B"];

            function getChangeData(seriesData, index) {
              if (ctrl.panel.bar.isAlignPhase && index > 0) {
                //如果点击了相位，按照+x方向排序
                var offest = (ctrl.kksList.length - index) * seriesData.length / ctrl.kksList.length;
                var oldArr = seriesData.slice(0, offest); //左边的数据（要放到后面）
                var newArr = seriesData.slice(offest, seriesData.length);
                seriesData = newArr.concat(oldArr); //数组合并
              }

              if (ctrl.panel.bar.isShowExtension) {
                var sum = 0;
                for (var i = 0; i < seriesData.length; i++) {
                  sum += seriesData[i];
                }
                var avg = sum / seriesData.length;
                for (var i = 0; i < seriesData.length; i++) {
                  seriesData[i] = seriesData[i] - avg;
                }
              }

              return seriesData;
            }

            function getTempData(data, index, kksName, dataType) {
              var yAxis = {
                min: "dataMin",
                axisLabel: {
                  formatter: DatasourceUtil.getFormatter(2, "")
                },
                splitLine: {
                  lineStyle: {
                    color: ['#444343']
                  }
                }
              };

              var seriesData = getChangeData(data.y, index);
              var series = {
                name: kksName,
                type: "line",
                data: seriesData,
                lineStyle: {
                  normal: {
                    width: 1
                  }
                },
                showSymbol: false, //不显示与X轴对应的坐标
                symbol: "circle", //对应图例的图标 + 鼠标提示的图形
                itemStyle: {
                  normal: {
                    color: systemColor[index]
                  } //对应的图例的图标颜色
                } };

              if (dataType == 1) {
                if (ctrl.panel.bar.isShowOutline) {
                  //点击了棒图里面的轮廓图
                  series.step = 'middle'; //新增的属性
                } else {
                  series.type = "bar";
                }
              }

              return [yAxis, series];
            }

            /**
             * 初始化eChart的配置
             */
            function initGraph(xArr, yArr, sArr, kksNameArr, index, parEle) {

              var myChart = echarts.init(parEle[index]);
              var option = {
                itemStyle: {
                  normal: {
                    color: systemColor[index]
                  }
                },
                xAxis: xArr,
                yAxis: yArr,
                series: sArr
              };

              var isLastChart = index == ctrl.kksList.length - 1;
              _.defaults(option, DatasourceUtil.getChartDefaults(kksNameArr, isLastChart));

              myChart.group = "index_" + index;

              if (!isLastChart) {
                option.grid.bottom = 5;
              }

              myChart.setOption(option);
              return myChart;
            }

            function showSplitCharts(obj, allHeight, dataTime) {
              allHeight = allHeight - 10; // 最下面的图表（数据筛选条 + 坐标）共占据50像素高度
              var kksList = ctrl.kksList;
              var height = allHeight / kksList.length;
              var divArr = [];

              var promises = [];
              for (var i = 0; i < kksList.length; i++) {

                if (i == kksList.length - 1) {
                  height += 10;
                }
                var div = $('<div class=\'myDiv_' + ctrl.panel.id + '_' + i + '\' style=\'height:' + height + 'px\'></div>');
                divArr.push(div[0]);
                obj.append(div);
                var promise = ctrl.getWaveDataByTime(dataTime, ctrl.panel.tabIndex, ctrl.kksList[i]);
                promises.push(promise);
              }

              Promise.all(promises).then(function (data) {

                if (_.isArray(data)) {

                  var charts = [];
                  var kksNameArr = [];

                  data.forEach(function (item, index) {

                    if (!item) return;

                    var xArr = [];
                    var yArr = [];
                    var sArr = [];
                    xArr.push(DatasourceUtil.getXAxis(item.x, index == ctrl.kksList.length - 1, ctrl.panel.tabIndex));
                    var temp = getTempData(item, index, item.kksInfo.name, ctrl.panel.tabIndex);
                    yArr.push(temp[0]);
                    sArr.push(temp[1]);

                    //气隙轮廓需要显示键相
                    if (ctrl.panel.tabIndex == 0 && item.y.length > 0) {
                      sArr.push(DatasourceUtil.getKeyPhaseSeries(item));
                      kksNameArr.push("键相");
                    }
                    var chart = initGraph(xArr, yArr, sArr, kksNameArr, index, divArr);
                    charts.push(chart);
                    index++;
                  });
                  echarts.connect(charts);
                }
              }).catch(console.error);
            };

            function showCoaxialCharts(obj, height, dataTime) {
              var div = $('<div class=\'myDiv\' style=\'height:' + height + 'px\'></div>').appendTo(obj);
              var myChart = echarts.init(div[0]);
              var kksList = ctrl.kksList;
              var kksNameArr = [];
              var sArr = [];
              var promises = [];
              var firstData = void 0;

              for (var i = 0; i < kksList.length; i++) {
                var data = ctrl.getWaveDataByTime(dataTime, ctrl.panel.tabIndex, kksList[i]);
                promises.push(data);
              }

              Promise.all(promises).then(function (data) {

                if (_.isArray(data)) {

                  data.forEach(function (item, index) {
                    if (!item) return;
                    if (index == 0) firstData = item;
                    kksNameArr.push(item.kksInfo.name);
                    var seriesData = getChangeData(item.y, index);
                    var series = {
                      name: item.kksInfo.name,
                      type: 'line',
                      data: seriesData,
                      showSymbol: false, //不显示与X轴对应的坐标
                      symbol: "circle",
                      lineStyle: {
                        normal: {
                          width: 1
                        }
                      },
                      itemStyle: {
                        normal: {
                          color: systemColor[index]
                        }
                      }
                    };

                    if (ctrl.panel.tabIndex == 1) {
                      if (ctrl.panel.bar.isShowOutline) {
                        //点击了棒图里面的轮廓图
                        series.step = 'middle'; //新增的属性
                      } else {
                        series.type = "bar";
                      }
                    }

                    sArr.push(series);
                    //原始波形，显示键相
                    if (ctrl.panel.tabIndex == 0) {
                      sArr.push(DatasourceUtil.getKeyPhaseSeries(item));
                      kksNameArr.push("键相");
                    }
                  });

                  var eoption = {
                    xAxis: DatasourceUtil.getXAxis(firstData.x, true, ctrl.panel.tabIndex),
                    yAxis: {
                      min: "dataMin",
                      axisLabel: {
                        formatter: DatasourceUtil.getFormatter(0, "")
                      },
                      splitLine: {
                        lineStyle: {
                          color: ['#444343']
                        }
                      }
                    },
                    series: sArr
                  };
                  _.defaults(eoption, DatasourceUtil.getChartDefaults(kksNameArr, true));

                  myChart.setOption(eoption);
                }
              }).catch(console.error);
            }
          }
        }]);

        return AirgapChartsCtrl;
      }();

      _export('default', AirgapChartsCtrl);
    }
  };
});
//# sourceMappingURL=airgap_charts_ctrl.js.map
