'use strict';

System.register(['app/plugins/sdk', 'lodash', './css/polarscatter-panel.css!'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, _, _createClass, panelOptionDefaults, canvasArr, ctxArr, height, width, size, scatterDate, centerDate, multi, max, canvasPanel, PolScatPanelCtrl;

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
		}, function (_cssPolarscatterPanelCss) {}],
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
				bgColor: null,
				axis: {
					lineColor: '#8d8f8d',
					lineWidth: 1,
					textColor: '#ccc'
				},
				scatter: {
					color: 'rgb(126, 178, 109)',
					r: 4
				},
				centerScatter: {
					color: 'red',
					r: 2
				},
				circleLine: {
					color: 'rgb(126, 178, 109)',
					r: 30
				},
				line: {
					lineColor: 'red',
					lineWidth: 1
				},
				theMaxValue: null,
				tickSpace: 20,
				tickColour: '#ccc'
			};
			canvasArr = [];
			ctxArr = [];
			height = 200;
			width = 400;
			size = 0;
			scatterDate = [];
			centerDate = [];
			multi = 1;
			max = 1;

			_export('PolScatPanelCtrl', PolScatPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(PolScatPanelCtrl, _MetricsPanelCtrl);

				/** @ngInject */
				function PolScatPanelCtrl($scope, $injector) {
					_classCallCheck(this, PolScatPanelCtrl);

					var _this = _possibleConstructorReturn(this, (PolScatPanelCtrl.__proto__ || Object.getPrototypeOf(PolScatPanelCtrl)).call(this, $scope, $injector));

					_.defaults(_this.panel, panelOptionDefaults);

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					_this.events.on('render', _this.onRender.bind(_this));
					return _this;
				}

				_createClass(PolScatPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/plugins/oge_polar_scatter/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						if (_.isEmpty(dataList)) return;
						//目前规定传入的值是table类型，并且第一个值为圆心，第二个值是散点
						if (dataList.length > 1 && dataList[0].rows && dataList[1].rows) {
							scatterDate = dataList[1].rows;
							if (dataList[0].rows.length == 1) {
								centerDate = [[0, 0]];
								centerDate.push(dataList[0].rows[0]);
							} else {
								centerDate = dataList[0].rows;
							}
						}
						this.render();
					}
				}, {
					key: 'onRender',
					value: function onRender() {}
				}, {
					key: 'initChart',
					value: function initChart(target, panelHeight) {
						height = panelHeight;
						width = target.width();

						var html = "<div style='z-index:0; position: absolute; top: 0;'><canvas class='canvas-0'></canvas></div>";
						html += "<div style='z-index:1; position: absolute; top: 0;'><canvas class='canvas-1'></canvas></div>";
						html += "<div style='z-index:3; position: absolute; top: 0;'><canvas class='canvas-2'></canvas></div>";
						html += "<div style='z-index:2; position: absolute; top: 0;'><canvas class='canvas-3'></canvas></div>";
						target.html(html);

						for (var i = 0; i < 4; i++) {
							var canvas = target.find('.canvas-' + i)[0];
							canvas.width = width;
							canvas.height = height;

							canvasArr[i] = canvas;
							ctxArr[i] = canvas.getContext("2d");
						}

						this.drawAxis();
						this.circleLine();
						this.drawScatter();
					}
				}, {
					key: 'drawAxis',
					value: function drawAxis() {
						var context = ctxArr[0];
						size = width > height ? height - 20 : width - 20; //轴线的长度,上下左右留10px;
						context.strokeStyle = this.panel.axis.lineColor;
						context.lineWidth = this.panel.axis.lineWidth;
						//横轴
						context.beginPath();
						context.moveTo(width / 2 - size / 2, height / 2);
						context.lineTo(width / 2 + size / 2, height / 2);
						context.closePath();
						context.stroke();
						//箭头
						context.beginPath();
						context.moveTo(width / 2 + size / 2, height / 2);
						context.lineTo(width / 2 + size / 2 - 10, height / 2 + 10);
						context.closePath();
						context.stroke();
						context.beginPath();
						context.moveTo(width / 2 + size / 2, height / 2);
						context.lineTo(width / 2 + size / 2 - 10, height / 2 - 10);
						context.closePath();
						context.stroke();
						//纵轴
						context.beginPath();
						context.moveTo(width / 2, height / 2 - size / 2);
						context.lineTo(width / 2, height / 2 + size / 2);
						context.closePath();
						context.stroke();
						//箭头
						context.beginPath();
						context.moveTo(width / 2, height / 2 - size / 2);
						context.lineTo(width / 2 - 10, height / 2 - size / 2 + 10);
						context.closePath();
						context.stroke();
						context.beginPath();
						context.moveTo(width / 2, height / 2 - size / 2);
						context.lineTo(width / 2 + 10, height / 2 - size / 2 + 10);
						context.closePath();
						context.stroke();
						//刻度
						this.drawAxisTicks(context);
					}
				}, {
					key: 'drawAxisTicks',
					value: function drawAxisTicks(context) {
						this.themultiple();
						var num = size / 2 * 0.9 / this.panel.tickSpace;
						var lastSpace = (num - Math.floor(num)) * this.panel.tickSpace; //最后一个间隔距离
						var tick = this.panel.tickSpace / multi;
						context.strokeStyle = this.panel.tickColour;
						context.fillStyle = this.panel.axis.textColor;

						for (var i = 1; i < num + 1; i++) {
							if (i == Math.floor(num)) continue;
							// 正向X轴
							context.beginPath();
							var bool = i == Math.floor(num + 1);
							var x = width / 2 + i * this.panel.tickSpace;
							if (bool) {
								x = width / 2 + (i - 1) * this.panel.tickSpace + lastSpace;
							}
							context.moveTo(x, height / 2);
							context.lineTo(x, height / 2 - 6);
							context.fillText(bool ? max : (tick * i).toFixed(1), x - 2.5, height / 2 - 6 - 10);
							context.stroke();
							// 负向X轴
							context.beginPath();
							var x = width / 2 - i * this.panel.tickSpace;
							if (bool) {
								x = width / 2 - ((i - 1) * this.panel.tickSpace + lastSpace);
							}
							context.moveTo(x, height / 2);
							context.lineTo(x, height / 2 - 6);
							context.fillText('-' + (bool ? max : (tick * i).toFixed(1)), x - 2.5, height / 2 - 6 - 10);
							context.stroke();

							// 正向Y轴
							context.beginPath();
							var y = height / 2 - i * this.panel.tickSpace;
							if (bool) {
								y = height / 2 - ((i - 1) * this.panel.tickSpace + lastSpace);
							}
							context.moveTo(width / 2, y);
							context.lineTo(width / 2 + 6, y);
							context.fillText(bool ? max : (tick * i).toFixed(1), width / 2 + 6 + 10, y + 2.5);
							context.stroke();
							// 负向Y轴
							context.beginPath();
							var y = height / 2 + i * this.panel.tickSpace;
							if (bool) {
								y = height / 2 + (i - 1) * this.panel.tickSpace + lastSpace;
							}
							context.moveTo(width / 2, y);
							context.lineTo(width / 2 + 6, y);
							context.fillText('-' + (bool ? max : (tick * i).toFixed(1)), width / 2 + 6 + 10, y + 2.5);
							context.stroke();
						}
					}
				}, {
					key: 'circleLine',
					value: function circleLine() {
						var context = ctxArr[1];
						this.themultiple();
						context.strokeStyle = this.panel.circleLine.color;
						context.setLineDash([20, 5]); // [实线长度, 间隙长度]
						context.lineDashOffset = -0;
						context.beginPath();
						context.arc(width / 2, height / 2, this.panel.circleLine.r * multi, 0, 2 * Math.PI);
						context.stroke();
					}
				}, {
					key: 'drawScatter',
					value: function drawScatter() {
						var that = this;
						var context = ctxArr[2];
						// if (scatterDate.length==0) {
						// 	context.clearRect(0,0,width,height);
						// } else {
						context.strokeStyle = this.panel.scatter.color;
						context.fillStyle = this.panel.scatter.color;
						this.themultiple();
						var pixelArr = [];
						for (var i = 0; i < scatterDate.length; i++) {
							var x = scatterDate[i][0] * multi + width / 2;
							var y = scatterDate[i][1] * multi + height / 2 - scatterDate[i][1] * 2 * multi;
							context.beginPath();
							context.arc(x, y, this.panel.scatter.r, 0, 2 * Math.PI);
							context.fill();
							context.stroke();
							pixelArr.push([x, y, scatterDate[i][0], scatterDate[i][1]]);
						}
						//中心点
						context.strokeStyle = this.panel.centerScatter.color;
						context.fillStyle = this.panel.centerScatter.color;
						for (var j = 0; j < centerDate.length; j++) {
							var _x = centerDate[j][0] * multi + width / 2;
							var _y = centerDate[j][1] * multi + height / 2 - centerDate[j][1] * 2 * multi;
							context.beginPath();
							context.arc(_x, _y, this.panel.centerScatter.r, 0, 2 * Math.PI);
							context.fill();
							context.stroke();
							pixelArr.push([_x, _y, centerDate[j][0], centerDate[j][1]]);
						}
						canvasArr[2].addEventListener("mousemove", that.doMouseMove, false);
						canvasArr[2].pointData = pixelArr;
						canvasArr[2].r = this.panel.scatter.r;
						canvasArr[2].showDetail = this.showPointDetail;
						// }
						this.drawLine();
					}
				}, {
					key: 'drawLine',
					value: function drawLine() {
						var context = ctxArr[3];
						if (centerDate.length == 0) {
							context.clearRect(0, 0, width, height);
						} else {
							context.strokeStyle = this.panel.line.lineColor;
							context.lineWidth = this.panel.line.lineWidth;
							//横轴
							context.beginPath();
							context.moveTo(centerDate[0][0] * multi + width / 2, centerDate[0][1] * multi + height / 2 - centerDate[0][1] * 2 * multi);
							context.lineTo(centerDate[1][0] * multi + width / 2, centerDate[1][1] * multi + height / 2 - centerDate[1][1] * 2 * multi);
							context.closePath();
							context.stroke();
						}
					}
				}, {
					key: 'doMouseMove',
					value: function doMouseMove() {
						var pixelArr = this.pointData; //['x位置','y位置','x值','y值']
						var bbox = this.getBoundingClientRect();
						var x = (event.pageX - bbox.left) * (this.width / bbox.width);
						var y = (event.pageY - bbox.top) * (this.height / bbox.height);

						var checkPoint = false;
						var r = this.r;
						for (var i = 0; i < pixelArr.length; i++) {
							var xmax = pixelArr[i][0] + r;
							var xmin = pixelArr[i][0] - r;
							var ymax = pixelArr[i][1] + r;
							var ymin = pixelArr[i][1] - r;
							if (x <= xmax && x >= xmin && y <= ymax && y >= ymin) {
								this.showDetail(pixelArr[i][2], pixelArr[i][3], event.pageY - bbox.top, event.pageX - bbox.left);
								checkPoint = true;
								break;
							}
						}

						if (!checkPoint) {
							canvasPanel.parent().find(".tip").remove();
						}
					}
				}, {
					key: 'showPointDetail',
					value: function showPointDetail(x, y, top, left) {
						canvasPanel.parent().find(".tip").remove();
						var tip = $("<div class='tip' style='z-index:4;background-color:#4d4e52e6'> x: " + x + " y: " + y + "</div>");
						tip.css({
							'top': top - 17 + 'px',
							'left': left + 8 + 'px'
						});
						tip.appendTo(canvasPanel.parent());
					}
				}, {
					key: 'themultiple',
					value: function themultiple() {
						//取最大值
						var arrayNum = scatterDate.join(",").split(",");
						max = arrayNum.reduce(function (a, b) {
							return Math.abs(b - 0) > Math.abs(a - 0) ? Math.abs(b - 0) : Math.abs(a - 0);
						});
						if (this.panel.circleLine.r && this.panel.circleLine.r > max) {
							max = this.panel.circleLine.r;
						}
						if (this.panel.theMaxValue && this.panel.theMaxValue > 0) {
							max = this.panel.theMaxValue;
						}
						multi = size / 2 * 0.9 / max; //缩放倍数
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						ctrl.events.on('render', function () {
							var $panelContainer = elem.find('.panel-container');
							if (ctrl.panel.bgColor) {
								$panelContainer.css('background-color', ctrl.panel.bgColor);
							} else {
								$panelContainer.css('background-color', '');
							}
							canvasPanel = elem.find('.canvas-panel');
							ctrl.initChart(canvasPanel, ctrl.height);
						});
					}
				}]);

				return PolScatPanelCtrl;
			}(MetricsPanelCtrl));

			_export('PolScatPanelCtrl', PolScatPanelCtrl);

			PolScatPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=polarscatter_ctrl.js.map
