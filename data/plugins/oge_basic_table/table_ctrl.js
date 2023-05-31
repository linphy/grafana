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
				isShowKKSName: true,
				isShowTime: true,
				isShowUnit: false,
				isShowValue: true,
				firstColumnText: '名称',
				secondColumnText: '时间',
				thirdColumnText: '值',
				fourColumnText: '单位',
				alarmStyle: 'none',
				colors: ["rgba(50, 172, 45, 0.97)", "rgba(237, 129, 40, 0.89)", "rgba(245, 54, 54, 0.9)"],
				fontFamily: '微软雅黑',
				fontSize: '100%',
				fontStyle: 'normal',
				dataPrecise: 2,
				colorOption: [{
					name: '禁用',
					value: 'Null'
				}, {
					name: '单元格',
					value: 'cell'
				}, {
					name: '值',
					value: 'value'
				}, {
					name: '行',
					value: 'row'
				}],
				colorMode: 'Null',
				costumeAlert: true,
				mode: 'alarmInfo',
				threshold: []
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
						this.addEditorTab('Options', 'public/plugins/oge_basic_table/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						var tmpMetrics = this.panel.options.metrics;
						this.panel.options.metrics = {};

						if (_.isEmpty(dataList)) return;
						for (var i = 0; i < dataList.length; i++) {
							var item = dataList[i];
							if (item.meta && item.meta.sql && item.meta.sql.length > 0) {
								//只针对现场报警数据和value一起放在dataPoints中的pg数据源,将报警数据提出，重新组装数据，假设第一个是alert数据
								if (item.datapoints.length % 2 == 0 && item.datapoints[0][1] == item.datapoints[1][1]) {
									var alarm = {
										level: item.datapoints[0][0],
										time: item.datapoints[0][1],
										value: item.datapoints[1][0]
									};
									item.datapoints = [angular.copy(item.datapoints[1])];
									item['alarm'] = alarm;
									item['target'] = item.target.indexOf('_') > 0 ? item.target.split('_')[1] : item.target;
								}
							}

							if (item.refId) {
								item.refIdNew = item.refId;
							} else {
								item.refIdNew = item.target;
							}

							this.panel.options.metrics[item.refIdNew] = tmpMetrics[item.refIdNew] || {
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
					value: function onRender() {}
				}, {
					key: 'fixed',
					value: function fixed() {
						for (var i = 0; i < this.data.length; i++) {
							if (this.data[i].value == null && this.data[i].max == null) {
								this.data[i].name = this.data[i].target;
								var dat = this.data[i];
								// 设置 Fdata 和 Time
								dat.Fdata = '-';
								dat.time = '-';
								if (!_.isEmpty(dat.datapoints)) {
									var value = dat.datapoints[dat.datapoints.length - 1][0].toFixed(this.panel.options.dataPrecise);
									if (value !== -9999) dat.Fdata = value;

									var time = dat.datapoints[dat.datapoints.length - 1][1];
									if (Number.parseInt(time) > 0) dat.time = moment(Number.parseInt(time)).format("YYYY-MM-DD HH:mm:ss");
								}
								this.panel.options.mode = "commonData";
							} else if (this.data[i].value != null && this.data[i].max == null) {
								var num = this.data[i].value;
								if (this.data[i].precise == null) {
									var fixedData = num.toFixed(this.panel.dataPrecise);
								} else {
									var fixedData = num.toFixed(this.data[i].precise);
								}
								if (fixedData == -9999) {
									fixedData = "-";
								}
								this.data[i].Fdata = fixedData;
								this.panel.options.mode = "relativeInfo";
							} else {
								this.panel.options.mode = "alarmInfo";
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
							return panelHeight + 'px';
						}
						ctrl.events.on('render', function () {
							if (_.isEmpty(ctrl.data)) return;
							ctrl.fixed();
							for (var i = 0; i < ctrl.data.length; i++) {
								if (ctrl.panel.ogeAlertEnabled && !ctrl.panel.options.costumeAlert) {
									if (ctrl.data[i].alarm == null) {
										continue;
									} else {
										ctrl.data[i].color = ctrl.getAlertLevelColor(ctrl.data[i].alarm.level);
									}
								} else {
									ctrl.data[i].threshold = [];
									if (ctrl.panel.options.threshold == null || ctrl.panel.options.threshold[ctrl.data[i].refIdNew] == null) {
										ctrl.data[i].threshold = [25, 50];
									} else {
										var str = ctrl.panel.options.threshold[ctrl.data[i].refIdNew].split(",");
										for (var j = 0; j < 2; j++) {
											ctrl.data[i].threshold.push(Number(str[j]));
										}
									}
									if (ctrl.data[i].Fdata < ctrl.data[i].threshold[0]) {
										ctrl.data[i].CO = ctrl.panel.options.colors[0];
									} else if (ctrl.data[i].threshold[0] <= ctrl.data[i].Fdata && ctrl.data[i].Fdata < ctrl.data[i].threshold[1]) {
										ctrl.data[i].CO = ctrl.panel.options.colors[1];
									} else if (ctrl.data[i].threshold[1] <= ctrl.data[i].Fdata && ctrl.data[i].Fdata) {
										ctrl.data[i].CO = ctrl.panel.options.colors[2];
									}
								}
							}
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
						this.render();
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
