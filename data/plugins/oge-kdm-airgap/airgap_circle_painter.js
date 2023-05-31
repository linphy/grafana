'use strict';

System.register(['jquery', 'lodash'], function (_export, _context) {
  "use strict";

  var $, _, _createClass, AirgapCirclePainter, PaintUtils, NotUse;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_jquery) {
      $ = _jquery.default;
    }, function (_lodash) {
      _ = _lodash.default;
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

      AirgapCirclePainter = function () {
        //初始化：canvasSize默认是panel的高度
        function AirgapCirclePainter($cd, size, kksList, config) {
          _classCallCheck(this, AirgapCirclePainter);

          this._config = _.defaults(config, {
            rotorIndex: 0,
            currentIndex: 0
          });

          this.waveName = [];
          this.vars = {};
          this.lineXY = [];
          this.size = size;
          this.circleInterval = this.size / 12; //每个圆圈之间的间隔像素，12固定，因为总共要画5个圆（一个中心点），可以划分12段
          this.canvases = this.initCanvases(this.size, $cd);

          for (var i = 0; i < kksList.length; i++) {
            this.waveName.push(kksList[i].name);
          }
        }

        _createClass(AirgapCirclePainter, [{
          key: 'initCanvases',
          value: function initCanvases(size, $cd) {
            var canvases = {};

            $cd.find('canvas').each(function (i, e) {
              e.width = e.height = size;
              canvases[e.attributes.name.value] = e;
            });

            return canvases;
          }
        }, {
          key: 'prevRotor',
          value: function prevRotor() {
            this._config.rotorIndex--;
            if (this._config.rotorIndex <= 0) {
              this._config.rotorIndex = this.poleData.length - 1;
            }
            this.paintZZZXY();
          }
        }, {
          key: 'nextRotor',
          value: function nextRotor() {
            this._config.rotorIndex++;
            if (this._config.rotorIndex >= this.poleData.length - 1) {
              this._config.rotorIndex = 0;
            }
            this.paintZZZXY();
          }
        }, {
          key: 'prevIndex',
          value: function prevIndex() {
            this._config.currentIndex--;
            if (this._config.currentIndex <= 0) {
              this._config.currentIndex = this.poleData.length - 1;
            }
            this.paintZZZXY();
          }
        }, {
          key: 'nextIndex',
          value: function nextIndex() {
            this._config.currentIndex++;
            if (this._config.currentIndex >= this.poleData.length - 1) {
              this._config.currentIndex = 0;
            }
            this.paintZZZXY();
          }
        }, {
          key: 'draw',
          value: function draw(data) {
            this.poleData = data.yData;
            this.airgapData = data.airgapData;

            var sum = 0;
            var min = 100; // 一般最大不超过50
            var max = 0;
            for (var i = 0; i < this.airgapData.avgGaps.length; i++) {
              sum += this.airgapData.avgGaps[i];
              min = _.min([this.airgapData.avgGaps[i], min]);
              max = _.max([this.airgapData.avgGaps[i], max]);
            }
            this.tv_avgGapsInfo = {
              sum: sum,
              min: min,
              max: max,
              avg: sum / this.airgapData.avgGaps.length

              //处理磁极数据
            };this.setDealData(this.poleData);

            // <canvas name="JXYTC">间隙圆填充</canvas>
            // <canvas name="ZZZXY">转子中心圆</canvas>
            // <canvas name="CJZSZ">磁极指示针</canvas>
            // <canvas name="JXCKY">间隙参考圆</canvas>
            // <canvas name="DZCKY">定子参考圆</canvas>
            // <canvas name="ZZCKY">转子参考圆</canvas>
            // <canvas name="SZXBC">十字型标尺</canvas>
            // <canvas name="WHXBC">五环型标尺</canvas>
            // <canvas name="TDBJH">通道标记号</canvas>

            //坐标轴

            // // 转子圆
            this.paintJXYTC();
            this.paintZZZXY();
            // this.paintCJZSZ();
            this.paintJXCKY();
            this.paintDZCKY();
            this.paintZZCKY();
            this.paintSZXBC();
            this.paintWHXBC();
            this.paintTDBJH();
          }
        }, {
          key: 'paintWHXBC',
          value: function paintWHXBC() {
            var ctx = this.canvases.WHXBC.getContext('2d');
            ctx.strokeStyle = "white";
            for (var i = 1; i <= 5; i++) {
              PaintUtils.drawCircle(ctx, i * this.circleInterval, this.size / 2);
            }
          }
        }, {
          key: 'paintZZCKY',
          value: function paintZZCKY() {
            var ctx = this.canvases.ZZCKY.getContext('2d');
            //转子参考圆：圆心就是实际圆心;半径就是+X传感器平均气隙
            ctx.strokeStyle = "green";
            var r = 3 * this.circleInterval + (this.dealData.avg - this.dealData.min) / (this.dealData.max - this.dealData.min) * this.circleInterval / 3;
            PaintUtils.drawCircle(ctx, r, this.size / 2);
          }
        }, {
          key: 'paintDZCKY',
          value: function paintDZCKY() {
            var ctx = this.canvases.DZCKY.getContext('2d');
            ctx.strokeStyle = "green";
            var radian = this.airgapData.result.statorAngle * Math.PI / 180;
            var x = this.size / 2 - Math.cos(radian) * this.airgapData.result.statorRoundness;
            var y = this.size / 2 - Math.sin(radian) * this.airgapData.result.statorRoundness;

            // 以四环为基线
            var r = 4 * this.circleInterval + (this.tv_avgGapsInfo.avg - this.tv_avgGapsInfo.min) / (this.tv_avgGapsInfo.max - this.tv_avgGapsInfo.min) * this.circleInterval;
            PaintUtils.drawCircle(ctx, r, x, y);
          }
        }, {
          key: 'paintJXCKY',
          value: function paintJXCKY() {
            var ctx = this.canvases.JXCKY.getContext('2d');
            ctx.strokeStyle = "blue";
            this.myBezierEllipse(ctx);
          }
        }, {
          key: 'paintJXYTC',
          value: function paintJXYTC() {
            var ctx = this.canvases.JXYTC.getContext('2d');
            ctx.fillStyle = 'yellow';
            this.myBezierEllipse(ctx);
            ctx.fill(); // 填充定子与转子之间的空隙（其实填充的所有）
          }
        }, {
          key: 'myBezierEllipse',
          value: function myBezierEllipse(ctx) {
            PaintUtils.BezierEllipse(ctx, this.airgapData.avgGaps, this.circleInterval, this.size, this.tv_avgGapsInfo.min, this.tv_avgGapsInfo.max);
          }
        }, {
          key: 'paintTDBJH',
          value: function paintTDBJH() {
            var ctx = this.canvases.TDBJH.getContext('2d');
            ctx.fillStyle = 'red';
            ctx.font = '20pt Calibri';

            var dataOuter = this.airgapData.avgGaps;
            for (var i = 0; i < dataOuter.length; i++) {
              var position = PaintUtils.getxy(i, dataOuter, this.circleInterval, this.size, this.tv_avgGapsInfo.min, this.tv_avgGapsInfo.max);
              ctx.fillText(i + 1, position[0], position[1]);
            }
          }
        }, {
          key: 'setDealData',
          value: function setDealData(yData) {
            var min = 0;
            var minIndex = 0;
            var max = 0;
            var maxIndex = 0;

            var avg = 0;
            var sum = 0;
            for (var x = 0; x < yData.length; x++) {
              if (x == 0 || min > yData[x]) {
                min = yData[x];
                minIndex = x;
              }
              if (max == 0 || max < yData[x]) {
                max = yData[x];
                maxIndex = x;
              }
              sum += yData[x];
            }
            avg = sum / yData.length;
            var newYData = [];
            for (var x = 0; x < yData.length; x++) {
              var temp = (yData[x] - min) / (max - min) * this.circleInterval / 3; //（磁极数据 - 最小值） * 放大倍数
              newYData.push(temp);
            }
            this.dealData = {
              "min": min,
              "minIndex": minIndex,
              "max": max,
              "maxIndex": maxIndex,
              "avg": avg,
              "newPoleData": newYData
            };
          }
        }, {
          key: 'paintZZZXY',
          value: function paintZZZXY() {
            var ctx = this.canvases.ZZZXY.getContext('2d');
            ctx.clearRect(0, 0, this.size, this.size);
            var size = this.size;

            var circle = []; //磁极所有边缘数据
            var dashLine = []; //每根磁极线坐标
            var fiterData = this.dealData.newPoleData;
            var lineXY = this.lineXY;
            var sinAngle = 360 / this.poleData.length;

            //是否旋转转子: 中心点
            var tempSize = size;

            if (this._config.rotorIndex > 0) {
              ctx.save();
              ctx.translate(size / 2, size / 2);
              ctx.rotate(360 / this.poleData.length * this._config.rotorIndex * Math.PI / 180);
              tempSize = 0;
            }

            for (var i = 0; i < this.poleData.length; i++) {
              var angle = 360 - sinAngle * i;
              var radian = angle * Math.PI / 180;
              var r = 3 * this.circleInterval + fiterData[this.poleData.length - 1 - i]; //倒序
              var x = tempSize / 2 + r * Math.cos(radian);
              var y = tempSize / 2 + r * Math.sin(radian);

              dashLine.push([x, y]);
              lineXY.push([x, y]);

              //边缘数据：只有一个点，怎么连起来，看成一个圈？每个点左右移动1/2角度，一个左移，一个右移，画一条直线，做一个磁极
              var upTempAngle = angle + sinAngle / 2;
              var upRadian = upTempAngle * Math.PI / 180;
              var x2 = tempSize / 2 + r * Math.cos(upRadian);
              var y2 = tempSize / 2 + r * Math.sin(upRadian);
              circle.push([x2, y2]);

              var nextTempAngle = angle - sinAngle / 2;
              var nextRadian = nextTempAngle * Math.PI / 180;
              var x3 = tempSize / 2 + r * Math.cos(nextRadian);
              var y3 = tempSize / 2 + r * Math.sin(nextRadian);
              circle.push([x3, y3]);
            }

            //画每个磁极的边框，并填充背景
            ctx.strokeStyle = "red";
            for (var i = 0; i <= circle.length; i++) {
              if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(circle[i][0], circle[i][1]);
              } else if (i <= circle.length - 1) {
                ctx.lineTo(circle[i][0], circle[i][1]);
              } else {
                ctx.lineTo(circle[0][0], circle[0][1]);
                ctx.stroke();
                ctx.closePath();
              }
            }
            ctx.fillStyle = '#1f1d1d'; //与背景色一致，填充颜色
            ctx.fill();

            //画每根磁极虚线
            ctx.strokeStyle = "red";
            for (var i = 0; i < dashLine.length; i++) {
              //画内部线条，如果等于对应的索引，那么就
              if (i == dashLine.length - this._config.currentIndex - 1) {
                ctx.beginPath();
                ctx.moveTo(tempSize / 2, tempSize / 2);
                ctx.lineTo(dashLine[i][0], dashLine[i][1]);
                ctx.stroke();
                ctx.closePath();
              } else {
                PaintUtils.drawDashLine(ctx, tempSize / 2, tempSize / 2, dashLine[i][0], dashLine[i][1], 2); //画每根磁极虚线
              }
            }

            if (this._config.rotorIndex > 0) {
              ctx.restore();
            }
          }
        }, {
          key: 'paintSZXBC',
          value: function paintSZXBC() {
            var ctx = this.canvases.SZXBC.getContext('2d');
            var size = this.size;
            var coordinateInterval = size / 60;
            ctx.strokeStyle = "white";

            //X轴
            ctx.beginPath();
            ctx.moveTo(0, size / 2);
            ctx.lineTo(size, size / 2);
            ctx.stroke();
            ctx.closePath();
            //Y轴
            ctx.beginPath();
            ctx.moveTo(size / 2, 0);
            ctx.lineTo(size / 2, size);
            ctx.stroke();
            ctx.closePath();
            //X轴上的间隔
            for (var i = 0; i < size / coordinateInterval; i++) {
              ctx.beginPath();
              ctx.moveTo(coordinateInterval * (i + 1), size / 2);
              ctx.lineTo(coordinateInterval * (i + 1), size / 2 - 5);
              ctx.stroke();
              ctx.closePath();
            }
            //Y轴上的间隔
            for (var i = 0; i < size / coordinateInterval; i++) {
              ctx.beginPath();
              ctx.moveTo(size / 2, coordinateInterval * (i + 1));
              ctx.lineTo(size / 2 + 5, coordinateInterval * (i + 1));
              ctx.stroke();
              ctx.closePath();
            }
          }
        }, {
          key: 'info',
          value: function info(_info) {
            _.defaults(_info, {
              waves: [],
              current: {},
              rotor: {},
              character: {}
            });
            this.infoWaves(_info.waves);
            this.infoCurrent(_info.current);
            this.infoRotor(_info.rotor);
            this.infoCharacter(_info.character);
          }
        }, {
          key: 'infoWaves',
          value: function infoWaves(waves) {
            while (waves.length > 0) {
              // 清空
              waves.pop();
            }
            for (var i = 0; i < this.airgapData.avgGaps.length; i++) {
              waves.push({
                num: i + 1,
                name: this.waveName[i],
                angle: this.airgapData.sensorAngles[i],
                avg: this.airgapData.avgGaps[i].toFixed(2)
              });
            }
            return waves;
          }
        }, {
          key: 'infoCurrent',
          value: function infoCurrent(current) {
            var singelAngel = 360 / this.poleData.length;
            var poleIndex = this._config.currentIndex;

            function angel(index) {
              return index == 0 ? 0 : 360 - index * singelAngel;
            }

            current.JXJD = angel(this._config.rotorIndex);
            current.CJBH = poleIndex + 1;
            current.CJJD = angel(poleIndex);
            current.JSQX = this.poleData[poleIndex].toFixed(2);
          }
        }, {
          key: 'infoRotor',
          value: function infoRotor(rotor) {
            rotor.BYD = this.airgapData.result.rotor.toFixed(2);
            rotor.PXL = this.airgapData.result.statorRoundness.toFixed(2);
            rotor.PXJ = this.airgapData.result.statorAngle.toFixed(2);
          }
        }, {
          key: 'infoCharacter',
          value: function infoCharacter(character) {
            var singelAngel = 360 / this.poleData.length;

            character.CLZXQX = this.dealData.min.toFixed(2);
            character.CLZXCJBH = this.dealData.minIndex + 1;
            character.JSZXQXFW = 360 - this.dealData.minIndex * singelAngel;
            character.CLZDQX = this.dealData.max.toFixed(2);
            character.CLZDCJBH = this.dealData.maxIndex + 1;
            character.JSZDQXFW = 360 - this.dealData.maxIndex * singelAngel;
          }
        }]);

        return AirgapCirclePainter;
      }();

      _export('default', AirgapCirclePainter);

      PaintUtils = function () {
        function PaintUtils() {
          _classCallCheck(this, PaintUtils);
        }

        _createClass(PaintUtils, null, [{
          key: 'calDataOuterCircleData',
          value: function calDataOuterCircleData(dataOuter, circleInterval, size, min, max) {
            var tempDataOuter = [];
            if (dataOuter.length == 4) {
              for (var i = 0; i < dataOuter.length; i++) {
                tempDataOuter.push(dataOuter[i]);
                tempDataOuter.push(dataOuter[i]);
              }
            } else {
              tempDataOuter = dataOuter;
            }
            var circleData = [];
            for (var i = 0; i < tempDataOuter.length; i++) {
              var current = PaintUtils.getxy(i, tempDataOuter, circleInterval, size, min, max);
              circleData.push([current[0], current[1]]);
            }
            return circleData;
          }
        }, {
          key: 'getxy',
          value: function getxy(i, dataOuter, circleInterval, size, min, max) {
            var sinAngle = 360 / dataOuter.length;
            var angle = 360 - sinAngle * i;
            var radian = angle * Math.PI / 180;
            //每个磁极减去一个数量级，然后乘以另外一个数量级，画图容易区分，不然就是一个圆（精度不大）
            var r = 4 * circleInterval + (dataOuter[i] - min) / (max - min) * circleInterval;
            var x = size / 2 + r * Math.cos(radian);
            var y = size / 2 + r * Math.sin(radian);
            return [x, y];
          }
        }, {
          key: 'drawCircle',
          value: function drawCircle(ctx, r, x, y) {
            y = y || x;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.closePath();
          }
        }, {
          key: 'drawDashLine',
          value: function drawDashLine(ctx, x1, y1, x2, y2, dashLength) {
            ctx.beginPath();
            var dashLen = dashLength === undefined ? 5 : dashLength;
            var xpos = x2 - x1; //得到横向的宽度;
            var ypos = y2 - y1; //得到纵向的高度;
            var numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
            //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
            for (var i = 0; i < numDashes; i++) {
              if (i % 2 === 0) {
                ctx.moveTo(x1 + xpos / numDashes * i, y1 + ypos / numDashes * i); //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
              } else {
                ctx.lineTo(x1 + xpos / numDashes * i, y1 + ypos / numDashes * i);
              }
            }
            ctx.stroke();
            ctx.closePath();
          }
        }, {
          key: 'BezierEllipse',
          value: function BezierEllipse(ctx, dataOuter, circleInterval, size, min, max) {

            var circleData = PaintUtils.calDataOuterCircleData(dataOuter, circleInterval, size, min, max);

            var tempHeight = circleInterval - circleInterval * 0.1; //固定值

            if (circleData.length == 8) {
              ctx.beginPath();
              ctx.moveTo(circleData[0][0], circleData[0][1]);
              ctx.quadraticCurveTo(circleData[1][0] + tempHeight, circleData[1][1] - tempHeight, circleData[2][0], circleData[2][1]);
              ctx.quadraticCurveTo(circleData[3][0] - tempHeight, circleData[3][1] - tempHeight, circleData[4][0], circleData[4][1]);
              ctx.quadraticCurveTo(circleData[5][0] - tempHeight, circleData[5][1] + tempHeight, circleData[6][0], circleData[6][1]);
              ctx.quadraticCurveTo(circleData[7][0] + tempHeight, circleData[7][1] + tempHeight, circleData[0][0], circleData[0][1]);
              ctx.stroke();
              ctx.closePath();
            } else if (circleData.length == 4) {
              ctx.beginPath();
              ctx.moveTo(circleData[0][0], circleData[0][1]);
              ctx.quadraticCurveTo(circleData[1][0] + tempHeight, circleData[1][1] - tempHeight, circleData[2][0], circleData[2][1]);
              ctx.quadraticCurveTo(circleData[3][0] - tempHeight, circleData[3][1] - tempHeight, circleData[0][0], circleData[0][1]);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }]);

        return PaintUtils;
      }();

      NotUse = function () {
        function NotUse() {
          _classCallCheck(this, NotUse);
        }

        _createClass(NotUse, [{
          key: 'canvasWriteTxt',
          value: function canvasWriteTxt(fontColor, fontTxt, x, tempHeight) {
            this.yStart = this.yStart + tempHeight;

            var ctx = this.txtCtx;
            ctx.font = "12px";
            ctx.fillStyle = fontColor;
            ctx.fillText(fontTxt, x, this.yStart);
          }
        }, {
          key: 'getPointOnCanvas',
          value: function getPointOnCanvas(canvas, x, y) {
            var bbox = canvas.getBoundingClientRect();
            return {
              x: x - bbox.left * (canvas.width / bbox.width),
              y: y - bbox.top * (canvas.height / bbox.height)
            };
          }
        }, {
          key: 'drawSolidLine',
          value: function drawSolidLine(dataIndex) {
            var index = dataIndex;
            if (index == this.lineXY.length) {
              index = 0;
            }
            var ctx = ctx;
            //原来选中的要去除选中
            for (var i = 0; i < this.lineXY.length; i++) {
              ctx.strokeStyle = '#2F353B'; //与背景色一致，填充颜色
              ctx.beginPath();
              ctx.moveTo(this.size / 2, this.size / 2);
              ctx.lineTo(this.lineXY[i][0], this.lineXY[i][1]);
              ctx.stroke();
              ctx.closePath();

              ctx.strokeStyle = 'red';
              PaintUtils.drawDashLine(ctx, this.size / 2, this.size / 2, this.lineXY[i][0], this.lineXY[i][1], 2);
            }
          }
        }, {
          key: 'newBezierEllipse',
          value: function newBezierEllipse(circleData, dataOuter) {
            var tempHeight = this.circleInterval - this.circleInterval * 0.1; //固定值
            var ctx = ctx;
            ctx.beginPath();
            var endData = circleData[0];
            circleData.push(endData);

            for (var i = 0; i < circleData.length; i++) {
              var current = circleData[i];
              var up = circleData[i - 1];
              if (i > 0) {
                var tempData = [up[0], current[1]];
                if (i == 2 || i == 4) {
                  tempData = [current[0], up[1]];
                }
              }
              if (i == 0) {
                ctx.moveTo(circleData[i][0], circleData[i][1]);
              } else if (i == circleData.length - 1) {
                ctx.quadraticCurveTo(tempData[0], tempData[1], circleData[0][0], circleData[0][1]);
              } else {
                ctx.quadraticCurveTo(tempData[0], tempData[1], circleData[i][0], circleData[i][1]);
              }
            }
            ctx.stroke();
            ctx.closePath();
          }
        }], [{
          key: 'getK',
          value: function getK(X1, Y1, X2, Y2) {
            return (Y1 - Y2) / (X1 - X2);
          }
        }]);

        return NotUse;
      }();
    }
  };
});
//# sourceMappingURL=airgap_circle_painter.js.map
