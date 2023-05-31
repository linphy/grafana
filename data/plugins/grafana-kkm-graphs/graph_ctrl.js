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
				mode: 'all', //展示方式：all 主页面，detail：指标量列表
				kksTitle: "XX智慧检修平台",
				unit: 1, //默认机组
				detail: "", //显示指标量的模板名称
				alarmColor: ["rgba(0, 255, 0, 0.7)", "rgba(0, 170, 0, 0.7)", "rgba(255, 255, 0, 0.7)", "rgba(255, 0, 0, 0.7)"] //告警颜色等级0-3 00ff00\00aa00\ffff00,#ff0003
			};

			_export('EchartsCtrl', EchartsCtrl = function (_MetricsPanelCtrl) {
				_inherits(EchartsCtrl, _MetricsPanelCtrl);

				function EchartsCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, EchartsCtrl);

					var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;

					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
					var modeOption = [{ name: '指标分类', value: "all" }, { name: '详细指标级', value: "detail" }];
					_this.panel.modeOption = modeOption;

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(EchartsCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						var unitOption = [{ name: '1号机组', value: 1 }, { name: '2号机组', value: 2 }, { name: '3号机组', value: 3 }, { name: '4号机组', value: 4 }];
						this.panel.unitOption = unitOption;
						this.addEditorTab('Options', 'public/plugins/grafana-kkm-graphs/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.dataList = dataList;
						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'setColor',
					value: function setColor(alarmCode) {
						var p = "";
						if (alarmCode <= 3) {
							p = this.panel.alarmColor[alarmCode];
						} else {
							p = '';
						}
						return { "background-color": p };
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						var pageCount = 0;
						//table高度
						function getTableHeight() {
							var panelHeight = ctrl.height;
							if (pageCount > 1) {
								panelHeight -= 30;
							}
							return panelHeight - 31 + 'px';
						}

						ctrl.events.on('render', function () {
							if (ctrl.panel.mode == "all") {
								return;
							}
							if (!ctrl.datasource || !ctrl.datasource.url) {
								return;
							}

							if (ctrl.panel.mode == "detail" && ctrl.panel.detail == "") {
								console.warn("没有设置指标量模板");
							}

							var dataJson = ctrl.dataList;

							//KPI分类：运行监控GE，安装调试GB ; kks 29-31位标识
							var GE = [];
							var GB = [];
							for (var i = 0; i < dataJson.length; i++) {
								if (dataJson[i].kks && dataJson[i].kks.length >= 33) {
									var s = dataJson[i].kks.substring(29, 31);
									if (s == "GB") {
										GB.push(dataJson[i]);
									} else if (s == "GE") {
										GE.push(dataJson[i]);
									} else {
										console.warn("错误的监测量 ：" + dataJson[i].kks);
									}
								}
								if (dataJson[i].value && dataJson[i].precise) {
									dataJson[i].value = dataJson[i].value.toFixed(dataJson[i].precise);
								}

								if (dataJson[i].value == -9999 || dataJson[i].value == '-9999') {
									dataJson[i].value = "-";
								}
							}
							ctrl.panel.GE = GE;
							ctrl.panel.GB = GB;

							var rootElem = elem.find('.table-panel-scroll'); //表格需要处理高度
							pageCount = ctrl.panel.GB.length > ctrl.panel.GE.length ? ctrl.panel.GB.length : ctrl.panel.GE.length;
							rootElem.css({ 'max-height': getTableHeight() });
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
