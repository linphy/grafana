"use strict";

System.register(["jquery"], function (_export, _context) {
    "use strict";

    var $, _createClass, TraceDrawer;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_jquery) {
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

            TraceDrawer = function () {
                function TraceDrawer() {
                    _classCallCheck(this, TraceDrawer);

                    this.canvasArr = [];
                    this.ctxArr = [];
                    this.width = 200;
                    this.currentPoint = [];
                    this.height = 200;
                    this.traceData = null;
                    this.style = null;
                }

                _createClass(TraceDrawer, [{
                    key: "init",
                    value: function init(htmlTarget, canvasSize) {
                        this.ctxArr = [];
                        var target = $(htmlTarget);
                        var html = "<canvas id='" + htmlTarget + "mycanvas'></canvas>";
                        target.html(html);
                        var canvas = document.getElementById(htmlTarget + "mycanvas");
                        var canvas_width = target.width() > target.height() ? target.height() : target.width();
                        canvas.width = canvas_width + 10;
                        canvas.height = canvas_width + 10;
                        this.ctxArr[0] = canvas.getContext("2d");
                    }
                }, {
                    key: "draw",
                    value: function draw(traceData, drawStyle, htmlTarget) {
                        if (!traceData) return;
                        this.traceData = traceData;
                        this.style = drawStyle;
                        var num = 0;
                        var new_width = $(htmlTarget).width() > $(htmlTarget).height() ? $(htmlTarget).height() : $(htmlTarget).width();
                        //1、正方形&点
                        this.drawFlipRectangle(new_width / 2, new_width / 2, this.ctxArr[0]);
                        //2、根据半径画圆
                        this.drawCircle(this.ctxArr[0], num, new_width);
                    }
                }, {
                    key: "drawFlipRectangle",
                    value: function drawFlipRectangle(x, y, ctx) {
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'white';
                        ctx.beginPath();

                        ctx.moveTo(0, y); //左中
                        ctx.lineTo(x * 2, y); //右中
                        ctx.lineTo(x * 2, 0); //右上
                        ctx.lineTo(0, 0); //左上
                        ctx.lineTo(0, y * 2); //左下
                        ctx.lineTo(x * 2, y * 2); //右下
                        ctx.lineTo(x * 2, y);

                        ctx.stroke();
                        ctx.closePath();

                        ctx.beginPath();
                        ctx.moveTo(x, y * 2);
                        ctx.lineTo(x, 0);
                        ctx.stroke();
                        ctx.closePath();

                        var sheight = y / 5;
                        var swidth = x / 5;
                        var length = x / 5;
                        ctx.fillStyle = "green"; /*设置填充颜色*/
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                ctx.fillRect(x + swidth * (i + 1), y - sheight * (j + 1), 2, 2); //右上
                                ctx.fillRect(x - swidth * (i + 1), y - sheight * (j + 1), 2, 2); //左上
                                ctx.fillRect(x - swidth * (i + 1), y + sheight * (j + 1), 2, 2); //左下
                                ctx.fillRect(x + swidth * (i + 1), y + sheight * (j + 1), 2, 2); //右上
                            }
                        }
                    }
                }, {
                    key: "drawCircle",
                    value: function drawCircle(ctx, index, h) {
                        ctx.strokeStyle = 'white';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(h / 2, h / 2, this.style.circleR, 0, Math.PI * 2, true);
                        ctx.stroke();
                        ctx.closePath();

                        //3、每个圆圈里面的点
                        this.drawCirclePoint(ctx, index, h);
                    }
                }, {
                    key: "drawCirclePoint",
                    value: function drawCirclePoint(ctx, index, h) {
                        ctx.lineWidth = 0.1;
                        ctx.strokeStyle = 'white';
                        ctx.beginPath();

                        var xArr = this.traceData.data[index * 2]; //x
                        var yArr = this.traceData.data[index * 2 + 1]; //y
                        var xAvg = this.traceData.avg[index * 2];
                        var yAvg = this.traceData.avg[index * 2 + 1];

                        var center = h / 2;
                        //根据圆的半径，反推放大系数(45是默认圆半径)
                        var scareNumber = (this.style.circleR - 45) / 5 * 0.1 + 1;
                        for (var j = 0; j < xArr.length - 1; j++) {
                            if (yArr.length < j) {
                                break;
                            }
                            ctx.moveTo(center - (xArr[j] - xAvg) * scareNumber, center + (yArr[j] - yAvg) * scareNumber); //右中
                            ctx.lineTo(center - (xArr[j + 1] - xAvg) * scareNumber, center + (yArr[j + 1] - yAvg) * scareNumber); //左中
                            ctx.stroke();
                        }
                        ctx.closePath();
                    }
                }]);

                return TraceDrawer;
            }();

            _export("default", TraceDrawer);
        }
    };
});
//# sourceMappingURL=trace_drawer.js.map
