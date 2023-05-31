'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'jquery'], function (_export, _context) {
	"use strict";

	var PanelCtrl, moment, _, $, _createClass, panelDefaults, ButtonPanelCtrl;

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
			PanelCtrl = _appPluginsSdk.PanelCtrl;
		}, function (_moment) {
			moment = _moment.default;
		}, function (_lodash) {
			_ = _lodash.default;
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
				colors: "rgba(8, 94, 157, 0.9)",
				size: '100%',
				NA: '',
				CK: 'uncheck',
				url: '' //默认显示模式
			};

			_export('ButtonPanelCtrl', ButtonPanelCtrl = function (_PanelCtrl) {
				_inherits(ButtonPanelCtrl, _PanelCtrl);

				function ButtonPanelCtrl($scope, $injector, templateSrv, $sce) {
					_classCallCheck(this, ButtonPanelCtrl);

					var _this = _possibleConstructorReturn(this, (ButtonPanelCtrl.__proto__ || Object.getPrototypeOf(ButtonPanelCtrl)).call(this, $scope, $injector));

					_this.templateSrv = templateSrv;
					_this.$sce = $sce;

					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
					var CheckOption = [{
						name: '选中',
						value: 'check'
					}, {
						name: '未选中',
						value: 'uncheck'
					}];
					_this.panel.CheckOption = CheckOption;
					var fontSizes = ['80%', '90%', '100%', '110%', '120%', '130%', '150%', '160%', '180%', '200%', '220%', '250%'];
					_this.panel.fontSizes = fontSizes;
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('render', _this.onRender.bind(_this));
					return _this;
				}

				_createClass(ButtonPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_button/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.data = dataList;
						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {});
					}
				}]);

				return ButtonPanelCtrl;
			}(PanelCtrl));

			_export('ButtonPanelCtrl', ButtonPanelCtrl);

			ButtonPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=button_ctrl.js.map
