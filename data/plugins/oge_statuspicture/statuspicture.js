'use strict';

System.register(['app/plugins/sdk', 'lodash', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, $, _createClass, panelDefaults, statusPicturePanelCtrl;

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
				threshold: []
			};

			_export('statusPicturePanelCtrl', statusPicturePanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(statusPicturePanelCtrl, _MetricsPanelCtrl);

				function statusPicturePanelCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, statusPicturePanelCtrl);

					var _this = _possibleConstructorReturn(this, (statusPicturePanelCtrl.__proto__ || Object.getPrototypeOf(statusPicturePanelCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_.defaults(_this.panel, panelDefaults);
					if (_this.panel.threshold.length == 0) {
						_this.panel.threshold.push({ thresholds: '30,60', name: '' });
					}
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(statusPicturePanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_statuspicture/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.data = dataList;
						this.render();
					}
				}, {
					key: 'fixed',
					value: function fixed() {
						if (Object.prototype.toString.call(this.data) === '[object Array]') {
							if (this.data[0].datapoints.length == 0) {} else {
								var DP = this.data[0].datapoints;
								var num = this.data[0].datapoints[DP.length - 1][0];
								var fixedData = num.toFixed(this.panel.dataPrecise);
								this.data.Fdata = fixedData;
							}
						} else if (this.data === undefined || this.data.value === undefined || this.data.value === null) {
							return;
						} else {
							var num = this.data.value;
							if (this.data.precise === null) {
								var fixedData = num.toFixed(this.panel.dataPrecise);
							} else {
								var fixedData = num.toFixed(this.data.precise);
							}
							this.data.Fdata = fixedData;
						}
					}
				}, {
					key: 'onDelete',
					value: function onDelete(index) {
						this.panel.threshold.splice(index, 1);
						this.render();
					}
				}, {
					key: 'onAdd',
					value: function onAdd() {
						this.panel.threshold.push({ thresholds: '30,60', name: '' });
						this.render();
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {
							var obj = elem.find('.stateList-panel');
							var text = '<p>值不在设定范围内</p>';
							ctrl.fixed();
							var height = ctrl.height || ctrl.row.height;
							if (_.isString(height)) {
								height = parseInt(height.replace('px', ''), 10);
							}
							obj.css('height', height + 'px');
							for (var i = 0; i < ctrl.panel.threshold.length; i++) {
								ctrl.data.FD = parseInt(ctrl.data.Fdata, 10);
								if (ctrl.panel.threshold[i].thresholds == null) {
									return;
								} else {
									var str = ctrl.panel.threshold[i].thresholds.split(",");
									ctrl.panel.threshold[i].thresholdss = [];
									for (var j = 0; j < 2; j++) {
										ctrl.panel.threshold[i].thresholdss.push(Number(str[j]));
									}
								}
								if (ctrl.panel.threshold[i].thresholdss[0] <= ctrl.data.FD && ctrl.data.FD < ctrl.panel.threshold[i].thresholdss[1]) {
									text = '<img src="public/plugins/oge_statuspicture/img/' + ctrl.panel.threshold[i].name + '" style="height:' + height + 'px; width:100%; max-width:600px;" alt="' + ctrl.panel.threshold[i].name + '">';
								}
							}
							obj.html(text);
						});
					}
				}]);

				return statusPicturePanelCtrl;
			}(MetricsPanelCtrl));

			_export('statusPicturePanelCtrl', statusPicturePanelCtrl);

			statusPicturePanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=statuspicture.js.map
