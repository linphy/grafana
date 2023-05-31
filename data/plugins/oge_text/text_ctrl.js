'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, $, _createClass, panelDefaults, TextPanelCtrl;

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
				remarkable: 'any',
				mode: "text", // 'html', 'markdown', 'text', 'log-html'
				content: "输入描述",
				isCycle: true,
				time: '{{time}}',
				information: '{{information}}',
				fontSize: '100%'
			};

			_export('TextPanelCtrl', TextPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(TextPanelCtrl, _MetricsPanelCtrl);

				function TextPanelCtrl($scope, $injector, templateSrv, $sce) {
					_classCallCheck(this, TextPanelCtrl);

					var _this = _possibleConstructorReturn(this, (TextPanelCtrl.__proto__ || Object.getPrototypeOf(TextPanelCtrl)).call(this, $scope, $injector));

					_this.templateSrv = templateSrv;
					_this.$sce = $sce;

					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(TextPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_text/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.data = [];
						if (dataList && dataList.length > 0 && dataList[0].datapoints && dataList[0].datapoints.length > 0) {
							for (var i = 0; i < dataList[0].datapoints.length; i++) {
								var da = dataList[0].datapoints[i];
								var obj = {
									time: Number.parseInt(da[1]) ? moment(Number.parseInt(da[1])).format("YYYY-MM-DD HH:mm:ss") : '',
									information: da[0]
								};
								this.data.push(obj);
							}
						}
						this.showData();
						this.render();
					}
				}, {
					key: 'renderText',
					value: function renderText(content) {
						content = content.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\n/g, '<br/>');
						this.updateContent(content);
					}
				}, {
					key: 'renderMarkdown',
					value: function renderMarkdown(content) {
						var _this2 = this;

						if (!this.remarkable) {
							return System.import('remarkable').then(function (Remarkable) {
								_this2.remarkable = new Remarkable();
								_this2.$scope.$apply(function () {
									_this2.updateContent(_this2.remarkable.render(content));
								});
							});
						}

						this.updateContent(this.remarkable.render(content));
					}
				}, {
					key: 'renderLogHtml',
					value: function renderLogHtml(ht) {
						var _this3 = this;

						if (this.panel.isCycle) {
							var newString = '';
							if (this.data.length > 0) {
								var _loop = function _loop(i) {
									var str = ht.replace(/\{\{(.*?)\}\}/g, function (match, key) {
										return _this3.data[i][key.trim()];
									});
									newString += str;
								};

								for (var i = 0; i < this.data.length; i++) {
									_loop(i);
								}
							} else {
								newString = "";
							}
							ht = newString;
						}
						this.updateContent(ht);
					}
				}, {
					key: 'updateContent',
					value: function updateContent(html) {
						try {
							this.content = this.$sce.trustAsHtml(this.templateSrv.replace(html, this.panel.scopedVars));
						} catch (e) {
							console.log('Text panel error: ', e);
							this.content = this.$sce.trustAsHtml(html);
						}
					}
				}, {
					key: 'showData',
					value: function showData() {
						if (this.panel.mode === 'markdown') {
							this.renderMarkdown(this.panel.content);
						} else if (this.panel.mode === 'html') {
							this.updateContent(this.panel.content);
						} else if (this.panel.mode === 'text') {
							this.renderText(this.panel.content);
						} else if (this.panel.mode === 'log-html') {
							this.renderLogHtml(this.panel.content);
						}
						this.renderingCompleted();
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {
							if (ctrl.panel.mode === 'text') {
								elem.find(".panel-text-content").css({
									"font-size": ctrl.panel.fontSize
								});
							}
						});
					}
				}]);

				return TextPanelCtrl;
			}(MetricsPanelCtrl));

			_export('TextPanelCtrl', TextPanelCtrl);

			TextPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=text_ctrl.js.map
