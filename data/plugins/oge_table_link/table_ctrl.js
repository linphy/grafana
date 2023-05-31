'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', './css/clock-panel.css!', 'jquery'], function (_export, _context) {
	"use strict";

	var OgeAlertMetricsPanelCtrl, moment, _, $, _createClass, panelOptionDefaults, TablePanelCtrl;

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
		}, function (_moment) {
			moment = _moment.default;
		}, function (_lodash) {
			_ = _lodash.default;
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

			panelOptionDefaults = {
				metrics: {},
				includeVars: true,

				isShowTime: true,
				isShowUnit: false,

				alarmStyle: 'none',
				colors: ["rgba(50, 172, 45, 0.97)", "rgba(237, 129, 40, 0.89)", "rgba(245, 54, 54, 0.9)"],

				fontFamily: '微软雅黑',
				fontSize: '100%',
				fontStyle: 'normal',

				dataPrecise: 2
			};

			_export('TablePanelCtrl', TablePanelCtrl = function (_OgeAlertMetricsPanel) {
				_inherits(TablePanelCtrl, _OgeAlertMetricsPanel);

				/** @ngInject */
				function TablePanelCtrl($scope, $injector, $rootScope, backendSrv, linkSrv) {
					_classCallCheck(this, TablePanelCtrl);

					var _this = _possibleConstructorReturn(this, (TablePanelCtrl.__proto__ || Object.getPrototypeOf(TablePanelCtrl)).call(this, $scope, $injector));

					$scope.searchDashboards = function (queryStr, callback) {
						this.backendSrv.search({
							query: queryStr
						}).then(function (hits) {
							var dashboards = _.map(hits, function (dash) {
								return dash.title;
							});
							callback(dashboards);
						});
					};
					_this.backendSrv = backendSrv;
					_this.linkSrv = linkSrv;

					_.defaults(_this.panel, {
						options: {}
					}); //将panelDefaults属性附加到this.panel上
					_.defaults(_this.panel.options, panelOptionDefaults);

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('render', _this.onRender.bind(_this));
					return _this;
				}

				_createClass(TablePanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_table_link/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						var tmpMetrics = this.panel.options.metrics;
						this.panel.options.metrics = {};

						if (_.isEmpty(dataList)) return;

						for (var i = 0; i < dataList.length; i++) {
							var item = dataList[i];
							this.panel.options.metrics[item.refId] = tmpMetrics[item.refId] || {
								link: {
									type: 'none',
									url: null,
									dashboard: null,
									dashUri: null
								},
								unit: null,
								threshold: ''
							};
						}

						this.data = dataList;
						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						if (_.isEmpty(this.data)) return; // 数据为空，则跳出

						for (var i = 0; i < this.data.length; i++) {
							var dat = this.data[i];

							// 设置 Value 和 Time
							dat.value = '-';
							dat.time = '-';
							if (!_.isEmpty(dat.datapoints)) {
								var value = dat.datapoints[dat.datapoints.length - 1][0].toFixed(this.panel.options.dataPrecise);
								if (value !== -9999) dat.value = value;

								var time = dat.datapoints[dat.datapoints.length - 1][1];
								if (Number.parseInt(time) > 0) dat.time = moment(Number.parseInt(time)).format("YYYY-MM-DD HH:mm:ss");
							}
							if (this.panel.ogeAlertEnabled) {
								if (dat.alarm == null) {
									continue;
								} else {
									dat.color = this.getAlertLevelColor(dat.alarm.level);
								}
							}
						}
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {

						var pageCount = 0;
						//table高度
						function getTableHeight() {
							var panelHeight = ctrl.height;
							if (pageCount > 1) {
								panelHeight -= 26;
							}
							return panelHeight - 31 + 'px';
						}
						ctrl.events.on('render', function () {
							if (_.isEmpty(ctrl.data)) return;

							var rootElem = elem.find('.table-panel-scroll'); //表格需要处理高度
							pageCount = ctrl.data.length;
							rootElem.css({
								'max-height': getTableHeight()
							});
						});
					}
				}, {
					key: 'formatLinkHref',
					value: function formatLinkHref(link) {
						if (link.type === 'none') {
							return '###';
						}

						link.includeVars = this.panel.options.includeVars;
						var linkInfo = this.linkSrv.getPanelLinkAnchorInfo(link, this.panel.scopedVars);
						return linkInfo.href;
					}
				}, {
					key: 'invertColorOrder',
					value: function invertColorOrder() {
						this.panel.options.colors.reverse();
					}
				}, {
					key: 'dashboardChanged',
					value: function dashboardChanged(link) {
						this.backendSrv.search({
							query: link.dashboard
						}).then(function (hits) {
							var dashboard = _.find(hits, {
								title: link.dashboard
							});
							if (dashboard) {
								link.dashUri = dashboard.uri;
							}
						});
					}
				}, {
					key: 'searchDashboards',
					value: function searchDashboards(queryStr, callback) {
						this.backendSrv.search({
							query: queryStr
						}).then(function (hits) {
							var dashboards = _.map(hits, function (dash) {
								return dash.title;
							});
							callback(dashboards);
						});
					}
				}]);

				return TablePanelCtrl;
			}(OgeAlertMetricsPanelCtrl));

			_export('TablePanelCtrl', TablePanelCtrl);

			TablePanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=table_ctrl.js.map
