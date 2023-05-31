'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'jquery', './pageing'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, $, pageing, _createClass, panelDefaults, EchartsCtrl;

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
		}, function (_cssClockPanelCss) {}, function (_jquery) {
			$ = _jquery.default;
		}, function (_pageing) {
			pageing = _pageing.default;
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
				mode: 'kpi', //默认显示模式
				alarmColor: ["rgba(0, 255, 0, 0.7)", "rgba(0, 170, 0, 0.7)", "rgba(255, 255, 0, 0.7)", "rgba(255, 0, 0, 0.7)"], //告警颜色等级0-3 00ff00\00aa00\ffff00,#ff0003
				dataTime: '2016-01-01 00:00:00'
			};

			_export('EchartsCtrl', EchartsCtrl = function (_MetricsPanelCtrl) {
				_inherits(EchartsCtrl, _MetricsPanelCtrl);

				function EchartsCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, EchartsCtrl);

					var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;

					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
					var modeOption = [{ name: 'KPI主信息', value: "kpi" }, { name: 'KPI仪表盘', value: "kpiGauge" }, { name: 'KPI描述', value: "kpiDesc" }, { name: 'KPI链接', value: "kpiWebUrl" }, { name: '告警信息', value: "alarmInfo" }, { name: '关联量信息', value: "relativeInfo" }];
					_this.panel.modeOption = modeOption;

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(EchartsCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/grafana-zbl-graphs/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.data = dataList;
						this.render();
					}
				}, {
					key: 'changeTime',
					value: function changeTime(start, end) {
						console.log(this.timeSrv.time.from, start, end);
						if (this.timeSrv.time.from == start) {
							return;
						}
						var range = { from: start, to: end };
						this.timeSrv.setTime(range);
						this.$rootScope.appEvent('hide-dash-editor');
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'setColor',
					value: function setColor(status) {
						var p = "";
						if (status <= 3) {
							p = this.panel.alarmColor[status];
						} else {
							p = '';
						}
						return { "background-color": p };
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						pageing(scope, elem, attrs, ctrl);
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
