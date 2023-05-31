"use strict";

System.register(["jquery"], function (_export, _context) {
    "use strict";

    var $, _createClass, SpaceDrawer;

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

            SpaceDrawer = function () {
                function SpaceDrawer() {
                    _classCallCheck(this, SpaceDrawer);

                    this.canvasArr = [];
                    this.ctxArr = [];
                    this.width = 400;
                    this.currentPoint = [];
                    this.height = 200;
                    this.spaceData = null;
                    this.style = null;
                }

                _createClass(SpaceDrawer, [{
                    key: "resize",
                    value: function resize() {
                        this.height = this.width / 2;
                    }
                }, {
                    key: "init",
                    value: function init(htmlTarget, canvasSize) {
                        this.resize();
                        this.ctxArr = [];
                        var target = $(htmlTarget);
                        var html = "<canvas id='mycanvas0'></canvas>";
                        html += "<div style='z-index:2;margin-top:-205px;margin-left:100px'><canvas id='mycanvas3'></canvas></div>";
                        html += "<canvas id='mycanvas1'></canvas>";
                        html += "<div style='z-index:2;margin-top:-205px;margin-left:100px'><canvas id='mycanvas4'></canvas></div>";
                        html += "<canvas id='mycanvas2'></canvas>";
                        html += "<div style='z-index:2;margin-top:-205px;margin-left:100px'><canvas id='mycanvas5'></canvas></div>";
                        html += "<div style='z-index:-1;margin-top:-610px;'><canvas id='mycanvas6'></canvas></div>";
                        html += "<div style='z-index:-1;margin-top:-610px;'><canvas id='mycanvas7'></canvas></div>";
                        target.html(html);

                        for (var i = 0; i < 8; i++) {
                            var canvas = document.getElementById("mycanvas" + i);
                            this.canvasArr[i] = canvas;

                            canvas.width = this.width;
                            if (i == 3 || i == 4 || i == 5) {
                                canvas.width = this.height;
                            }

                            if (i <= 5) {
                                canvas.height = this.height;
                            } else {
                                //6-7是上下水的连线，高度等于宽度
                                canvas.height = this.height * 3;
                            }
                            this.ctxArr[i] = canvas.getContext("2d");
                        }
                    }
                }, {
                    key: "draw",
                    value: function draw(spaceData, drawStyle, p, bp1, bp2) {
                        if (p != -1) {
                            var i;

                            // 被盘1
                            i = bp1 * 2;
                            for (var j = 0; j < spaceData.data[i].length; j++) {
                                spaceData.data[i][j] -= spaceData.data[p * 2][j];
                            }
                            spaceData.avg[i] -= spaceData.avg[p * 2];
                            i++;
                            for (var j = 0; j < spaceData.data[i].length; j++) {
                                spaceData.data[i][j] -= spaceData.data[p * 2 + 1][j];
                            }
                            spaceData.avg[i] -= spaceData.avg[p * 2 + 1];

                            // 被盘2			
                            i = bp2 * 2;
                            for (var j = 0; j < spaceData.data[i].length; j++) {
                                spaceData.data[i][j] -= spaceData.data[p * 2][j];
                            }
                            spaceData.avg[i] -= spaceData.avg[p * 2];
                            i++;
                            for (var j = 0; j < spaceData.data[i].length; j++) {
                                spaceData.data[i][j] -= spaceData.data[p * 2 + 1][j];
                            }
                            spaceData.avg[i] -= spaceData.avg[p * 2 + 1];

                            // 盘
                            i = p * 2;
                            for (var j = 0; j < spaceData.data[i].length; j++) {
                                spaceData.data[i][j] = spaceData.avg[i];
                            }

                            i++;
                            for (var j = 0; j < spaceData.data[i].length; j++) {
                                spaceData.data[i][j] = spaceData.avg[i];
                            }
                        }

                        this.spaceData = spaceData;
                        this.style = drawStyle;

                        //1、正方形&点
                        for (var i = 0; i < 3; i++) {
                            this.drawFlipRectangle(this.width / 2, 100, this.ctxArr[i]);
                        }

                        //2、根据半径画圆
                        for (var i = 3; i < 6; i++) {
                            this.drawCircle(this.ctxArr[i], i - 3);
                        }

                        //4、画每个中心点连线（固定）
                        this.drawCenterLine();

                        //5、画上下水每个点的连线（变化）
                        this.drawPointLine(this.spaceData.drawStyle.pointIndex);

                        this.rotateX();
                    }
                }, {
                    key: "drawFlipRectangle",
                    value: function drawFlipRectangle(x, y, ctx) {
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'white';
                        ctx.beginPath();
                        var height = 100;
                        var width = 100;
                        ctx.moveTo(x - 100, y); //左中
                        ctx.lineTo(x + 100, y); //右中
                        ctx.lineTo(x + 100, y - 100); //右上
                        ctx.lineTo(x - 100, y - 100); //左上
                        ctx.lineTo(x - 100, y + 100); //左下
                        ctx.lineTo(x + 100, y + 100); //右下
                        ctx.lineTo(x + 100, y);
                        ctx.stroke();
                        ctx.closePath();

                        ctx.beginPath();
                        ctx.moveTo(x, y + height);
                        ctx.lineTo(x, y - height);
                        ctx.stroke();
                        ctx.closePath();

                        var sheight = height / 5;
                        var swidth = width / 5;
                        var length = width / 5;
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
                    value: function drawCircle(ctx, index) {
                        ctx.strokeStyle = 'white';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(this.height / 2, 100, this.style.circleR, 0, Math.PI * 2, true);
                        ctx.stroke();
                        ctx.closePath();

                        //3、每个圆圈里面的点
                        this.drawCirclePoint(ctx, index);
                    }
                }, {
                    key: "drawCirclePoint",
                    value: function drawCirclePoint(ctx, index) {
                        ctx.lineWidth = 0.1;
                        ctx.strokeStyle = 'white';
                        ctx.beginPath();

                        var xArr = this.spaceData.data[index * 2]; //x
                        var yArr = this.spaceData.data[index * 2 + 1]; //y
                        var xAvg = this.spaceData.avg[index * 2];
                        var yAvg = this.spaceData.avg[index * 2 + 1];

                        var center = this.height / 2;
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
                }, {
                    key: "drawPointLine",
                    value: function drawPointLine(j) {
                        var ctx = this.ctxArr[7];
                        var currentPoint = [];

                        //根据圆的半径，反推放大系数(45是默认圆半径)
                        var scareNumber = (this.style.circleR - 45) / 5 * 0.1 + 1;
                        var x = this.width / 2;

                        for (var m = 0; m < this.spaceData.data.length; m++) {
                            //0,2,4
                            var xArr = this.spaceData.data[m];
                            var yArr = this.spaceData.data[m + 1];
                            if (m == 0) {
                                currentPoint.push([x - (xArr[j] - this.spaceData.avg[0]) * scareNumber, 100 + (yArr[j] - this.spaceData.avg[1]) * scareNumber]);
                            } else if (m == 2) {
                                currentPoint.push([x - (xArr[j] - this.spaceData.avg[2]) * scareNumber, 305 + (yArr[j] - this.spaceData.avg[3]) * scareNumber]);
                            } else if (m == 4) {
                                currentPoint.push([x - (xArr[j] - this.spaceData.avg[4]) * scareNumber, 510 + (yArr[j] - this.spaceData.avg[5]) * scareNumber]);
                            }
                            m = m + 1;
                        }

                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(currentPoint[0][0], currentPoint[0][1]);
                        ctx.lineTo(currentPoint[1][0], currentPoint[1][1]);
                        ctx.lineTo(currentPoint[2][0], currentPoint[2][1]);
                        ctx.stroke();
                        ctx.closePath();

                        this.currentPoint = currentPoint;
                    }
                }, {
                    key: "drawCenterLine",
                    value: function drawCenterLine() {
                        var ctx = this.ctxArr[6];
                        ctx.strokeStyle = 'blue';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(this.width / 2, 100 - 5); //第1个中心点
                        ctx.lineTo(this.width / 2, 305); //第2个中心点
                        ctx.lineTo(this.width / 2, 505); //第3个中心点
                        ctx.stroke();
                        ctx.closePath();
                    }
                }, {
                    key: "rotateX",
                    value: function rotateX() {
                        for (var i = 0; i < 6; i++) {
                            //第一步：水平方向倾斜，第二步：x轴旋转
                            this.canvasArr[i].style.cssText = " -webkit-transform:  skew(" + this.style.angelIndex + "deg, 0deg) rotateX(" + this.style.angelIndex + "deg)";
                        }
                        this.reDrawPointLine();
                    }
                }, {
                    key: "reDrawPointLine",
                    value: function reDrawPointLine() {
                        var ctx = this.ctxArr[7];
                        ctx.clearRect(0, 0, this.width, this.height * 3);

                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        var newCurrentPoint = [];
                        var currentPoint = this.currentPoint;
                        for (var i = 0; i < currentPoint.length; i++) {
                            //水平方向倾斜反推
                            //var arr = getXY(currentPoint[i][0], currentPoint[i][1], width/2, (2*i+1) * 100);

                            //X轴旋转反推
                            var arr = this.getXY(currentPoint[i][0], currentPoint[i][1], currentPoint[i][0], (2 * i + 1) * 100);
                            arr[1] = arr[1] + i * 5; //上下每个canvas有5像素的间隔
                            newCurrentPoint.push(arr);
                        }
                        ctx.moveTo(newCurrentPoint[0][0], newCurrentPoint[0][1]);
                        ctx.lineTo(newCurrentPoint[1][0], newCurrentPoint[1][1]);
                        ctx.lineTo(newCurrentPoint[2][0], newCurrentPoint[2][1]);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }, {
                    key: "getXY",
                    value: function getXY(x, y, rx0, ry0) {
                        var angel = 0 - this.style.angelIndex;
                        var radian = 2 * Math.PI / 360 * angel;
                        var x0 = (x - rx0) * Math.cos(radian) - (y - ry0) * Math.sin(radian) + rx0;
                        var y0 = (x - rx0) * Math.sin(radian) + (y - ry0) * Math.cos(radian) + ry0;
                        return [x0, y0];
                    }
                }]);

                return SpaceDrawer;
            }();

            _export("default", SpaceDrawer);
        }
    };
});
//# sourceMappingURL=space_drawer.js.map
