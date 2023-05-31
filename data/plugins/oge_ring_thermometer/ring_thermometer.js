'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'vendor/echarts/echarts.min.js', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, echarts, $, _createClass, panelDefaults, RingThermometerPanelCtrl;

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
				min: 0,
				max: 100,
				dataPrecise: 0,
				unit: "℃",
				colors: ["rgba(50, 172, 45, 0.97)", "rgba(237, 129, 40, 0.89)", "rgba(245, 54, 54, 0.9)"],
				threshold: '30,60'
			};

			_export('RingThermometerPanelCtrl', RingThermometerPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(RingThermometerPanelCtrl, _MetricsPanelCtrl);

				function RingThermometerPanelCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, RingThermometerPanelCtrl);

					var _this = _possibleConstructorReturn(this, (RingThermometerPanelCtrl.__proto__ || Object.getPrototypeOf(RingThermometerPanelCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上		
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(RingThermometerPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_ring_thermometer/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.data = dataList;
						this.render();
					}
				}, {
					key: 'fixed',
					value: function fixed() {
						if (Object.prototype.toString.call(this.data) === '[object Array]') {
							if (this.data[0].datapoints.length == 0) {
								this.panel.CO = "red";
							} else {
								var DP = this.data[0].datapoints;
								var num = this.data[0].datapoints[DP.length - 1][0];
								var fixedData = num.toFixed(this.panel.dataPrecise);
								this.data.Fdata = fixedData;
							}
						} else {
							var num = this.data.value;
							if (this.data.precise == null) {
								var fixedData = num.toFixed(this.panel.dataPrecise);
							} else {
								var fixedData = num.toFixed(this.data.precise);
							}
							this.data.Fdata = fixedData;
						}
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'invertColorOrder',
					value: function invertColorOrder() {
						var ref = this.panel.colors;
						var copy = ref[0];
						ref[0] = ref[2];
						ref[2] = copy;
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {
							var obj = elem.find('.ring-thermometer-panel');
							ctrl.fixed();
							var height = ctrl.height || ctrl.row.height;
							if (_.isString(height)) {
								height = parseInt(height.replace('px', ''), 10);
							}
							obj.css('height', height + 'px');
							ctrl.data.FD = parseInt(ctrl.data.Fdata, 10);
							ctrl.data.threshold = [];
							if (ctrl.panel.threshold == null) {
								ctrl.data.threshold = [];
							} else {
								var str = ctrl.panel.threshold.split(",");
								for (var j = 0; j < 3; j++) {
									ctrl.data.threshold.push(parseInt(str[j]));
								}
							}

							if (ctrl.data.FD < ctrl.data.threshold[0]) {
								ctrl.panel.CO = ctrl.panel.colors[0];
							} else if (ctrl.panel.threshold[0] <= ctrl.data.FD && ctrl.data.FD < ctrl.data.threshold[1]) {
								ctrl.panel.CO = ctrl.panel.colors[1];
							} else if (ctrl.data.threshold[1] <= ctrl.data.FD) {
								ctrl.panel.CO = ctrl.panel.colors[2];
							}
							var percents = ctrl.data.Fdata;
							var TfontSize = height * 0.13;
							var SfontSize = height * 0.08;
							var textColor = '#98a0c4';
							if (ctrl.panel.unit == null) {
								var unit = null;
							} else {
								var unit = ctrl.panel.unit;
							}
							var max = ctrl.panel.max;
							var min = ctrl.panel.min;
							var value = max - percents;
							var percent = percents - min;
							var color2 = '#888';

							function getData() {
								return [{
									value: percent,
									itemStyle: {
										normal: {
											color: ctrl.panel.CO, //外环颜色
											shadowBlur: 5,
											shadowColor: ctrl.panel.CO
										}
									}
								}, {
									value: value,
									itemStyle: {
										normal: {
											color: 'transparent' //透明部分
										}
									}
								}];
							}
							var myChart = echarts.init(obj[0]);
							var option = {
								//backgroundColor: 'while',

								title: {
									text: percent + unit, //值的大小
									x: 'center',
									y: 'center',
									itemGap: 1,
									subtext: 'max:' + max + '\n' + 'min:' + min,
									subtextStyle: {
										fontSize: SfontSize
									},
									textStyle: {
										color: textColor, //中间字体颜色
										fontWeight: 'bolder', //中间字体风格
										fontSize: TfontSize //中间字体大小
									}
								},
								series: [{
									type: 'pie',
									radius: ['50%', '50%'],
									silent: true,
									label: {
										normal: {
											show: false
										}
									},

									animation: false
								}, {
									type: 'pie',
									radius: ['55%', '75%'], //[内环空心据远点距离，外环剧远点距离]
									silent: true,
									label: {
										normal: {
											show: false
										}
									},

									data: [{
										itemStyle: {
											normal: {
												color: color2, //圆环颜色
												shadowBlur: 50, //阴影宽度
												shadowColor: color2 //阴影颜色
											}
										}
									}], //黑圆环

									animation: false //圆环动画,默认开启，所以需要取消
								}, {
									name: 'main',
									type: 'pie',
									radius: ['75%', '85%'],
									label: {
										normal: {
											show: false
										}
									},
									data: getData() //外层圆环
								}]
							};

							// 使用刚指定的配置项和数据显示图表。
							myChart.setOption(option);
						});
					}
				}]);

				return RingThermometerPanelCtrl;
			}(MetricsPanelCtrl));

			_export('RingThermometerPanelCtrl', RingThermometerPanelCtrl);

			RingThermometerPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=ring_thermometer.js.map
