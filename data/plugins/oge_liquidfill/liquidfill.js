'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', 'echarts', 'vendor/echarts/echarts-liquidfill.js', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, echarts, liquidFill, $, _createClass, panelDefaults, liquidDillPanelCtrl;

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
		}, function (_echarts) {
			echarts = _echarts.default;
		}, function (_vendorEchartsEchartsLiquidfillJs) {
			liquidFill = _vendorEchartsEchartsLiquidfillJs.default;
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
				defaultColor: 'rgba(0, 0, 0, 0.5)',
				unit: "m",
				colors: ['rgba(253,238,199,0.9)', 'rgba(121,159,162,0.9)', 'rgba(40,37,54,0.9)'],
				fontSizes: 40,
				shapes: 'circle',
				bgcolors: 'rgba(255, 255, 255, 0.9)',
				names: '水位'
			};

			_export('liquidDillPanelCtrl', liquidDillPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(liquidDillPanelCtrl, _MetricsPanelCtrl);

				function liquidDillPanelCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, liquidDillPanelCtrl);

					var _this = _possibleConstructorReturn(this, (liquidDillPanelCtrl.__proto__ || Object.getPrototypeOf(liquidDillPanelCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上	
					var shapesOption = [{
						name: '圆形',
						value: 'circle'
					}, {
						name: '菱形',
						value: 'diamond'
					}, {
						name: '矩形',
						value: 'rect'
					}, {
						name: '圆矩',
						value: 'roundRect'
					}, {
						name: '针形',
						value: 'pin'
					}];
					_this.panel.shapesOption = shapesOption;

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(liquidDillPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_liquidfill/editor.html', 2);
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
						} else if (this.data.value == null) {
							return;
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
						this.panel.colors.reverse(); //颠倒数组中元素顺序
					}
				}, {
					key: 'onEditorAddColors',
					value: function onEditorAddColors() {
						this.panel.colors.push(this.panel.defaultColor); // 添加默认颜色到Color数组
						this.render();
					}
				}, {
					key: 'onEditorDeleteColors',
					value: function onEditorDeleteColors() {
						this.panel.colors.pop(); //删除Color数组的最后一条
						this.render();
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {
							var obj = elem.find('.liquidfill-panel');
							ctrl.fixed();
							var height = ctrl.height || ctrl.row.height;
							if (_.isString(height)) {
								height = parseInt(height.replace('px', ''), 10);
							}
							obj.css('height', height + 'px');
							var myChart = echarts.init(obj[0]);
							var a = ctrl.data.Fdata / (ctrl.panel.max - ctrl.panel.min);
							var b = a * 0.9;
							var c = b * 0.9;
							var d = c * 0.9;
							var e = d * 0.9;
							var option = {
								series: [{
									type: 'liquidFill',
									data: [a, b, c, d, e], //波浪高度：中心文字默认展示第一个值
									radius: '90%',
									color: ctrl.panel.colors, //波浪颜色，值比颜色多时会自动循环
									shape: ctrl.panel.shapes, //水球图内置颜色roundRect diamond roundRect
									waveAnimation: true, //左右波动，默认波动为true40,37,54
									label: {
										normal: {
											formatter: ctrl.panel.names + '\n' + ctrl.data.Fdata + ctrl.panel.unit, //中心文字，默认为百分比
											textStyle: {
												fontSize: ctrl.panel.fontSizes
												//color: '#D94854'
											}
										}
									},
									backgroundStyle: {
										color: ctrl.panel.bgcolors //背景颜色
									}
								}]
							};
							// 使用刚指定的配置项和数据显示图表。
							myChart.setOption(option);
						});
					}
				}]);

				return liquidDillPanelCtrl;
			}(MetricsPanelCtrl));

			_export('liquidDillPanelCtrl', liquidDillPanelCtrl);

			liquidDillPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=liquidfill.js.map
