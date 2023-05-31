'use strict';

System.register(['app/plugins/sdk', 'lodash', './css/fault-panel.css!'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, _createClass, panelOptionDefaults, FaultPanelCtrl;

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
		}, function (_cssFaultPanelCss) {}],
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
				metrics: [],
				colors: [{ name: '正常', color: "rgba(50, 172, 45, 0.97)" }, { name: '轻微', color: "rgba(237, 129, 40, 0.89)" }, { name: '严重', color: "rgba(245, 54, 54, 0.9)" }],
				fontFamily: '微软雅黑',
				fontSize: '100%',
				fontStyle: 'normal',
				allDescriptions: [],
				allMethods: [],
				titleWidth: 40,
				height: 100,
				titleBgColor: 'grey'
			};

			_export('FaultPanelCtrl', FaultPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(FaultPanelCtrl, _MetricsPanelCtrl);

				/** @ngInject */
				function FaultPanelCtrl($scope, $injector) {
					_classCallCheck(this, FaultPanelCtrl);

					var _this = _possibleConstructorReturn(this, (FaultPanelCtrl.__proto__ || Object.getPrototypeOf(FaultPanelCtrl)).call(this, $scope, $injector));

					_.defaults(_this.panel, {
						options: {}
					}); //将panelDefaults属性附加到this.panel上
					_.defaults(_this.panel.options, panelOptionDefaults);

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('render', _this.onRender.bind(_this));
					return _this;
				}

				_createClass(FaultPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_fault_diagnosis/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.panel.options.metrics = [];

						if (_.isEmpty(dataList)) return;
						this.data = dataList[0].rows ? dataList[0].rows : [];

						for (var i = 0; i < this.data.length; i++) {
							var item = this.data[i];
							this.panel.options.metrics[i] = {
								name: item[0],
								color: '',
								level: item[1],
								description: item[2],
								method: item[3]
							};
						}

						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {
							ctrl.panel.options.height = ctrl.height - 20;
							var titleWid = elem.find('.faultTitle').width();
							ctrl.panel.options.titleWidth = titleWid ? titleWid : 40;
							if (_.isEmpty(ctrl.panel.options.metrics)) return;
							ctrl.panel.options.allMethods = [];
							ctrl.panel.options.allDescriptions = [];
							for (var i = 0; i < ctrl.panel.options.metrics.length; i++) {
								var item = ctrl.panel.options.metrics[i];
								if (item.level === 0) {
									item.color = ctrl.panel.options.colors[0].color;
								} else if (item.level === 1) {
									item.color = ctrl.panel.options.colors[1].color;
									if (item.description !== '') {
										ctrl.panel.options.allDescriptions.push(item.name + ': ' + item.description);
									}
									if (item.method !== '') {
										ctrl.panel.options.allMethods.push(item.name + ': ' + item.method);
									}
								} else if (item.level === 2) {
									item.color = ctrl.panel.options.colors[2].color;
									if (item.description !== '') {
										ctrl.panel.options.allDescriptions.push(item.name + ': ' + item.description);
									}
									if (item.method !== '') {
										ctrl.panel.options.allMethods.push(item.name + ': ' + item.method);
									}
								}
							}
						});
					}
				}, {
					key: 'invertColorOrder',
					value: function invertColorOrder() {
						this.panel.options.colors.reverse();
						this.render();
					}
				}]);

				return FaultPanelCtrl;
			}(MetricsPanelCtrl));

			_export('FaultPanelCtrl', FaultPanelCtrl);

			FaultPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=fault_ctrl.js.map
