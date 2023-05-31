'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, $, _createClass, panelDefaults, SelectCtrl;

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
				selectTargets: [],
				manageA1A2Value: "", //省份
				manageANValue: "", //电厂
				facilityF0Value: "", //机组
				likeSearch: "", //普通查询
				kksType: 0, //见kksOption
				waveType: 0, //波形类型
				selectedWaveTime: "", //已选择波形时间
				isInit: true, //是否初始化页面（没有刷新页面）
				tempInfo: "请选择数据",
				renderType: -1, //刷新事件，-1不刷新数据，0重新取kdm kks，1获取model， 2 获取波形时间, 3 先获取kdm kks然后在获取波形时间, 4获取模型时间
				queryVariable: ""
			};

			_export('SelectCtrl', SelectCtrl = function (_MetricsPanelCtrl) {
				_inherits(SelectCtrl, _MetricsPanelCtrl);

				function SelectCtrl($scope, $injector, $rootScope, $timeout) {
					_classCallCheck(this, SelectCtrl);

					var _this = _possibleConstructorReturn(this, (SelectCtrl.__proto__ || Object.getPrototypeOf(SelectCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_this.$timeout = $timeout;
					_this.$scope = $scope;
					_.defaults(_this.panel, panelDefaults);

					_this.panel.manageA1A2ValueOptions = [];
					_this.panel.manageANValueOptions = [];
					_this.panel.facilityF0ValueOptions = [];
					_this.panel.waterfallWaveValueOptions = [];
					_this.panel.waterfallFloatValueOptions = [];

					_this.panel.kksOption = [{ name: "数值分析", value: 0 }, { name: "3D模型分析", value: 1 }, { name: "频谱分析", value: 2 }, { name: "气隙分析", value: 3 }, { name: "轴线分析", value: 4 }, { name: "瀑布模型分析", value: 5 }];

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('panel-teardown', _this.onRemoveCache.bind(_this)); //卸载
					_this.panel.isInit = true;

					_this.variable = { "current": {}, "options": [], multi: true, search: {} };
					_this.variableObj = {
						oldVariableText: "",
						selectedValues: [],
						search: {
							query: ''
						},
						dropdownVisible: false
					};
					_this.timeVariable = { "current": {}, "options": [], multi: true, search: {} };
					if (_this.panel.kksType == 1) {
						_this.variable = { "current": {}, "options": [], search: {} };
					}
					_this.variable.current = { "text": "请选择kks", "value": "" };
					_this.variable.options = [];
					_this.timeVariable.current = { "text": "请选择kks", "value": "" };
					_this.timeVariable.options = [];
					_this.KKS_SPACE_NAMES = [{ name: "上导轴承X向摆度波形", kks: "EB000HP1MKC01MK012BL01J1CC001CA01", optional: false }, { name: "上导轴承Y向摆度波形", kks: "EB000HP1MKC01MK012BN01J1CC001CA01", optional: false }, { name: "下导轴承X向摆度波形", kks: "EB000HP1MKD01MK012BL01J1CC001CA01", optional: false }, { name: "下导轴承Y向摆度波形", kks: "EB000HP1MKD01MK012BN01J1CC001CA01", optional: false }, { name: "水导轴承X向摆度波形", kks: "EB000HP1MEC01ME010BL01J1CC001CA01", optional: false }, { name: "水导轴承Y向摆度波形", kks: "EB000HP1MEC01ME010BN01J1CC001CA01", optional: false }, { name: "上机架X向振动波形", kks: "EB000HP1MKC01MK011BL01J1CB001CA01", optional: true }, { name: "上机架Y向振动波形", kks: "EB000HP1MKC01MK011BN01J1CB001CA01", optional: true }, { name: "下机架X向振动波形", kks: "EB000HP1MKD01MK011BL01J1CB001CA01", optional: true }, { name: "下机架Y向振动波形", kks: "EB000HP1MKD01MK011BN01J1CB001CA01", optional: true }, { name: "顶盖X向振动波形", kks: "EB000HP1MEJ01ME029BL01J1CB001CA01", optional: true }, { name: "顶盖Y向振动波形", kks: "EB000HP1MEJ01ME029BN01J1CB001CA01", optional: true }];
					_this.KKS_AIRGAP_NAMES = [{ name: "+X方向气隙波形", kks: "EB000HP1MKA01MK016BL01J1CA004CA01", optional: false }, { name: "+X+Y方向气隙波形", kks: "EB000HP1MKA01MK016BM01J1CA004CA01", optional: true }, { name: "+Y方向气隙波形", kks: "EB000HP1MKA01MK016BN01J1CA004CA01", optional: false }, { name: "-X+Y方向气隙波形", kks: "EB000HP1MKA01MK016BP01J1CA004CA01", optional: true }, { name: "-X方向气隙波形", kks: "EB000HP1MKA01MK016BR01J1CA004CA01", optional: false }, { name: "-X-Y方向气隙波形", kks: "EB000HP1MKA01MK016BQ01J1CA004CA01", optional: true }, { name: "-Y方向气隙波形", kks: "EB000HP1MKA01MK016BS01J1CA004CA01", optional: false }, { name: "+X-Y方向气隙波形", kks: "EB000HP1MKA01MK016BT01J1CA004CA01", optional: true }];
					_this.type5WaveTimeList = [];
					_this.type5FloatTimeList = [];
					return _this;
				}

				_createClass(SelectCtrl, [{
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						var _this2 = this;

						if (!this.panel.isInit) {
							return;
						}

						//从kdm link数据源获取机组数据
						if (this.datasource.type === "kdm-link") {
							this.initKDMLinkThreeSelect();
							this.onDataReceivedImpl();
							return;
						}

						//从kdm数据源获取数据（兼容老版本kdm数据源）
						if (this.datasource.type === "oge-rtdata") {
							this.initKDMPluginThreeSelect().then(function (unitData) {
								_this2.panel.manageA1A2ValueOptions = unitData.data;
								_this2.onDataReceivedImpl();
							});
							return;
						}

						//新版kdm数据源（新版本数据源；推荐）
						if (this.datasource.type === "oge-kdm") {
							this.initKDMThreeSelect().done(function (unitData) {
								// this.panel.manageA1A2ValueOptions = unitData.data;
								_this2.initKDMThreeSelectData(unitData.KKSTreeNodes);
								_this2.onDataReceivedImpl();
							}).catch(function (err) {
								console.error("请确认连接的是kdm网关，否则会产生跨域问题");
							});
							return;
						}
					}
				}, {
					key: 'initKDMLinkThreeSelect',
					value: function initKDMLinkThreeSelect() {
						var manageA1A2Arr = this.datasource.manageA1A2.split(",");
						var manageANArr = this.datasource.manageAN.split(",");
						var facilityF0Arr = this.datasource.facilityF0.split(",");
						var data = [];
						for (var a = 0; a < manageA1A2Arr.length; a++) {
							var manageA1A2 = { "myself": manageA1A2Arr[a].split(":")[0], "value": manageA1A2Arr[a].split(":")[1], data: [] };
							for (var b = 0; b < manageANArr.length; b++) {
								var manageAN = { "myself": manageANArr[b].split(":")[0], "value": manageANArr[b].split(":")[1], data: [] };
								for (var c = 0; c < facilityF0Arr.length; c++) {
									var facilityF0 = { "myself": facilityF0Arr[c].split(":")[0], "value": facilityF0Arr[c].split(":")[1] };
									manageAN.data.push(facilityF0);
								}
								manageA1A2.data.push(manageAN);
							}
							data.push(manageA1A2);
						}
						this.panel.manageA1A2ValueOptions = data;
					}
				}, {
					key: 'initKDMPluginThreeSelect',
					value: function initKDMPluginThreeSelect() {
						var postData = {
							kdmUrl: this.datasource.kdmUrl,
							init: "true"
						};
						return this.getAjaxPromise(postData, this.datasource.url + '/trend/getChooseBoxData');
					}
				}, {
					key: 'initKDMThreeSelect',
					value: function initKDMThreeSelect() {
						var postData = {
							method: 'getKKSTreeByField',
							"field": "facilityF0"
						};
						// return this.getAjaxPromise(postData, this.datasource.url + '/kdmService/rest/1.0/kksInfo');
						return this.getAjaxPromise(postData, this.datasource.url + '/kksInfo');
					}
				}, {
					key: 'initKDMThreeSelectData',
					value: function initKDMThreeSelectData(data) {
						var arr = [];
						for (var i = 0; i < data.length; i++) {
							var obj = { "myself": data[i].codeName, "value": data[i].code, data: [] };
							if (!data[i].children) continue;
							for (var a = 0; a < data[i].children.length; a++) {
								var val = data[i].children[a];
								var obj2 = { "myself": val.codeName, "value": val.code, data: [] };
								if (!val.children) continue;
								for (var b = 0; b < val.children.length; b++) {
									var val2 = val.children[b];
									if (!val2.children) continue;
									for (var c = 0; c < val2.children.length; c++) {
										var val3 = val2.children[c];
										var obj3 = { "myself": val3.codeName, "value": val3.code };
										obj2.data.push(obj3);
									}
								}
								obj.data.push(obj2);
							}
							arr.push(obj);
						}
						this.panel.manageA1A2ValueOptions = arr;
					}
				}, {
					key: 'onDataReceivedImpl',
					value: function onDataReceivedImpl() {
						//回显下拉框数据
						if (this.panel.manageA1A2Value != null) {
							this.changeA1A2();
						}
						if (this.panel.manageANValue != null) {
							this.changeAN();
						}

						this.render();

						//刷新其他控件（使用参数避免一直刷新）
						if (this.panel.isInit) {
							this.panel.selectTargets = []; // 初始化不限时任何点
							this.panel.timeOption = [];
							this.freshPage();
							this.panel.isInit = false;
						}
					}
				}, {
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge-kdm-selector/editor.html', 2);
					}
				}, {
					key: 'onRemoveCache',
					value: function onRemoveCache() {
						this.templateSrv.selectTargets = [];
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'changeA1A2',
					value: function changeA1A2() {
						for (var i = 0; i < this.panel.manageA1A2ValueOptions.length; i++) {
							if (this.panel.manageA1A2Value == this.panel.manageA1A2ValueOptions[i].value) {
								this.panel.manageANValueOptions = this.panel.manageA1A2ValueOptions[i].data;
								break;
							}
						}
					}
				}, {
					key: 'changeAN',
					value: function changeAN() {
						for (var i = 0; i < this.panel.manageANValueOptions.length; i++) {
							if (this.panel.manageANValue == this.panel.manageANValueOptions[i].value) {
								this.panel.facilityF0ValueOptions = this.panel.manageANValueOptions[i].data;
								break;
							}
						}
					}
				}, {
					key: 'queryData',
					value: function queryData() {
						this.searchKKS();
						this.setSelectInfo();
						this.render();
					}
				}, {
					key: 'searchKDMkks',
					value: function searchKDMkks(query) {
						var postData = {
							method: 'searchKKSInfos',
							"fields": "kksCode,kksName",
							"orderby": "[('kksCode', 'DESC')]",
							"query": query,
							"offset": 1,
							"limit": 2000
						};
						return this.getAjaxPromise(postData, this.datasource.url + '/kksInfo');
					}
				}, {
					key: 'searchKKS',
					value: function searchKKS() {
						var _this3 = this;

						var obj = this;
						this.panel.selectTargets = [];
						if (!this.panel.manageA1A2Value || !this.panel.manageANValue || !(this.panel.facilityF0Value >= 0)) return;
						//气隙，直接通过kksStart获取时间列表
						if (this.panel.kksType === 3 && this.datasource.type === "kdm-link") {
							var xids = this.panel.manageA1A2Value + this.panel.manageANValue + this.panel.facilityF0Value;
							var kksArr = this.getAirgapKKS(xids);
							this.panel.selectTargets.push(xids);
							this.datasource.doImpl("getPointId", kksArr[0]).then(function (idResult) {
								var start = obj.timeSrv.timeRange().from._d.getTime();
								var end = obj.timeSrv.timeRange().to._d.getTime(); //link link区间查询
								var options = { "id": idResult.data.id, "start": start, "end": end };

								obj.datasource.doImpl('searchWaveTime', options).then(function (result) {
									var timesList = [];
									for (var i = 0; i < result.data.length; i++) {
										timesList[i] = obj.getTimesByLongTime(result.data[i]);
									}
									obj.timeList = timesList;
									obj.render();
								});
							});
							return;
						}

						if (this.datasource.type === "oge-kdm") {
							var query = '';
							if (this.panel.kksType == 0 || this.panel.kksType == 5 && this.panel.waterfallWaveValueOptions.length > 0) {
								query = "['&', '&', ('valueB1B2', '!=', 'CB'), ('valueB1B2', '!=', 'CA') ,'&', ('manageA1A2', '=', '" + this.panel.manageA1A2Value + "'), '&', ('manageAN', '=', '" + this.panel.manageANValue + "'), ('facilityF0', '=', '" + this.panel.facilityF0Value + "')]";
							} else if (this.panel.kksType == 1) {
								query = "['&', '|', ('kksCode','like','%模型%'),('kksName','like','%模型'), '&', ('manageA1A2', '=', '" + this.panel.manageA1A2Value + "'), '&', ('manageAN', '=', '" + this.panel.manageANValue + "'), ('facilityF0', '=', '" + this.panel.facilityF0Value + "')]";
							} else if (this.panel.kksType == 2 || this.panel.kksType == 5) {
								query = "['&', '|', ('valueB1B2', '=', 'CB'), ('valueB1B2', '=', 'CA') ,'&', ('manageA1A2', '=', '" + this.panel.manageA1A2Value + "'), '&', ('manageAN', '=', '" + this.panel.manageANValue + "'), ('facilityF0', '=', '" + this.panel.facilityF0Value + "')]";
							} else if (this.panel.kksType == 3) {
								query = this.getAirORSpaceQuery(this.KKS_AIRGAP_NAMES);
							} else {
								query = this.getAirORSpaceQuery(this.KKS_SPACE_NAMES);
							}
							this.dealKDMData(query);
							return;
						}

						this.getChooseBoxData().then(function (kksList) {
							if (kksList == null) {
								return;
							}
							if (_this3.datasource.type === "kdm-link" && (_this3.panel.kksType === 0 || _this3.panel.kksType === 2)) {
								var kksData = [];
								for (var i = 0; i < kksList.data.items.length; i++) {
									var obj1 = { "kksCode": kksList.data.items[i].xid, "kksName": kksList.data.items[i].name };
									kksData.push(obj1);
								}
								kksList.data = kksData;
								console.log("read kdm link data == " + kksList.data.length);
							} else if (_this3.datasource.type === "kdm-link" && _this3.panel.kksType === 4) {
								//与kdm 接口返回一致，不处理
							}

							if (_this3.panel.kksType !== 3 && _this3.panel.kksType != 4 && _this3.panel.selectTargets.length > 0) {
								var kksData = kksList.data;
								for (var i = 0; i < kksData.length; i++) {
									var key = "";
									if (_this3.panel.kksType == 2) {
										//模型
										key = kksData[i].name;
									} else {
										key = kksData[i].kksCode + "_" + kksData[i].kksName;
									}
									if (_this3.panel.selectTargets.indexOf(key) != -1) {
										kksList.data[i].checked = true;
									}
								}
							}

							//继续选择kks，getSelectValue
							var kksData = kksList.data;
							if (_this3.panel.kksType <= 2) {
								var options = [];
								for (var i = 0; i < kksData.length; i++) {
									options[i] = {
										"text": kksData[i].kksName,
										"value": kksData[i].kksCode,
										"selected": false
									};
								}
								_this3.variable.options = options;
								_this3.render();
								return;
							}

							//直接选择kks，获取时间
							_this3.panel.selectTargets = [];
							if (_this3.datasource.type === "kdm-link") {
								for (var _i = 0; _i < kksData.length; _i++) {
									var kks = kksData[_i].kks;
									_this3.panel.selectTargets.push(kks);
								}
								var start = _this3.timeSrv.timeRange().from._d.getTime();
								var end = _this3.timeSrv.timeRange().to._d.getTime(); //link link区间查询
								var options = { "id": kksData[0].id, "start": start, "end": end };

								_this3.datasource.doImpl('searchWaveTime', options).then(function (result) {
									var timesList = [];
									for (var i = 0; i < result.data.length; i++) {
										timesList[i] = _this3.getTimesByLongTime(result.data[i]);
									}
									_this3.timeList = timesList;
									_this3.render();
								});
							} else {
								for (var _i2 = 0; _i2 < kksData.length; _i2++) {
									var _kks = kksData[_i2].kksCode;
									_this3.panel.selectTargets.push(_kks);
								}
								_this3.getTimeList(_this3.panel.selectTargets, "getWaveTimeList").done(function (result) {
									obj.$scope.$apply(function () {
										_this3.timeList = result;
										_this3.render();
									});
								});
							}
						});
					}
				}, {
					key: 'getAirORSpaceQuery',
					value: function getAirORSpaceQuery(kksA) {
						var start = this.panel.manageA1A2Value + this.panel.manageANValue;
						var query = "['|'";
						for (var i = 0; i < kksA.length; i++) {
							var newkks = kksA[i].kks.replace(/^(\w{0})\w{5}(.*)$/, '$1' + start + '$2').replace(/^(\w{7})\w{1}(.*)$/, '$1' + this.panel.facilityF0Value + '$2');
							if (i == 1 || i == kksA.length - 1) {
								query += ",('kksCode','=','" + newkks + "')";
							} else {
								query += ",'|', ('kksCode','=','" + newkks + "')";
							}
						}
						query += "]";
						return query;
					}
				}, {
					key: 'getChooseBoxData',
					value: function getChooseBoxData() {
						var xids = this.panel.manageA1A2Value + this.panel.manageANValue + this.panel.facilityF0Value;
						if (this.datasource.type === "kdm-link" && (this.panel.kksType === 0 || this.panel.kksType === 2)) {
							var rql = '';
							if (this.panel.kksType === 0) {
								rql = '&or(like(name,*非波形*),like(xid,*' + xids + '*))&sort(xid,name)&limit(50)';
							} else {
								rql = '&and(like(name,*波形*),like(xid,*' + xids + '*))&sort(xid,name)&limit(50)';
							}
							return this.datasource.doImpl('searchPoints', rql);
						} else if (this.datasource.type === "kdm-link" && this.panel.kksType === 1) {
							console.warn("kdm link数据源不支持获取3d模型数据");
							return;
						} else if (this.datasource.type === "kdm-link" && this.panel.kksType === 4) {
							return this.datasource.doImpl('searchSpaceKKS', xids);
						}

						var postData = {
							kdmUrl: this.datasource.kdmUrl,
							kksType: this.panel.kksType
						};
						if (this.panel.facilityF0Value != null) {
							postData.manageA1A2Value = this.panel.manageA1A2Value;
							postData.manageANValue = this.panel.manageANValue;
							postData.facilityF0Value = this.panel.facilityF0Value;
						}
						//获取编码
						if (postData.kksType === 3 || postData.kksType === 4) {
							var kksCodes = [];
							for (var i = 1; i < this.panel.targets.length; i++) {
								var item = this.panel.targets[i];
								kksCodes.push(item.target);
							}
							postData.target = kksCodes.join(",");
						}

						return $.ajax({
							type: 'POST',
							url: this.datasource.url + '/trend/getChooseBoxData',
							data: postData,
							dataType: 'json'
						});
					}
				}, {
					key: 'getSelectValue',
					value: async function getSelectValue(strinVal) {
						var _this4 = this;

						var selectTargets = [];
						if (this.panel.kksType == 0 || this.panel.kksType == 2) {
							var selectedArr = this.variable.current.value;
							var texts = this.variable.current.text;
							var textArr = texts.split(" + ");
							for (var i = 0; i < selectedArr.length; i++) {
								selectTargets[i] = selectedArr[i] + "_" + textArr[i];
							}
						} else {
							selectTargets = [this.variable.current.value + "_" + this.variable.current.text];
						}
						this.panel.selectTargets = selectTargets;
						this.setSelectInfo();

						if (this.panel.kksType == 0) {
							this.freshPage();
							this.render();
							return;
						} else if (this.panel.kksType == 1) {
							var obj = this;
							this.getKPITimeList(selectTargets).then(function (result) {
								var timesListA = [];
								if (result.d3_model_times && result.d3_model_times.time && result.d3_model_times.time.length > 0) {
									for (var i = 0; i < result.d3_model_times.time.length; i++) {
										timesListA[i] = obj.getTimesByLongTime(result.d3_model_times.time[i].datetime);
									}
								}
								obj.timeList = timesListA;
								obj.render();
							});
						} else if (this.panel.kksType == 2 && this.datasource.type === "kdm-link") {
							var obj = this;
							var xid = obj.variable.current.value[0];
							this.datasource.doImpl("getPointId", xid).then(function (idResult) {
								var start = obj.timeSrv.timeRange().from._d.getTime();
								var end = obj.timeSrv.timeRange().to._d.getTime(); //link link区间查询
								var options = { "id": idResult.data.id, "start": start, "end": end };

								obj.datasource.doImpl('searchWaveTime', options).then(function (result) {
									var timesList = [];
									for (var i = 0; i < result.data.length; i++) {
										timesList[i] = obj.getTimesByLongTime(result.data[i]);
									}
									obj.timeList = timesList;
									obj.render();
								});
							});
						} else if (this.datasource.type === "oge-kdm") {
							var obj = this;
							var curVal = this.variable.current.value;
							if (strinVal == 'wave') {
								curVal = [this.panel.waterfallWaveValue];
							} else if (strinVal == 'float') {
								curVal = [this.panel.waterfallFloatValue];
							}

							this.getWaveTimeListH(curVal).then(function (data) {
								var timesListA = [];
								if (data.RTDataSets && data.RTDataSets[0].RTDataValues && data.RTDataSets[0].RTDataValues.length > 0) {
									for (var i = 0; i < data.RTDataSets[0].RTDataValues.length; i++) {
										timesListA[i] = obj.getTimesByLongTime(data.RTDataSets[0].RTDataValues[i].Time);
									}
								}
								if (_this4.panel.kksType == 5) {
									if (strinVal == 'wave') {
										obj.type5WaveTimeList = timesListA;
									} else {
										obj.type5FloatTimeList = timesListA;
									}
									if (!obj.panel.waterfallWaveValue || !obj.panel.waterfallFloatValue) return;
									obj.dealType5Time();
								}
								_this4.$scope.$apply(function () {
									obj.timeList = timesListA;
									obj.render();
								});
							});
						} else {
							this.getTimeList(selectTargets, "getWaveTimeList").done(function (result) {
								_this4.$scope.$apply(function () {
									_this4.timeList = result;
									_this4.render();
								});
							});
						}
					}
				}, {
					key: 'dealKDMData',
					value: function dealKDMData(query) {
						var _this5 = this;

						this.searchKDMkks(query).then(function (data) {
							if (_this5.panel.kksType !== 3 && _this5.panel.kksType != 4 && _this5.panel.selectTargets.length > 0) {
								var kksData = data.KKSInfos;
								for (var i = 0; i < kksData.length; i++) {
									var key = "";
									if (_this5.panel.kksType == 2) {
										//模型
										key = kksData[i].kksName;
									} else {
										key = kksData[i].kksCode + "_" + kksData[i].kksName;
									}
									if (_this5.panel.selectTargets.indexOf(key) != -1) {
										data.KKSInfos[i].checked = true;
									}
								}
							}
							//继续选择kks，getSelectValue
							var kksData = data.KKSInfos;
							if (_this5.panel.kksType <= 2 || _this5.panel.kksType == 5) {
								var options = [];
								for (var i = 0; i < kksData.length; i++) {
									options[i] = {
										"text": kksData[i].kksName,
										"value": kksData[i].kksCode,
										"selected": false
									};
								}
								if (_this5.panel.kksType == 5) {
									var reg = /^.{29}[C].{3}$/;
									if (kksData && kksData[0] && kksData[0].kksCode && reg.test(kksData[0].kksCode)) {
										_this5.panel.waterfallWaveValueOptions = options;
										_this5.searchKKS();
									} else {
										_this5.panel.waterfallFloatValueOptions = options;
									}
								} else {
									_this5.$scope.$apply(function () {
										_this5.variable.options = options;
									});
								}
								_this5.render();
								return;
							}

							//直接选择kks，获取时间
							_this5.panel.selectTargets = [];
							var newArr = [];
							var sortArr = _this5.KKS_AIRGAP_NAMES;
							if (_this5.panel.kksType === 4) {
								sortArr = _this5.KKS_SPACE_NAMES;
							}
							for (var j = 0; j < sortArr.length; j++) {
								for (var _i3 = 0; _i3 < kksData.length; _i3++) {
									var kks = kksData[_i3].kksCode;
									if (sortArr[j].kks.slice(8) == kks.slice(8)) {
										_this5.panel.selectTargets.push(kks + '_' + kksData[_i3].kksName);
										newArr.push(kks);
									}
								}
							}
							var obj = _this5;
							_this5.getWaveTimeListH(newArr).then(function (result) {
								var timesListA = [];
								if (result.RTDataSets && result.RTDataSets[0].RTDataValues && result.RTDataSets[0].RTDataValues.length > 0) {
									for (var i = 0; i < result.RTDataSets[0].RTDataValues.length; i++) {
										timesListA[i] = obj.getTimesByLongTime(result.RTDataSets[0].RTDataValues[i].Time);
									}
								}
								obj.$scope.$apply(function () {
									obj.timeList = timesListA;
									obj.render();
									return;
								});
							});
						});
					}
				}, {
					key: 'dealType5Time',
					value: function dealType5Time() {
						var obj = this;
						if (this.type5WaveTimeList.length > 0 && this.type5FloatTimeList.length > 0) {
							this.timeVariable.options = [];
							this.type5WaveTimeList.forEach(function (timeW) {
								if (obj.type5FloatTimeList.indexOf(timeW) >= 0) {
									obj.timeVariable.options.push({ text: timeW, value: timeW });
								} else {
									var minArr = [];
									for (var i = 0; i < obj.type5FloatTimeList.length; i++) {
										minArr.push(Math.abs(obj.type5FloatTimeList[i] - timeW));
									}
									var minInd = that.minVal(minArr);
									obj.timeVariable.options.push({ text: obj.type5FloatTimeList[minInd], value: timeW });
								}
							});
						}
					}
				}, {
					key: 'minVal',
					value: function minVal(arr) {
						var min = arr[0];
						var minInd = 0;
						for (var i = 0; i < arr.length; i++) {
							if (min > arr[i]) {
								min = arr[i];
								minInd = i;
							}
						}
						return minInd;
					}
				}, {
					key: 'getSelectTime',
					value: function getSelectTime() {
						this.templateSrv.wave_kks = this.panel.selectTargets;
						this.templateSrv.wave_time = this.panel.dataTime;
						this.templateSrv.page_name = this.dashboard.meta.slug;
						this.freshPage();
					}
				}, {
					key: 'freshPage',
					value: function freshPage() {
						this.templateSrv.selectTargets = this.panel.selectTargets;
						this.timeSrv.refreshDashboard();
					}
				}, {
					key: 'getAirgapKKS',
					value: function getAirgapKKS(kksStart) {
						var kksOther = ["MKA01MK016", "01J1CA004CA01"];
						var results = [];
						var POSITION = ["BL", "BM", "BN", "BP", "BQ", "BR", "BS", "BT"]; // 气隙部位
						for (var i = 0; i < POSITION.length; i++) {
							results.push(kksStart + kksOther[0] + POSITION[i] + kksOther[1]);
						}
						return results;
					}
				}, {
					key: 'setSelectInfo',
					value: function setSelectInfo() {
						if (this.panel.selectTargets.length === 0) {
							this.panel.tempInfo = "请选择数据";
							return;
						}
						if (this.panel.kksType === 0 || this.panel.kksType === 2) {
							this.panel.tempInfo = "已选择" + this.panel.selectTargets.length + "条数据";
						} else {
							this.panel.tempInfo = this.variable.current.text;
						}
					}
				}, {
					key: 'changeViewIndex',
					value: function changeViewIndex(index) {
						this.panel.viewIndex = index;
						this.render();
					}
				}, {
					key: 'getTimesByLongTime',
					value: function getTimesByLongTime(time) {
						var myDate = new Date(time);
						var times = this.fullTime(myDate.getFullYear());
						times += "-" + this.fullTime(myDate.getMonth() + 1);
						times += "-" + this.fullTime(myDate.getDate());
						times += " " + this.fullTime(myDate.getHours());
						times += ":" + this.fullTime(myDate.getMinutes());
						times += ":" + this.fullTime(myDate.getSeconds());
						return times;
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
					key: 'getTimeList',
					value: function getTimeList(kksInfo, url) {
						var postData = {
							kdmUrl: this.datasource.kdmUrl
						};
						postData.startTimes = this.getTimesByLongTime(this.timeSrv.timeRange().from._d);
						postData.endTimes = this.getTimesByLongTime(this.timeSrv.timeRange().to._d);
						postData.kksInfo = kksInfo.join(",");

						return $.ajax({
							type: 'POST',
							url: this.datasource.url + '/trend/' + url,
							data: postData,
							dataType: 'json'
						});
					}
				}, {
					key: 'getKPITimeList',
					value: function getKPITimeList(kksInfo) {
						if (!kksInfo || kksInfo.length < 0) return;
						var startTimes = this.timeSrv.timeRange().from._d.getTime();
						var endTimes = this.timeSrv.timeRange().to._d.getTime();
						var kksIn = kksInfo[0].indexOf('_') > 0 ? kksInfo[0].split('_')[0] : kksInfo[0];
						return $.ajax({
							type: 'GET',
							url: this.datasource.url + '/services/kpi_datas/d3model/times/' + kksIn + '/' + startTimes + '/' + endTimes,
							dataType: 'json'
						});
					}
				}, {
					key: 'getWaveTimeListH',
					value: function getWaveTimeListH(kksInfo) {
						var postData = {
							method: 'getRTDataHistory',
							startTime: this.timeSrv.timeRange().from._d.getTime(),
							endTime: this.timeSrv.timeRange().to._d.getTime(),
							kksCodes: kksInfo.join(","),
							resultType: 1
						};
						// return this.getAjaxPromise(postData, this.datasource.url + '/kdmService/rest/1.0/kksData');
						return this.getAjaxPromise(postData, this.datasource.url + '/kksData');
					}
				}, {
					key: 'getAjaxPromise',
					value: function getAjaxPromise(postData, requestUrl, headers) {
						return $.ajax({
							type: 'POST',
							url: requestUrl,
							data: postData,
							dataType: "json",
							headers: headers
						});
					}
				}, {
					key: 'queryChangedText',
					value: function queryChangedText() {
						var query = "['&', '&', ('valueB1B2', '!=', 'CB'), ('valueB1B2', '!=', 'CA') ,'&', ('manageA1A2', '=', '" + this.panel.manageA1A2Value + "'), '&', ('manageAN', '=', '" + this.panel.manageANValue + "'), ('facilityF0', '=', '" + this.panel.facilityF0Value + "')]";
						if (this.variableObj.search.query) {
							if (this.variableObj.search.query.length > 1) {
								query = "['&', '|', ('kksCode','like','%" + this.variableObj.search.query + "%'), ('kksName','like','%" + this.variableObj.search.query + "%'), '&', ('valueB1B2', '!=', 'CB'), '&', ('valueB1B2', '!=', 'CA') ,'&', ('manageA1A2', '=', '" + this.panel.manageA1A2Value + "'), '&', ('manageAN', '=', '" + this.panel.manageANValue + "'), ('facilityF0', '=', '" + this.panel.facilityF0Value + "')]";
							} else {
								return;
							}
						}
						this.dealKDMData(query);
					}
				}, {
					key: 'show',
					value: function show() {
						this.variableObj.oldVariableText = this.variable.current.text;

						this.variableObj.selectedValues = _.filter(this.variable.options, { selected: true });

						this.variableObj.search = {
							query: ''
						};

						this.variableObj.dropdownVisible = true;
						this.openDropdown();
					}
				}, {
					key: 'clearSelections',
					value: function clearSelections() {
						_.each(this.variable.options, function (option) {
							option.selected = false;
						});

						this.selectionsChanged();
					}
				}, {
					key: 'selectionsChanged',
					value: function selectionsChanged(commitChange) {
						this.variableObj.selectedValues = _.filter(this.variable.options, { selected: true });

						if (this.variableObj.selectedValues.length > 1) {
							if (this.variableObj.selectedValues[0].text === 'All') {
								this.variableObj.selectedValues[0].selected = false;
								this.variableObj.selectedValues = this.variableObj.selectedValues.slice(1, this.variableObj.selectedValues.length);
							}
						}

						this.variable.current.value = _.map(this.variableObj.selectedValues, 'value');
						this.variable.current.text = _.map(this.variableObj.selectedValues, 'text').join(' + ');

						if (commitChange) {
							this.commitChanges();
						}
					}
				}, {
					key: 'selectValue',
					value: function selectValue(option, event) {
						var _this6 = this;

						if (!option) {
							return;
						}

						option.selected = !option.selected;

						var commitChange = commitChange || false;

						var setAllExceptCurrentTo = function setAllExceptCurrentTo(newValue) {
							_.each(_this6.variable.options, function (other) {
								if (option !== other) {
									other.selected = newValue;
								}
							});
						};

						if (option.text === 'All') {
							setAllExceptCurrentTo(false);
							commitChange = true;
						}

						this.selectionsChanged(commitChange);
					}
				}, {
					key: 'commitChanges',
					value: function commitChanges() {
						// if we have a search query and no options use that
						if (this.variable.options.length === 0 && this.variableObj.search.query.length > 0) {
							this.variable.current = { text: this.variableObj.search.query, value: this.variableObj.search.query };
						} else if (this.variable.options.length > 0 && this.variableObj.selectedValues.length === 0) {
							// make sure one option is selected
							this.variable.options[0].selected = true;
							this.selectionsChanged(false);
						}

						this.variableObj.dropdownVisible = false;
						this.switchToLink();

						// if (this.variable.current.text !== this.variableObj.oldVariableText) {
						this.getSelectValue();
						// }
					}
				}, {
					key: 'openDropdown',
					value: function openDropdown() {
						var that = this;
						$(".multi-input-selectorclass").css('width', Math.max($(".multi-alink-selectorclass").width(), 80) + 'px');

						$(".multi-input-selectorclass").show();
						$(".multi-alink-selectorclass").hide();

						$(".multi-input-selectorclass").focus();
						$(document).ready(function () {
							$(document.body).click(function (e) {
								that.bodyOnClick(e);
							});
						});
					}
				}, {
					key: 'switchToLink',
					value: function switchToLink() {
						$(".multi-input-selectorclass").hide();
						$(".multi-alink-selectorclass").show();
					}
				}, {
					key: 'bodyOnClick',
					value: function bodyOnClick(e) {
						var _this7 = this;

						if ($('.multi-selector-all').has(e.target).length === 0) {
							this.$scope.$apply(function () {
								if (document.location.pathname.indexOf(_this7.dashboard.uid) > -1) {
									_this7.commitChanges();
								}
							});
						}
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {

						ctrl.events.on('render', function () {
							elem.find(".variable-value-link").html(ctrl.panel.tempInfo + " <i class='fa fa-caret-down'></i>");

							if (ctrl.timeList) {
								ctrl.panel.timeOption = ctrl.timeList;
							}

							elem.find(".variable-link-wrapper").css({
								"width": "100%"
							});
							elem.find(".variable-value-link").css({
								"background-color": "#333",
								"margin-right": "0px"
							});
							elem.find(".fa-caret-down").css({
								"float": "right",
								"margin-right": "-4px"
							});
							//elem.find(".gf-form-input").css({"width":"100%"});
						});
					}
				}]);

				return SelectCtrl;
			}(MetricsPanelCtrl));

			_export('SelectCtrl', SelectCtrl);

			SelectCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=selector_ctrl.js.map
