'use strict';

System.register(['app/plugins/sdk', 'lodash', 'jquery', './css/map-panel.css!', './libs/echarts'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, $, echarts, _createClass, panelOptionDefaults, myChart, loadPoint, sourcePonits, columns, ProvinceMapPanelCtrl;

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
		}, function (_lodash) {
			_ = _lodash.default;
		}, function (_jquery) {
			$ = _jquery.default;
		}, function (_cssMapPanelCss) {}, function (_libsEcharts) {
			echarts = _libsEcharts.default;
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
				bgColor: '#404a59',
				province: 'china',
				points: [],
				sourceP: {
					description: '',
					link: {
						url: '',
						targetBlank: true
					}
				},
				currentName: '',
				currentJson: '',
				pointStyle: '',
				showLabel: true,
				labelColor: '#ccc',
				areaColor: '#323c48',
				borderColor: '#111',
				emShowLabel: true,
				emLabelColor: '#ccc',
				emAreaColor: '#2a333d',
				emBorderColor: '#2a333d',
				symbolStyle: 'pin',
				symbolSize: 20,
				symbolColor: 'blue',
				emSymbolColor: 'blue'
			};
			loadPoint = false;
			sourcePonits = [];
			columns = [];

			_export('ProvinceMapPanelCtrl', ProvinceMapPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(ProvinceMapPanelCtrl, _MetricsPanelCtrl);

				/** @ngInject */
				function ProvinceMapPanelCtrl($scope, $injector, templateSrv) {
					_classCallCheck(this, ProvinceMapPanelCtrl);

					var _this = _possibleConstructorReturn(this, (ProvinceMapPanelCtrl.__proto__ || Object.getPrototypeOf(ProvinceMapPanelCtrl)).call(this, $scope, $injector));

					_this.templateSrv = templateSrv;
					_.defaults(_this.panel, panelOptionDefaults);
					_this.cityMap = {
						"全国": "china",
						"安徽": "340000",
						"澳门": '820000',
						"北京": '110000',
						"重庆": '500000',
						"福建": '350000',
						"甘肃": '620000',
						"广东": '440000',
						"广西": "450000",
						"贵州": '520000',
						"海南": '460000',
						"河北": '130000',
						"黑龙江": '230000',
						"河南": '410000',
						"湖北": '420000',
						"湖南": '430000',
						"江苏": '320000',
						"江西": '360000',
						"吉林": '220000',
						"辽宁": '210000',
						"内蒙古": '150000',
						"宁夏": '640000',
						"青海": '630000',
						"山东": '370000',
						"上海": '310000',
						"山西": '140000',
						"四川": '510000',
						"台湾": '710000',
						"天津": '120000',
						"新疆": '650000',
						"陕西": '610000',
						"西藏": '540000',
						"云南": '530000',
						"浙江": '330000',
						"香港": '810000'
					};
					_this.symbol = [{ name: '圆形', value: 'circle' }, { name: '矩形', value: 'rect' }, { name: '圆角矩形', value: 'roundRect' }, { name: '三角形', value: 'triangle' }, { name: '菱形', value: 'diamond' }, { name: '钉形', value: 'pin' }, { name: '箭头', value: 'arrow' }, { name: '自定义', value: 'none' }];
					_this.mapElem = [];
					_this.data = [];
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('render', _this.onRender.bind(_this));

					return _this;
				}

				_createClass(ProvinceMapPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_province_map/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						if (dataList && dataList[0] && dataList[0].rows) {
							this.data = dataList[0];
							columns = [];
							for (var i = 0; i < this.data.columns.length; i++) {
								columns.push(this.data.columns[i].text);
							}
							this.changeSourcePoint();
						}
						this.changeProvince();
						loadPoint = false;
						this.render();
					}
				}, {
					key: 'changeSourcePoint',
					value: function changeSourcePoint() {
						sourcePonits = [];
						for (var i = 0; i < this.data.rows.length; i++) {
							var row = this.data.rows[i];
							var obj = {
								name: row[0],
								value: [row[1] - 0, row[2] - 0],
								sourcePoint: true,
								description: this.replaceVariable(this.panel.sourceP.description, row),
								link: {
									url: this.replaceVariable(this.panel.sourceP.link.url, row),
									targetBlank: this.panel.sourceP.link.targetBlank
								}
							};
							sourcePonits.push(obj);
						}
					}
				}, {
					key: 'replaceVariable',
					value: function replaceVariable(str, row) {
						var sourcePNoVar = str.replace(/\$\{(.*?)\}/g, function (match, key) {
							return columns.indexOf(key.trim()) > -1 ? row[columns.indexOf(key.trim())] : '';
						});
						sourcePNoVar = this.templateSrv.replaceWithText(sourcePNoVar, null);
						var text = sourcePNoVar.replace(/\#/g, "%23");
						return text;
					}
				}, {
					key: 'changeProvince',
					value: function changeProvince(key) {
						var that = this;
						this.initChart();
						if (this.panel.province === 'china') {
							$.get('./public/plugins/oge_province_map/libs/json/china.json', function (mapJson) {
								that.registerAndsetOption(myChart, 'china', mapJson, true);
							});
						} else {
							$.get('./public/plugins/oge_province_map/libs/json/province/' + this.panel.province + '.json', function (mapJson) {
								that.registerAndsetOption(myChart, key, mapJson, false);
							});
						}
					}
				}, {
					key: 'initChart',
					value: function initChart() {
						var that = this;
						if (myChart) {
							myChart.dispose();
						}
						myChart = echarts.init(this.mapElem.find('.chinamain')[0]);
						myChart.on('click', function (param) {
							if (param && param.componentType === 'geo') {
								var cityId = that.cityMap[param.name];
								if (cityId) {
									//代表有下级地图
									$.get('./public/plugins/oge_province_map/libs/json/province/' + cityId + '.json', function (mapJson) {
										that.registerAndsetOption(myChart, param.name, mapJson, false);
										that.panel.province = cityId;
									});
								}
							} else {
								that.url(param);
							}
						});
					}
				}, {
					key: 'registerAndsetOption',
					value: function registerAndsetOption(myChart, name, mapJson, bool) {
						var that = this;
						this.panel.currentName = name ? name : this.panel.currentName;
						this.panel.currentJson = mapJson ? mapJson : this.panel.currentJson;
						this.panel.currentBool = bool ? bool : this.panel.currentBool;
						var newPonits = that.panel.points.concat(sourcePonits).filter(function (item) {
							return item.name && item.value && parseFloat(item.value[0]).toString() != "NaN" && parseFloat(item.value[1]).toString() != "NaN";
						});
						echarts.registerMap(name, mapJson);
						myChart.setOption({
							backgroundColor: that.panel.bgColor,
							tooltip: {
								trigger: 'item',
								formatter: function formatter(params) {
									return params.data.description ? params.name + ':' + params.data.description : params.name;
								}
							},
							legend: {
								selectedMode: bool
							},
							geo: {
								map: name,
								itemStyle: {
									normal: {
										areaColor: that.panel.areaColor,
										borderColor: that.panel.borderColor,
										borderWidth: 1
									},
									emphasis: {
										areaColor: that.panel.emAreaColor,
										borderColor: that.panel.emBorderColor,
										borderWidth: 1
									}
								},
								roam: true, //是否开启鼠标缩放和平移漫游
								label: {
									normal: {
										show: that.panel.showLabel,
										color: that.panel.labelColor
									},
									emphasis: {
										show: that.panel.emShowLabel,
										color: that.panel.emLabelColor
									}
								}
							},
							series: [{
								name: '',
								type: 'scatter',
								coordinateSystem: 'geo',
								data: newPonits,
								symbol: that.panel.symbolStyle,
								symbolSize: that.panel.symbolSize,
								label: {
									normal: {
										show: false
									},
									emphasis: {
										show: false
									}
								},
								itemStyle: {
									emphasis: {
										color: that.panel.emSymbolColor,
										borderColor: '#fff',
										borderWidth: 1
									},
									normal: {
										color: that.panel.symbolColor
									}
								}
							}]
						});
						myChart.resize();
						loadPoint = true;
						if (this.panel.symbolStyle == 'none') {
							this.addImage();
						}
					}
				}, {
					key: 'changeLabelStyle',
					value: function changeLabelStyle() {
						myChart.setOption({
							backgroundColor: this.panel.bgColor,
							geo: {
								label: {
									normal: {
										show: this.panel.showLabel,
										color: this.panel.labelColor
									},
									emphasis: {
										show: this.panel.emShowLabel,
										color: this.panel.emLabelColor
									}
								}
							}
						});
					}
				}, {
					key: 'changeitemStyle',
					value: function changeitemStyle() {
						myChart.setOption({
							geo: {
								itemStyle: {
									normal: {
										areaColor: this.panel.areaColor,
										borderColor: this.panel.borderColor,
										borderWidth: 1
									},
									emphasis: {
										areaColor: this.panel.emAreaColor,
										borderColor: this.panel.emBorderColor,
										borderWidth: 1
									}
								}
							}
						});
					}
				}, {
					key: 'changePointLabelStyle',
					value: function changePointLabelStyle() {
						if (this.panel.symbolStyle == 'none') {
							myChart.setOption({
								series: [{
									type: 'scatter',
									coordinateSystem: 'geo',
									symbol: 'none'
								}]
							});
							this.addImage();
						} else {
							myChart.setOption({
								series: [{
									type: 'scatter',
									coordinateSystem: 'geo',
									symbol: this.panel.symbolStyle,
									symbolSize: this.panel.symbolSize,
									itemStyle: {
										emphasis: {
											color: this.panel.emSymbolColor,
											borderColor: '#fff',
											borderWidth: 1
										},
										normal: {
											color: this.panel.symbolColor
										}
									}
								}]
							});
						}
					}
				}, {
					key: 'addImage',
					value: function addImage() {
						var _this2 = this;

						this.mapElem.find('.imagePoints')[0].innerHTML = '';
						var newPonits = this.panel.points.concat(sourcePonits).filter(function (item) {
							return item.name && item.value && parseFloat(item.value[0]).toString() != "NaN" && parseFloat(item.value[1]).toString() != "NaN";
						});

						var _loop = function _loop(i) {
							var position = myChart.convertToPixel('geo', newPonits[i].value);
							var newDiv = document.createElement("a");
							newDiv.style = "position:absolute;left:" + position[0] + "px;top:" + position[1] + "px;width:" + _this2.panel.symbolSize + "px;height:" + _this2.panel.symbolSize + "px;";
							newDiv.style.backgroundImage = "url(public/plugins/oge_province_map/img/fengji.gif)";
							newDiv.style.backgroundRepeat = "no-repeat";
							newDiv.style.backgroundSize = "100% 100%";
							newDiv.href = newPonits[i].link.url;
							newDiv.target = newPonits[i].link.targetBlank ? '_blank' : '_self';
							var descriP = document.createElement("p");
							descriP.style = "position:absolute;left:" + (position[0] - 0 + (_this2.panel.symbolSize - 0)) + "px;top:" + position[1] + "px;";
							descriP.textContent = newPonits[i].description ? newPonits[i].name + ':' + newPonits[i].description : newPonits[i].name;
							descriP.style.display = "none";
							descriP.style.backgroundColor = "rgba(55,55,64,0.75)";
							newDiv.addEventListener("mouseover", function () {
								descriP.style.display = "block";
							}, false);
							newDiv.addEventListener("mouseleave", function () {
								descriP.style.display = "none";
							}, false);
							_this2.mapElem.find('.imagePoints')[0].appendChild(newDiv);
							_this2.mapElem.find('.imagePoints')[0].appendChild(descriP);
						};

						for (var i = 0; i < newPonits.length; i++) {
							_loop(i);
						}
					}
				}, {
					key: 'changeScatterData',
					value: function changeScatterData() {
						this.changeSourcePoint();
						var newPonits = this.panel.points.concat(sourcePonits).filter(function (item) {
							return item.name && item.value && parseFloat(item.value[0]).toString() != "NaN" && parseFloat(item.value[1]).toString() != "NaN";
						});
						myChart.setOption({
							series: [{
								type: 'scatter',
								coordinateSystem: 'geo',
								data: newPonits
							}]
						});
					}
				}, {
					key: 'addPoint',
					value: function addPoint() {
						var obj = {
							name: '',
							value: [],
							sourcePoint: false,
							description: '',
							link: {
								url: '',
								targetBlank: true
							}
						};
						this.panel.points.push(obj);
					}
				}, {
					key: 'removePoint',
					value: function removePoint(index) {
						this.panel.points.splice(index, 1);
						this.changeScatterData();
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'url',
					value: function url(point) {
						var target = point.data.link.targetBlank ? '_blank' : '_self';
						if (point.data.link.url) {
							window.open(point.data.link.url, target);
						}
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.mapElem = elem;
						ctrl.events.on('render', function () {
							if (myChart) {
								myChart.resize();
								if (ctrl.panel.symbolStyle == 'none' && loadPoint) {
									ctrl.addImage();
								}
							}
						});
					}
				}]);

				return ProvinceMapPanelCtrl;
			}(MetricsPanelCtrl));

			_export('ProvinceMapPanelCtrl', ProvinceMapPanelCtrl);

			ProvinceMapPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=map_ctrl.js.map
