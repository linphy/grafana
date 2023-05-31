'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'vendor/echarts/echarts.min.js', 'jquery'], function (_export, _context) {
	"use strict";

	var OgeAlertMetricsPanelCtrl, moment, _, TimeSeries, echarts, $, _createClass, panelDefaults, datasourceType, RectangularTreeCtrl;

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
				showLevel: 1, //显示层级
				layout: { //相对于panel的比例
					width: '99%',
					height: '96%'
				},
				chart: {
					name: 'XX矩形树',
					show: false
				},
				treeDataDefault: [{
					name: "一号机组",
					kks: ''
				}],
				treeDataStr: '',
				color: [{
					color: '#2f4554'
				}],
				colorId: [],
				warnType: ['子级', 'kks'],
				breadcrumbs: false,
				tooltip: false,
				fontSize: 14,
				// topShowChildrensAlert:false,
				topPassLevel: []
			};
			datasourceType = "";

			_export('RectangularTreeCtrl', RectangularTreeCtrl = function (_OgeAlertMetricsPanel) {
				_inherits(RectangularTreeCtrl, _OgeAlertMetricsPanel);

				function RectangularTreeCtrl($scope, $injector, $rootScope, backendSrv, variableSrv, templateChange) {
					_classCallCheck(this, RectangularTreeCtrl);

					var _this = _possibleConstructorReturn(this, (RectangularTreeCtrl.__proto__ || Object.getPrototypeOf(RectangularTreeCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_this.backendSrv = backendSrv;
					_this.templateChange = templateChange;
					_this.panel.linkes = [];
					_this.panel.linkes.push({
						type: 'dashboard'
					});
					_this.variables = variableSrv.variables;
					if (panelDefaults.treeDataStr == '') {
						panelDefaults.treeDataStr = JSON.stringify(panelDefaults.treeDataDefault, false, 4);
					}
					_.defaults(_this.panel, panelDefaults);

					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-error', _this.onDataError.bind(_this));
					return _this;
				}

				_createClass(RectangularTreeCtrl, [{
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						// if (!this.datasource.kdmUrl) {
						// 	return;
						// }
						this.data = dataList;
						datasourceType = this.datasource.type;
						this.render();
					}
				}, {
					key: 'onDataError',
					value: function onDataError(err) {
						console.info("error...");
					}
				}, {
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/rectangular-tree-panel/editor.html', 2);
						this.addEditorTab('Data Bind', 'public/plugins/rectangular-tree-panel/databind.html', 3);
					}
				}, {
					key: 'getDataMap',
					value: function getDataMap(kksArr) {
						var s = new Array(kksArr.length);
						var kks = kksArr.join(",");
						$.ajax({
							type: 'GET',
							url: this.datasource.url + '/kdmService/rest/1.0/kksData?method=getRTDataSnapshot&kksCodes=' + kks,
							async: false,
							success: function success(result) {
								if (result !== null && result.RTDataSets.length !== 0) {
									for (var i; i < result.RTDataSets.length; i++) {
										var rtdata = result.RTDataSets[i];
										if (rtdata.RTDataValues == null || rtdata.RTDataValues.length == 0) {
											s[i] = { 'key': rtdata.kksCode, 'value': 'N/A' };
										} else {
											s[i] = { 'key': rtdata.kksCode, 'value': rtdata.RTDataValues[0].value + '' };
										}
									}
								}
								s = result;
							}
						});
						return s;
					}
				}, {
					key: 'addElement',
					value: function addElement() {
						this.panel.color.push({
							color: '#fff'
						});
						this.render();
					}
				}, {
					key: 'dropElement',
					value: function dropElement(index) {
						this.panel.color.splice(index, 1);
						this.render();
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						function getOption(data) {
							var colorArr = [];
							for (var i = 0; i < ctrl.panel.color.length; i++) {
								colorArr.push(ctrl.panel.color[i].color);
							};

							return {
								title: {
									subtext: '',
									left: 'leafDepth',
									show: false
								},
								tooltip: {
									show: ctrl.panel.tooltip,
									trigger: 'none'
								},
								color: colorArr,
								series: [{
									name: ctrl.panel.chart.name,
									type: 'treemap',
									breadcrumb: {
										show: ctrl.panel.breadcrumbs
									},

									label: {
										normal: {
											textStyle: {
												fontSize: ctrl.panel.fontSize
											}
										}
									},
									visibleMin: 300,
									top: 'top',
									//是否显示路径
									width: ctrl.panel.layout.width,
									height: ctrl.panel.layout.height,
									nodeClick: 'link', //默认zoomToNode点击节点后缩放到节点，link进行超链接跳转，配合silent使用
									//silent:true, //不响应鼠标点击事件
									roam: false, //是否开启拖拽漫游（移动和缩放）
									data: data,
									leafDepth: ctrl.panel.showLevel,
									levels: [{
										color: colorArr,
										colorMappingBy: 'index',
										itemStyle: {
											normal: {
												borderColor: '#555',
												borderWidth: 0,
												gapWidth: 2
											}
										}
									}, {
										color: colorArr,
										lable: {
											normal: {
												fontSize: 26
											}
										},
										itemStyle: {
											normal: {
												borderColorSaturation: 0,
												gapWidth: 1,
												borderWidth: 1
											}
										}
									}, {
										color: colorArr,
										itemStyle: {
											normal: {
												borderColorSaturation: 0,
												gapWidth: 1
											}
										}
									}, {
										color: colorArr,
										itemStyle: {
											normal: {
												borderColorSaturation: 0,
												gapWidth: 1
											}
										}
									}]
								}]
							};
						}

						function getKKS(kksArr, tempData) {
							for (var i = 0; i < tempData.length; i++) {
								if (tempData[i].kks != null && tempData[i].kks != '') {
									kksArr.push(tempData[i].kks);
								}
								if (tempData[i].children != null) {
									getKKS(kksArr, tempData[i].children);
								}
							}
						}

						function addVariableToPath(treeData, params) {
							if (treeData != null && treeData.length > 0) {
								for (var i = treeData.length - 1; i >= 0; i--) {
									var templink = treeData[i].link;
									treeData[i].target = "_self";
									if (templink != null && templink !== '') {
										if (templink.indexOf('?') >= 0) {
											if (templink.charAt(templink.length - 1) == '?') {
												treeData[i].link = templink + params;
											} else {
												treeData[i].link = templink + '&' + params;
											}
										} else {
											treeData[i].link = templink + '?' + params;
										}
									}
									if (treeData[i].children != null) {
										addVariableToPath(treeData[i].children, params);
									}
								}
							}
						}
						ctrl.events.on('render', function () {
							//编写默认参数
							var oge_variable = ctrl.variables;
							var params = '';
							if (oge_variable != null && oge_variable.length > 0) {
								for (var i = 0; i < oge_variable.length; i++) {
									if (oge_variable[i].type === 'adhoc') continue;
									if (i > 0) {
										params += '&';
									}
									params += 'var-' + oge_variable[i].name + '=' + oge_variable[i].current.value;
								}
							}
							if (ctrl.datasource == undefined || ctrl.datasource.url == undefined) {
								console.warn("必须使用kdm数据源");
								return;
							}
							var obj = elem.find('.tree-panel');
							obj.css("height", ctrl.height + "px");
							var myChart = echarts.init(obj[0]);

							//获取保存的字符串，转变成json对象
							var treeData = $.parseJSON(ctrl.panel.treeDataStr);
							addVariableToPath(treeData, params);
							var jsonData = $.map(treeData, function (obj) {
								return $.extend(true, {}, obj); //返回对象的深拷贝
							});

							//根据json，获取所有的kks,包括children中的
							var kksArr = [];
							getKKS(kksArr, jsonData);
							//查找kks对应的数据
							ctrl.getDataAlert(kksArr).then(function (res) {
								var alertArray = void 0;
								if (res && res.data) {
									alertArray = res.data;
								} else {
									alertArray = res;
								}
								//处理json，变成chart所需要的格式
								getFormatData(jsonData, alertArray, null, true, 0, 0, null);

								myChart.setOption(getOption(jsonData));
							});
						});

						//autor  dingzai
						function searchAlertInfoByKKSCode(kksCode, alertArray) {
							var kksCode = ctrl.templateChange.changeStart(kksCode); //真实的请求的kks
							if (alertArray != null) {
								for (var i = alertArray.length - 1; i >= 0; i--) {
									if (kksCode == alertArray[i].kpi_id || kksCode == alertArray[i].code) {
										var alertInfo = alertArray[i];
										_.remove(alertArray, function (alert) {
											return alert.kpi_id == kksCode || alert.code == kksCode;
										});
										return alertInfo;
									}
								}
							}
							return null;
						}

						//根据tag获取相应的对象 1代表正常 2代表警告 3代表报警
						function getAlertStyleByAlertTag(tag) {
							var result = ctrl.getAlertLevelColor(tag);
							if (ctrl.ogeAlertColorValue) {
								var label = {
									normal: {
										textStyle: {
											color: result
										}
									}
								};
								return label;
							} else {
								var itemStyle = {
									normal: {
										color: result
									}
								};
								return itemStyle;
							}
						}

						//获取提交至chart的数据
						//处理数据，使之成为符合char所需要的模板 
						//tempData是JSON样式  
						//kksMap是查询的告警结果,
						//isTop判断是否是一级，只有用到报警的时候有用
						//topInd是一级的下标
						//familyLevel层级，当前到第几层
						function getFormatData(tempData, kksMap, parentJsonData, isTop, topInd, familyLevel, initData) {
							if (isTop) {
								initData = tempData;
							}
							for (var i = 0; i < tempData.length; i++) {
								var levelTag = 1;
								//设置默认值
								tempData[i].value = levelTag;
								tempData[i].level = levelTag;
								tempData[i].idl = parentJsonData ? parentJsonData.idl + '-' + i : isTop ? i + '' : '';
								if (tempData[i].kks != null) {
									if (kksMap != null) {
										var value = "";
										var alertInfo = searchAlertInfoByKKSCode(tempData[i].kks, kksMap);
										if (alertInfo == null || alertInfo == undefined || datasourceType == "oge-kdm" && alertInfo.value == null || datasourceType !== "oge-kdm" && alertInfo.alert_level == null) {
											alertInfo = {
												"kpi_id": tempData[i].kks,
												"alert_level": 0,
												"value": ""
											};
										} else {
											if (datasourceType == "oge-kdm") {
												alertInfo = {
													"kpi_id": tempData[i].kks,
													"alert_level": alertInfo.value,
													"value": alertInfo.exts && alertInfo.exts['报警字段值'] ? alertInfo.exts['报警字段值'] : alertInfo.value
												};
											}
										}
										// 自带的服务 ctrl.getAlertLevelName 通过级别获取显示的报警标识名称
										if (tempData[i].showData == true && alertInfo.value !== "") value = Number(alertInfo.value.toFixed(2)) + "  " + ctrl.getAlertLevelName(alertInfo.alert_level);
										//如果设置为报警才显示报警颜色 isAlert 表示 kks报警
										tempData[i].value = 1; //更新值
										tempData[i].level = 1; //定义级别标识，便于后面穷举判断
										if (tempData[i].isAlert == true) {
											levelTag = alertInfo.alert_level;
											if (isTop) {
												topInd = i;
												ctrl.panel.topPassLevel[topInd] = levelTag;
												familyLevel = 0;
											}
											setColorStyleToTree(tempData[i], alertInfo.alert_level);
											//父节点设置为子级报警且父节点的报警级别小于子级，才对父节点的样式进行变化
											if (parentJsonData != null && parentJsonData.childAlert == true && parentJsonData.level < levelTag && ctrl.panel.topPassLevel[topInd] < levelTag) {
												//记录最高报警级别
												ctrl.panel.topPassLevel[topInd] = levelTag;
												var idLArr = tempData[i].idl.split('-');
												var strLa = "initData[idLArr[0]]";
												for (var j = 1; j < idLArr.length; j++) {
													setColorStyleToTree(eval(strLa), levelTag);
													strLa += ".children[idLArr[" + j + "]]";
												}
											}
										}
										if (tempData[i].showData == true && value == "") {
											value = "N/A" + "  " + ctrl.getAlertLevelName(1);
										}
										tempData[i].name += " " + value;
										tempData[i].tag = tempData[i].kks;
									}
									//提高效率,可以去掉重复判断的问题
									delete tempData[i].kks;
								}

								if (tempData[i].children != null) {
									//如果当前级有子级 且设置报警类型为子级， 才会联动显示报警信息
									if (tempData[i].childAlert == 1) {
										getFormatData(tempData[i].children, kksMap, tempData[i], false, topInd, familyLevel++, initData);
									} else {
										getFormatData(tempData[i].children, kksMap, null, false, topInd, familyLevel++, initData);
									}
								}
							}
						}

						//设置树节点的样式 data: 要修改的某个节点， level： 颜色级别
						function setColorStyleToTree(data, level) {
							var styleItem = getAlertStyleByAlertTag(level);
							//显示方式分为 字体颜色，和背景颜色，默认为背景颜色
							if (ctrl.ogeAlertColorValue) {
								//data.label 设置字体的
								data.label = styleItem;
							} else {
								//itemStyle 设置背景相关样式的
								data.itemStyle = styleItem;
							}
						}
					}
				}, {
					key: 'getDataAlert',
					value: function getDataAlert(kksArr) {
						this.templateChange.changeTargets(kksArr);
						var s;
						var jsonData;
						if (datasourceType == 'oge-kxm-restalarm' || datasourceType == 'oge-kxm-ontologies') {
							var str = '';
							var kksCodeStr = 'c.KpiAlertLatest.kpiId = "';
							for (var j = 0; j < kksArr.length; j++) {
								if (j === 0) {
									kksCodeStr += kksArr[0] + '"';
								} else {
									kksCodeStr += ' OR c.KpiAlertLatest.kpiId = "' + kksArr[j] + '"';
								}
							}
							str = "select KpiAlertLatest.alertLevel as alert_level, KpiAlertLatest.datetime as datetime, KpiAlertLatest.value as value, KpiAlertLatest.kpiId as kpi_id from KpiAlertLatest as c where " + kksCodeStr;
							return this.datasource.getOneSaitDataValue('KpiAlertLatest', str);
						} else if (datasourceType == 'oge-kdm') {
							var kksString = kksArr.join(',');
							var method = "getLatestAlarm";
							if (this.panel.targets && this.panel.targets[0] && this.panel.targets[0].kdm) {
								method = this.panel.targets[0].kdm.dataType == 1 ? "getLatestAlarm" : "getHistoryAlarm";
							}
							$.ajax({
								type: 'GET',
								url: this.datasource.url + '/kxmData?kksCodes=' + kksString + '&method=' + method,
								dataType: 'json',
								async: false,
								contentType: 'application/json',
								success: function success(result) {
									s = result.Alarm;
								}
							});
							return Promise.resolve(s);
						} else {
							if (this.panel.kdm.dataType == 1) {
								jsonData = { "_postalerts_last": { "kpi_ids": kksArr } };
							} else {
								jsonData = { "_postalerts": { "kpi_ids": kksArr, "start_time": this.range.from.toDate().getTime(), "end_time": this.range.to.toDate().getTime() } };
							}
							$.ajax({
								type: 'POST',
								url: this.datasource.url + '/services/kpi_datas/alerts' + (this.panel.kdm.dataType == 1 ? '/last' : ''),
								dataType: 'json',
								data: JSON.stringify(jsonData),
								async: false,
								contentType: 'application/json',
								success: function success(result) {
									s = result.kpi_alerts.alert;
								}
							});
							return Promise.resolve(s);
						}
					}
				}, {
					key: 'searchDashboards',
					value: function searchDashboards(queryStr, callback) {}
				}, {
					key: 'dashboardChanged',
					value: function dashboardChanged() {
						var linkType = $('#linkType').val();
						var linkDashboard = $('#linkDashboard').val();

						var linkUrl = $('#linkUrl').val();
						if (linkType === 'absolute') {
							$("#link").val(linkUrl ? linkUrl.trim() : "");
							$("#dashboardName").val($("#link").val());
							return;
						}

						this.backendSrv.search({
							query: linkDashboard
						}).then(function (hits) {
							var dashboard = _.find(hits, {
								title: linkDashboard
							});

							if (dashboard) {
								$("#link").val('dashboard/' + dashboard.uri);
								link.title = dashboard.title;
								$("#dashboardName").val(dashboard.title);
							} else {
								$("#link").val('');
								$("#dashboardName").val('');
							}
						});
					}
				}]);

				return RectangularTreeCtrl;
			}(OgeAlertMetricsPanelCtrl));

			_export('RectangularTreeCtrl', RectangularTreeCtrl);

			RectangularTreeCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=tree_ctrl.js.map
