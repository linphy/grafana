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
				maxArr: 100,
				targetStr: []
			};

			_export('EchartsCtrl', EchartsCtrl = function (_MetricsPanelCtrl) {
				_inherits(EchartsCtrl, _MetricsPanelCtrl);

				function EchartsCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, EchartsCtrl);

					var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_.defaults(_this.panel, panelDefaults);
					var targetArr1 = [];
					var target = [];
					var dataArr = [];
					var shapeOption = [{ name: '多边型', value: 'polygon' }, { name: '圆型', value: 'circle' }];
					var maxArrOption;
					_this.panel.shapeOption = shapeOption;
					_this.panel.target = target;
					_this.panel.targetArr1 = targetArr1;
					_this.panel.maxArrOption = maxArrOption;
					_this.panel.dataArr = dataArr;
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(EchartsCtrl, [{
					key: 'getArr',
					value: function getArr() {
						var targetArr1 = [];
						var dataArr = [];
						var Arr1 = [];
						var Arr2 = [];
						var Arr3 = [];
						var Arr4 = [];
						/*for (var i=0;i<this.dataList.length;i++){
      	if(this.panel.targets[i].target.indexOf('HP1') != -1){//判断targetStr的值来分组
      		Arr1.push(this.dataList[i].datapoints[0][0]);
      		var obj1 = {name:this.dataList[i].target,max:this.panel.maxArr};
      		targetArr1.push(obj1);
      	}
      	else if(this.panel.targets[i].target.indexOf('HP2') != -1){
      		Arr2.push(this.dataList[i].datapoints[0][0])
      	}
      	else if(this.panel.targets[i].target.indexOf('HP3') != -1){
      		Arr3.push(this.dataList[i].datapoints[0][0])
      	}
      	else if (this.panel.targets[i].target.indexOf('HP4') != -1){
      		Arr4.push(this.dataList[i].datapoints[0][0])
      	}//按机组号把data数据分组
      }*/
						for (var i = 0; i < this.dataList.length; i++) {
							if (this.panel.threshold[i] == '1') {
								//判断targetStr的值来分组
								Arr1.push(this.dataList[i].datapoints[0][0]);
								var obj1 = { name: this.dataList[i].target, max: this.panel.maxArr };
								targetArr1.push(obj1);
							} else if (this.panel.threshold[i] == '2') {
								Arr2.push(this.dataList[i].datapoints[0][0]);
							} else if (this.panel.threshold[i] == '3') {
								Arr3.push(this.dataList[i].datapoints[0][0]);
							} else if (this.panel.threshold[i] == '4') {
								Arr4.push(this.dataList[i].datapoints[0][0]);
							} //按机组号把data数据分组
						}
						this.panel.targetArr1 = targetArr1;
						this.panel.dataArr = [Arr1, Arr2, Arr3, Arr4];
					}
				}, {
					key: 'gettargetStr',
					value: function gettargetStr() {
						this.panel.target = [];
						for (var i = 0; i < this.panel.targetStr.length; i++) {
							if (this.panel.targetStr[i] == undefined) {
								return;
							} else {
								this.panel.target.push(this.panel.targetStr[i]);
							}
						}
					}
				}, {
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge-radar/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.dataList = dataList;
						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						//nothing
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {
							ctrl.getArr();
							ctrl.gettargetStr();
							var obj = elem.find('.echarts-panel');
							var myChart = echarts.init(obj[0]);
							var lineStyle = {
								normal: {
									width: 1,
									opacity: 0.5
								}
							};
							var option = {
								backgroundColor: '#0A0A0A',
								legend: {
									data: ctrl.panel.target,
									itemGap: 20,
									textStyle: { color: 'rgb(238, 197, 102)' }
								},
								tooltip: {},
								radar: {
									splitNumber: 5,
									shape: ctrl.panel.shape,
									indicator: ctrl.panel.targetArr1,
									name: {
										textStyle: {
											color: 'rgb(238, 197, 102)'
										}
									},
									splitLine: {
										lineStyle: {
											color: ['rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)', 'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)', 'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'].reverse()
										}
									},
									splitArea: {
										show: false //分隔线
									},
									axisLine: {
										lineStyle: {
											color: 'rgba(238, 197, 102, 0.5)'
										}
									}
								},
								series: [{
									name: '这是一个名字',
									type: 'radar',
									areaStyle: {
										normal: {
											opacity: 0.5 //图形透明度，为0时不绘图。
										}
									},
									data: [{ value: ctrl.panel.dataArr[0], name: ctrl.panel.target[0] }, { value: ctrl.panel.dataArr[1], name: ctrl.panel.target[1] }, { value: ctrl.panel.dataArr[2], name: ctrl.panel.target[2] }, { value: ctrl.panel.dataArr[3], name: ctrl.panel.target[3] }]
								}]
							};
							myChart.setOption(option);
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
//# sourceMappingURL=radar_ctrl.js.map
