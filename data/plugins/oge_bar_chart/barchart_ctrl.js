'use strict';

System.register(['app/plugins/sdk', 'lodash', 'vendor/echarts/echarts.min.js'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, echarts, _createClass, panelDefaults, storeData, BarChartPanelCtrl;

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
			MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
		}, function (_lodash) {
			_ = _lodash.default;
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
				dataPrecise: 2,
				dataMonthOrDay: 'month',
				barChartTitle: '',
				statvalues: 'current',
				showChartData: true,
				barChartValueColor: 'white'
			};
			storeData = [];

			_export('BarChartPanelCtrl', BarChartPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(BarChartPanelCtrl, _MetricsPanelCtrl);

				/** @ngInject */
				function BarChartPanelCtrl($scope, $injector) {
					_classCallCheck(this, BarChartPanelCtrl);

					var _this = _possibleConstructorReturn(this, (BarChartPanelCtrl.__proto__ || Object.getPrototypeOf(BarChartPanelCtrl)).call(this, $scope, $injector));

					_.defaults(_this.panel, panelDefaults);

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('render', _this.onRender.bind(_this));
					_this.valueShowStatOptions = [{ text: 'Avg', value: 'avg' }, { text: 'Min', value: 'min' }, { text: 'Max', value: 'max' }, { text: 'Total', value: 'total' }, { text: 'Count', value: 'count' }, { text: 'Current', value: 'current' }];
					_this.valueShowMonthOrDayOptions = [{ text: '年', value: 'year' }, { text: '月', value: 'month' }, { text: '日', value: 'day' }];
					return _this;
				}

				_createClass(BarChartPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_bar_chart/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						if (!(dataList && dataList.length > 0 && dataList[0].target && dataList[0].datapoints && dataList[0].datapoints.length > 0)) {
							console.error("no data found wave");
							return;
						}
						storeData = dataList;
						this.splitData();
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'splitData',
					value: function splitData() {
						var data = {
							xAxisData: [],
							series: [],
							legend: []
						};
						for (var j = 0; j < storeData.length; j++) {
							data.legend.push(storeData[j].target);
							if (!_.isArray(storeData[j].datapoints[0])) {
								return;
							}
							var oneListData = {};
							for (var i = 0; i < storeData[j].datapoints.length; i++) {
								var year = new Date(storeData[j].datapoints[i][1]).getFullYear();
								var month = new Date(storeData[j].datapoints[i][1]).getMonth() + 1;
								var day = new Date(storeData[j].datapoints[i][1]).getDate();
								switch (this.panel.dataMonthOrDay) {
									case "year":
										if (oneListData[year]) {
											oneListData[year].push(storeData[j].datapoints[i][0]);
										} else {
											oneListData[year] = [storeData[j].datapoints[i][0]];
										}
										break;
									case "month":
										var timebool = storeData[j].datapoints[storeData[j].datapoints.length - 1][1] - storeData[j].datapoints[0][1] > 31536000000;
										var timeStr = timebool ? year + '-' + month : month + "月";
										if (oneListData[timeStr]) {
											oneListData[timeStr].push(storeData[j].datapoints[i][0]);
										} else {
											oneListData[timeStr] = [storeData[j].datapoints[i][0]];
										}
										break;
									default:
										var daytimebool = storeData[j].datapoints[storeData[j].datapoints.length - 1][1] - storeData[j].datapoints[0][1] > 31536000000;
										var daytimeStr = daytimebool ? year + '-' + month + '' + day : month + "-" + day;
										if (oneListData[daytimeStr]) {
											oneListData[daytimeStr].push(storeData[j].datapoints[i][0]);
										} else {
											oneListData[daytimeStr] = [storeData[j].datapoints[i][0]];
										}
										break;
								}
							}

							data.series[j] = {
								data: [],
								type: 'bar',
								name: storeData[j].target,
								label: {
									show: this.panel.showChartData,
									position: 'top',
									color: this.panel.barChartValueColor
								}
							};
							for (var key in oneListData) {
								var ondv = oneListData[key];
								if (data.xAxisData.indexOf(key) == -1) {
									data.xAxisData.push(key);
								}
								data.series[j].data.push(this.dealDataFormat(ondv));
							}
						}

						this.drawBarChart(data);
					}
				}, {
					key: 'dealDataFormat',
					value: function dealDataFormat(ondv) {
						var totalNum = 0;
						var statMax = ondv[0];
						var statMin = ondv[0];
						var reVal = null; //返回给series的值
						for (var i = 0; i < ondv.length; i++) {
							if (ondv[i]) {
								var value = ondv[i];
								if (statMax < value) {
									statMax = value;
								}
								if (statMin > value) {
									statMin = value;
								}
								totalNum += value;
							}
						}
						switch (this.panel.statvalues) {
							case 'avg':
								reVal = parseFloat((totalNum / ondv.length).toFixed(this.panel.dataPrecise));
								break;
							case 'min':
								reVal = parseFloat(statMin.toFixed(this.panel.dataPrecise));
								break;
							case 'max':
								reVal = parseFloat(statMax.toFixed(this.panel.dataPrecise));
								break;
							case 'total':
								reVal = parseFloat(totalNum.toFixed(this.panel.dataPrecise));
								break;
							case 'count':
								reVal = parseFloat(ondv.length);
								break;
							default:
								for (var ind = ondv.length - 1; ind >= 0; ind--) {
									if (ondv[ind] !== null) {
										reVal = parseFloat(ondv[ind].toFixed(this.panel.dataPrecise));
										return reVal;
									}
								}
						}
						return reVal;
					}
				}, {
					key: 'drawBarChart',
					value: function drawBarChart(barChartData) {
						var barChartPanel = this.barChartElem.find('.barChartMain')[0];
						var myChart = echarts.init(barChartPanel);

						var option = {
							title: {
								text: this.panel.barChartTitle
							},
							grid: {
								left: 40,
								top: 10,
								bottom: 25,
								right: 10
							},
							tooltip: {},
							xAxis: {
								type: 'category',
								data: barChartData.xAxisData
							},
							yAxis: {
								type: 'value'
							},
							legend: {
								data: barChartData.legend,
								right: "0px",
								top: "0px",
								z: 3,
								orient: "horizontal",
								textStyle: {
									color: "white" //图例字体颜色
								}
							},
							series: barChartData.series,
							textStyle: {
								color: "white"
							}
						};
						myChart.setOption(option);
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.barChartElem = elem;
					}
				}]);

				return BarChartPanelCtrl;
			}(MetricsPanelCtrl));

			_export('BarChartPanelCtrl', BarChartPanelCtrl);

			BarChartPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=barchart_ctrl.js.map
