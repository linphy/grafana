'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, $, _createClass, panelDefaults, XOption, pictureOption, EchartsCtrl;

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
				pictureName: '冲击式',
				pictureType: 1,
				direct: 'shun'
			};
			XOption = [{ name: '顺时针旋转', value: 'shun' }, { name: '逆时针旋转', value: 'ni' }];
			pictureOption = ['冲击式', '贯流式', '混流半伞式', '混流半伞无下机架', '混流全伞三导', '混流全伞无上导', '混流悬挂式', '轴混全伞三导', '轴流半伞', '轴流半伞无下机架', '轴流全伞无上导', '轴流悬挂式'];

			_export('EchartsCtrl', EchartsCtrl = function (_MetricsPanelCtrl) {
				_inherits(EchartsCtrl, _MetricsPanelCtrl);

				function EchartsCtrl($scope, $injector, $rootScope, $location, linkSrv) {
					_classCallCheck(this, EchartsCtrl);

					var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_this.$location = $location;
					_this.linkSrv = linkSrv;
					_this.XOption = XOption;
					_this.pictureOption = pictureOption;
					_.defaults(_this.panel, panelDefaults);
					_.defaults(_this.panel, panelDefaults);
					_.defaults(_this.panel, panelDefaults);
					_.defaults(_this.panel, panelDefaults);
					_.defaults(_this.panel, panelDefaults);
					_this.panel.pictureType = 1; //默认动态图，动图为1，静态图为0
					_this.panel.direct = 'shun'; //默认顺时针转

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(EchartsCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge-picture/editor.html', 2);
					}
				}, {
					key: 'doJud',
					value: function doJud() {
						//判断图片是动态还是静态
						if (this.dataList[0] === null) {
							return;
						} else {
							var val = this.dataList[0].datapoints;
							var num = val.length - 1;
							this.panel.pictureType = val[num][0] > 1 ? 1 : o;
						}
					}
				}, {
					key: 'getPic',
					value: function getPic() {
						var A = this.panel.pictureType;
						var B = this.panel.direct;
						var name = this.panel.pictureName == '冲击式' || this.panel.pictureName == '贯流式' ? this.panel.pictureName : B == 'shun' ? this.panel.pictureName + '顺' : this.panel.pictureName + '逆';

						var imgUrl = 'public/plugins/oge-picture/src/img/' + name + '.' + (A ? 'gif' : 'jpg');
						this.panel.picStyleObj = {
							'background-image': 'url("' + imgUrl + '")',
							'background-size': '100% 100%',
							'width': '100%',
							'max-width': '700px',
							'height': '100%',
							'margin': '0 auto'
						};
					}
				}, {
					key: 'onClick',
					value: function onClick(evt) {
						if (this.panel.links == undefined || this.panel.links.length === 0) {
							return;
						};
						var scopedVars = _.extend({}, this.panel.scopedVars);
						var linkInfo;
						var linkSrv = this.linkSrv;
						var $location = this.$location;
						var $timeout = this.$timeout;
						var drilldownTooltip = $('<div id="tooltip" class="">hello</div>"');
						if (this.panel.links.length > 0) {
							linkInfo = linkSrv.getPanelLinkAnchorInfo(this.panel.links[0], scopedVars);
						} else {
							linkInfo = null;
						}
						if (!linkInfo) {
							return;
						}
						if ($(evt).parents('.panel-header').length > 0) {
							return;
						}

						if (linkInfo.target === '_blank') {
							var redirectWindow = window.open(linkInfo.href, '_blank');
							redirectWindow.location;
							return;
						}

						if (linkInfo.href.indexOf('http') === 0) {
							window.location.href = linkInfo.href;
						} else {
							$timeout(function () {
								$location.url(linkInfo.href);
							});
						}
						drilldownTooltip.detach();
					}
				}, {
					key: 'mouseMove',
					value: function mouseMove(e) {
						if (this.panel.links == undefined || this.panel.links.length === 0) {
							return;
						};
						var scopedVars = _.extend({}, this.panel.scopedVars);
						var linkInfo;
						var linkSrv = this.linkSrv;
						var drilldownTooltip = $('<div id="tooltip" class="">hello</div>"');
						if (this.panel.links.length > 0) {
							linkInfo = linkSrv.getPanelLinkAnchorInfo(this.panel.links[0], scopedVars);
						} else {
							linkInfo = null;
						}
						if (!linkInfo) {
							return;
						}
						drilldownTooltip.text('点击跳转至: ' + linkInfo.title);
						drilldownTooltip.place_tt(e.pageX + 20, e.pageY - 15);
					}
				}, {
					key: 'mouseLeave',
					value: function mouseLeave() {
						if (this.panel.links == undefined || this.panel.links.length === 0) {
							return;
						};
						this.$timeout(function () {
							$(tooltip).detach();
						});
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						if (!dataList || dataList.length == 0 || !dataList[0].datapoints || dataList[0].datapoints.length == 0) return;

						this.dataList = dataList;
						this.doJud();
						this.getPic();
						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}]);

				return EchartsCtrl;
			}(MetricsPanelCtrl));

			_export('EchartsCtrl', EchartsCtrl);

			EchartsCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=picture_ctrl.js.map
