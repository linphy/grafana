'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'vendor/echarts/echarts.min.js', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, echarts, $, _createClass, panelDefaults, EchartsCtrl;

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
		}, function (_moment) {
			moment = _moment.default;
		}, function (_lodash) {
			_ = _lodash.default;
		}, function (_appCoreTime_series) {
			TimeSeries = _appCoreTime_series.default;
		}, function (_cssClockPanelCss) {}, function (_vendorEchartsEchartsMinJs) {
			echarts = _vendorEchartsEchartsMinJs.default;
		}, function (_jquery) {
			$ = _jquery.default;
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
				unit: 'unit',
				limit: '0,200',
				alarmColor: '10,20,30'
			};

			_export('EchartsCtrl', EchartsCtrl = function (_MetricsPanelCtrl) {
				_inherits(EchartsCtrl, _MetricsPanelCtrl);

				function EchartsCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, EchartsCtrl);

					var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_.defaults(_this.panel, panelDefaults);
					var mode, limits, values;
					var alarm = new Array();
					var unitOption = '';
					var limitOption = '0,0';
					var alarmColorOption = '0,0,0';
					_this.panel.alarmColorOption = alarmColorOption;
					_this.panel.limitOption = limitOption;
					_this.panel.unitOption = unitOption;
					_this.panel.mode = mode;
					_this.panel.limits = limits;
					_this.panel.values = values;
					_this.panel.alarm = alarm;
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(EchartsCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/gauge-graphs/editor.html', 2);
					}
				}, {
					key: 'doJudgment',
					value: function doJudgment() {
						//判断数据源	  
						if (this.dataList.kpi == undefined) {
							this.panel.mode = 'Conventional';
						} else {
							this.panel.mode = 'json';
						}
						console.info(this.panel.mode);
					}
				}, {
					key: 'getLimit',
					value: function getLimit() {
						var num = this.panel.limit;
						var newNum = num.split(",");
						this.panel.limits = [parseFloat(newNum[0]), parseFloat(newNum[1])];
					}
				}, {
					key: 'getValue',
					value: function getValue() {
						if (this.panel.mode == 'json') {
							var num = this.dataList.kpi.value;
							this.panel.values = num.toFixed(2);
						} else if (this.panel.mode == 'Conventional') {
							var num = this.dataList[0].datapoints[0][0];
							this.panel.values = num.toFixed(2);
						}
					}
				}, {
					key: 'getAlarmColor',
					value: function getAlarmColor() {
						//把alarmColor从字符串转为数组
						var str = this.panel.alarmColor.split(",");
						this.panel.alarm = [];
						for (var i = 0; i < 3; i++) {
							this.panel.alarm.push(parseFloat(str[i]));
						}
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.dataList = dataList;
						this.doJudgment();
						this.getLimit();
						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						//nothing

					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {
							ctrl.doJudgment();
							ctrl.getLimit();
							var minInput = ctrl.panel.limits[0];
							var maxInput = ctrl.panel.limits[1];
							var color = ['#00ff00', '#00aa00', '#ffff00', '#ff0003'];
							var colorInfo = new Array();
							var myObject = {
								inc: function setGauge() {
									//该函数设置了max/minIn put，赋值了lineStyle里color的colorInfo
									if (ctrl.panel.mode == 'json') {
										//当检测到json数据源时
										var alarmInfo = ctrl.dataList.alarmInfo;
										var flag = true;
										if (alarmInfo[alarmInfo.length - 1].min < alarmInfo[0].min) {
											flag = false;
										} //判断值越大越危险还是越小越危险
										minInput = alarmInfo[0].min;
										maxInput = alarmInfo[alarmInfo.length - 1].min * 1.2;
										if (!flag) {
											minInput = alarmInfo[alarmInfo.length - 1].min;
											maxInput = alarmInfo[0].min * 1.2;
										} //赋值 minInput和maxInput 结束
										var param = 0;
										var maxAndLength = maxInput - minInput;
										for (var i = 0; i < alarmInfo.length; i++) {
											if (flag) {
												param = (alarmInfo[i].max - alarmInfo[0].min) / maxAndLength;
												if (i == alarmInfo.length - 1) {
													param = 1;
												}
												colorInfo.push([param, color[i]]);
											} else {
												var index = alarmInfo.length - 1 - i;
												param = (alarmInfo[index].max - alarmInfo[3].min) / maxAndLength;
												if (i == alarmInfo.length - 1) {
													param = 1;
												}
												colorInfo.push([param, color[index]]);
											}
										}
										ctrl.panel.unit = ctrl.dataList.kpi.unit;
									} else if (ctrl.panel.mode == 'Conventional') {
										//当数据源为常规数据源时
										minInput = ctrl.panel.limits[0];
										maxInput = ctrl.panel.limits[1];
										var maxAndLength = maxInput - minInput;
										var flag = true;
										ctrl.getAlarmColor();
										if (ctrl.panel.alarm[2] - ctrl.panel.alarm[0] < 0) {
											flag = false;
										} //判断值越大越危险还是越小越危险
										if (flag && colorInfo.length == 0) {
											for (var i = 0; i < ctrl.panel.alarm.length; i++) {
												param = (ctrl.panel.alarm[i] - minInput) / maxAndLength;
												colorInfo.push([param, color[i]]);
											}
											colorInfo.push([1, '#ff0003']);
										}
										if (!flag && colorInfo.length == 0) {
											for (var i = 0; i < ctrl.panel.alarm.length; i++) {
												var index = ctrl.panel.alarm.length - 1 - i;
												var cnm = index + 1; //color数组里[3]才是红色
												param = (ctrl.panel.alarm[index] - minInput) / maxAndLength;
												colorInfo.push([param, color[cnm]]);
											}
											colorInfo.push([1, '#00ff00']);
										}
									}
									/*else {//if (ctrl.panel.mode == 'default')
         	value = 0;
         	minInput = ctrl.panel.limits[0];
         	maxInput = ctrl.panel.limits[1];
         	colorInfo = [[0.25,'#00ff00'],[0.5,'#00aa00'],[0.75,'#ffff00'],[1,'#ff0003']];
         }*/
								}
							};
							myObject.inc();
							ctrl.getValue();
							var value = ctrl.panel.values;
							var unit = ctrl.panel.unit; //unit
							var obj = elem.find('.echarts-panel');
							var myChart = echarts.init(obj[0]);
							var option = {
								series: [{
									name: '',
									min: minInput,
									max: maxInput,
									startAngle: 180,
									endAngle: 0,
									radius: '100%',
									type: 'gauge',
									length: '100%',
									axisLine: {
										lineStyle: { //仪表盘轴线颜色
											color: colorInfo
										}
									},
									axisLabel: {
										formatter: function formatter(value) {
											var values = value + "";
											if (values.indexOf('.') == -1) {
												//没有小数点
												return value;
											}
											var length = values.split(".")[1].length; //有小数点，看本来有几位
											if (length >= 2) {
												return value.toFixed(2);
											}
											return value;
										}
									},
									splitNumber: 8, //仪表盘刻度的分割段数
									detail: {
										formatter: '{value}',
										offsetCenter: [0, 40], // 相对表盘中心的便宜位置。x, y，单位px
										textStyle: { fontWeight: 'bolder' }
									},
									title: {
										textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
											fontWeight: 'bolder',
											fontSize: 20,
											fontStyle: 'italic',
											color: '#fff',
											shadowColor: '#fff', //默认透明
											shadowBlur: 10
										}
									},
									pointer: { // 指针
										width: 6,
										length: '75%'
									},
									data: [{ value: value, name: unit }]
								}]
							};
							myChart.setOption(option);
						});
					}
				}]);

				return EchartsCtrl;
			}(MetricsPanelCtrl));

			_export('EchartsCtrl', EchartsCtrl);

			EchartsCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=graph_ctrl.js.map
