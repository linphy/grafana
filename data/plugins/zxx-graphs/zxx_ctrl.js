'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, $, OgeAlertMetricsPanelCtrl, _createClass, panelDefaults, EchartsCtrl;

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
			OgeAlertMetricsPanelCtrl = _appPluginsSdk.OgeAlertMetricsPanelCtrl;
		}, function (_moment) {
			moment = _moment.default;
		}, function (_lodash) {
			_ = _lodash.default;
		}, function (_appCoreTime_series) {
			TimeSeries = _appCoreTime_series.default;
		}, function (_cssClockPanelCss) {}, function (_jquery) {
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
				precise: 2,
				valueSize: '2',
				fontSize: '2',
				timeSize: '2',
				showName: true,
				unit: ''
			};

			_export('EchartsCtrl', EchartsCtrl = function (_OgeAlertMetricsPanel) {
				_inherits(EchartsCtrl, _OgeAlertMetricsPanel);

				function EchartsCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, EchartsCtrl);

					var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_.defaults(_this.panel, panelDefaults);
					var modeOption = [{ name: 'json', value: "json" }, { name: '默认数据源', value: "default" }];
					var preciseOption = [//精度
					{ name: '0', value: 0 }, { name: '1', value: 1 }, { name: '2', value: 2 }, { name: '3', value: 3 }, { name: '4', value: 4 }, { name: '5', value: 5 }, { name: '6', value: 6 }];
					var valueSizeOption = 2,
					    fontSizeOption = 2,
					    timeSizeOption = 2;
					_this.panel.valueSizeOption = valueSizeOption;
					_this.panel.fontSizeOption = fontSizeOption;
					_this.panel.timeSizeOption = timeSizeOption;
					var backgroundColor = '';
					_this.panel.backgroundColor = backgroundColor;
					_this.panel.preciseOption = preciseOption;
					_this.panel.modeOption = modeOption;
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('render', _this.onRender.bind(_this));
					return _this;
				}

				_createClass(EchartsCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/zxx-graphs/editor.html', 2);
					}
				}, {
					key: 'doJudgment',
					value: function doJudgment() {
						if (this.dataList.value == undefined) {
							this.panel.mode = 'default';
						} else {
							this.panel.mode = 'json';
						}
					}
				}, {
					key: 'fullTime',
					value: function fullTime(number) {
						if (number < 10) {
							return "0" + number;
						} else {
							return number;
						}
					}
				}, {
					key: 'getTimes',
					value: function getTimes() {
						var myDate;
						if (this.panel.mode == 'json') {
							myDate = new Date(this.dataList.time);
						} else {
							if (this.dataList[0].datapoints.length == 0) {
								myDate = new Date();
							} else {
								var DP = this.dataList[0].datapoints;
								myDate = new Date(this.dataList[0].datapoints[DP.length - 1][1]);
							}
						}
						var times = myDate.getFullYear();
						times += "-" + this.fullTime(myDate.getMonth() + 1);
						times += "-" + this.fullTime(myDate.getDate());
						times += " " + this.fullTime(myDate.getHours());
						times += ":" + this.fullTime(myDate.getMinutes());
						times += ":" + this.fullTime(myDate.getSeconds());
						this.panel.time = times;
					}
				}, {
					key: 'setColor',
					value: function setColor() {
						if (this.dataList == undefined) {
							return;
						}
						if (this.dataList !== null && this.dataList.length > 0 && this.dataList[0].alarm !== undefined) {
							var level = this.dataList[0].alarm.level;
							var color = this.getAlertLevelColor(level);
							if (color) {
								this.panel.backgroundColor = color;
							}
						} else {
							this.panel.backgroundColor = '';
						}
					}
				}, {
					key: 'fixed',
					value: function fixed() {
						if (this.panel.mode == 'json') {
							var num = this.dataList.value;
							if (num == -9999) {
								this.panel.data = "-";
							} else if (num == parseInt(num + "")) {
								this.panel.data = num;
							} else {
								this.panel.data = num.toFixed(this.dataList.precise + 2); //临时加2
							}
						} else {
							var num1 = this.dataList[0].datapoints.length - 1;
							if (this.dataList[0].datapoints.length == 0) {
								//没值时给随机数
								this.panel.data = 'NAN';
							} else {
								var num = this.dataList[0].datapoints[num1][0];
								this.panel.data = num.toFixed(this.panel.precise);
							}
						}
					}
				}, {
					key: 'setfontSize',
					value: function setfontSize() {
						if (this.panel.fontSize == undefined) {
							this.panel.fontSize = "请输入0~5的数字";
						} else {}
					}
				}, {
					key: 'setvalueSize',
					value: function setvalueSize() {
						if (this.panel.valueSize == undefined) {
							this.panel.valueSize = "请输入0~5的数字";
						} else {}
					}
				}, {
					key: 'settimeSize',
					value: function settimeSize() {
						if (this.panel.timeSize == undefined) {
							this.panel.timeSize = "请输入0~5的数字";
						} else {}
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.dataList = dataList;
						this.doJudgment();
						this.getTimes();
						this.fixed();
						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						this.setColor();
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						if (ctrl.panel.unit == null) {
							return;
						}
					}
				}]);

				return EchartsCtrl;
			}(OgeAlertMetricsPanelCtrl));

			_export('EchartsCtrl', EchartsCtrl);

			EchartsCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=zxx_ctrl.js.map
