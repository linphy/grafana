'use strict';

System.register(['lodash', 'app/plugins/sdk', './sprintf.js', './angular-sprintf.js', 'app/core/utils/kbn'], function (_export, _context) {
  "use strict";

  var _, isNumber, MetricsPanelCtrl, kbn, _createClass, panelDefaults, PictureItCtrl;

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
    setters: [function (_lodash) {
      _ = _lodash.default;
      isNumber = _lodash.isNumber;
    }, function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_sprintfJs) {}, function (_angularSprintfJs) {}, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
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
        valueMaps: [],
        seriesList: [],
        series: [],
        bgimage: '',
        sensors: [],
        height: '400px',
        width: '100px',
        mode: '平铺'
      };

      _export('PictureItCtrl', PictureItCtrl = function (_MetricsPanelCtrl) {
        _inherits(PictureItCtrl, _MetricsPanelCtrl);

        function PictureItCtrl($scope, $injector, templateSrv) {
          _classCallCheck(this, PictureItCtrl);

          var _this = _possibleConstructorReturn(this, (PictureItCtrl.__proto__ || Object.getPrototypeOf(PictureItCtrl)).call(this, $scope, $injector));

          _.defaults(_this.panel, panelDefaults);
          _this.displayModeOptions = [{
            name: '文本',
            value: 'text'
          }, {
            name: '值',
            value: 'value'
          }];

          _this.unitFormats = kbn.getUnitFormats();
          _this.templateSrv = templateSrv;
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('panel-initialized', _this.render.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          return _this;
        }

        _createClass(PictureItCtrl, [{
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            this.panel.valueMaps = [];
            for (var series = 0; series < dataList.length; series++) {
              var val = dataList[series].datapoints && dataList[series].datapoints.length > 0 ? dataList[series].datapoints[dataList[series].datapoints.length - 1][0] : null;
              this.panel.valueMaps.push({ name: dataList[series].refId, value: val });
            }
            this.render();
          }
        }, {
          key: 'deleteSensor',
          value: function deleteSensor(index) {
            this.panel.sensors.splice(index, 1);
          }
        }, {
          key: 'removeRightObj',
          value: function removeRightObj(arr, index) {
            arr.splice(index, 1);
          }
        }, {
          key: 'addSensor',
          value: function addSensor() {
            if (this.panel.sensors.length === 0) {
              var obj1 = {
                name: 'A',
                nameText: 'A-series',
                xlocation: 200,
                ylocation: 200,
                format: 'none',
                decimals: 2,
                bgcolor: 'rgba(0, 0, 0, 0.58)',
                color: '#FFFFFF',
                size: 22,
                bordercolor: 'rgb(251, 4, 4)',
                visible: true,
                rightType: false,
                rightObjectArr: [{
                  link_name: '',
                  link_url: '',
                  id: 'a' + 1 + 'b' + 1
                }],
                displayMode: 'text'
              };
              this.panel.sensors.push(obj1);
            } else {
              var lastSensor = this.panel.sensors[this.panel.sensors.length - 1];
              var obj2 = {
                name: lastSensor.name,
                nameText: lastSensor.nameText,
                xlocation: 200,
                ylocation: 200,
                format: lastSensor.format,
                decimals: lastSensor.decimals,
                bgcolor: lastSensor.bgcolor,
                color: lastSensor.color,
                size: lastSensor.size,
                bordercolor: lastSensor.bordercolor,
                visible: true,
                rightType: false,
                rightObjectArr: [{
                  link_name: '',
                  link_url: '',
                  id: 'a' + this.panel.sensors.length + 'b' + 1
                }],
                displayMode: 'text'
              };
              this.panel.sensors.push(obj2);
            }
          }
        }, {
          key: 'addRightObj',
          value: function addRightObj(arr) {
            arr.push({ link_name: '', link_url: '', id: 'a' + this.panel.sensors.length + 'b' + (arr.length + 1) });
          }
        }, {
          key: 'setUnitFormat',
          value: function setUnitFormat(subItem, index) {
            this.panel.sensors[index].format = subItem.value;
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/bessler-pictureit-panel/editor.html', 2);
          }
        }, {
          key: 'clickSensor',
          value: function clickSensor(url) {
            var link = this.templateSrv.replaceWithText(url, null);
            var url2 = link.replace(/\#/g, '%23');
            window.open(url2, '_self');
          }
        }, {
          key: 'mainStyle',
          value: function mainStyle() {
            var style = void 0;
            if (this.panel.mode === '平铺') {
              style = {
                'height': this.height,
                'width': '100%',
                'background-size': '100% 100%',
                'background-repeat': 'no-repeat',
                'background-image': 'url(' + this.panel.bgimage + ')'
              };
            } else {
              style = {
                'height': this.height,
                'width': '100%',
                'background-repeat': 'no-repeat',
                'background-image': 'url(' + this.panel.bgimage + ')',
                'background-position': 'center'
              };
            }
            return style;
          }
        }, {
          key: 'changeDisplayMode',
          value: function changeDisplayMode(sen) {
            console.log(sen);
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            var sensors = void 0;

            var $panelContainer = elem.find('.panel-container');

            function pixelStrToNum(str) {
              return parseInt(str.substr(0, str.length - 2));
            }
            function contextmenuFun(e) {
              e.preventDefault();
              $panelContainer.find('.pictureitCtrlP').find('.dropdown-menu').map(function (item) {
                $panelContainer.find('.pictureitCtrlP').find('.dropdown-menu')[item].style.display = 'none';
              });
              if (this.nextElementSibling.children.length === 1 && this.nextElementSibling.children[0].children[0].text === '') return;
              var menu = this.nextElementSibling;
              var xMiddle = $panelContainer[0].offsetWidth / 2;
              var yMiddle = $panelContainer[0].offsetHeight / 2;
              var xPostion = this.offsetParent.offsetLeft;
              var yPostion = this.offsetParent.offsetTop;
              menu.style.border = '1px solid #000000';
              menu.style.display = 'block';
              if (xPostion < xMiddle && yPostion < yMiddle) {
                menu.style.left = 0;
                menu.style.top = this.offsetHeight + 'px';
              } else if (xPostion > xMiddle && yPostion < yMiddle) {
                menu.style.left = this.offsetWidth - menu.offsetWidth + 'px';
                menu.style.top = this.offsetHeight + 'px';
              } else if (xPostion < xMiddle && yPostion > yMiddle) {
                menu.style.left = 0;
                menu.style.top = 0 - menu.offsetHeight + 'px';
              } else {
                menu.style.left = this.offsetWidth - menu.offsetWidth + 'px';
                menu.style.top = 0 - menu.offsetHeight + 'px';
              }
            }

            function clinkFunRemove(e) {
              if (e.which === 1) {
                // 兼容firefox
                $panelContainer.find('.pictureitCtrlP').find('.dropdown-menu').map(function (item) {
                  $panelContainer.find('.pictureitCtrlP').find('.dropdown-menu')[item].style.display = 'none';
                });
              }
            }
            function render() {
              if (!ctrl.panel.sensors) {
                return;
              }

              var width = pixelStrToNum($panelContainer.css('width'));
              var height = pixelStrToNum($panelContainer.css('height'));
              var sensorPointerCon = $panelContainer.find('.sensor-point');
              sensors = ctrl.panel.sensors;

              var _loop = function _loop(sensor) {
                sensors[sensor].visible = sensors[sensor].xlocation >= 0 && sensors[sensor].xlocation <= 100 && sensors[sensor].ylocation >= 0 && sensors[sensor].ylocation <= 100;
                sensors[sensor].ylocationStr = (sensors[sensor].ylocation / 100 * height).toString() + 'px';
                sensors[sensor].xlocationStr = (sensors[sensor].xlocation / 100 * width).toString() + 'px';
                sensors[sensor].sizeStr = sensors[sensor].size.toString() + 'px';
                // removeEventListener
                if (sensorPointerCon[sensor]) {
                  sensorPointerCon[sensor].addEventListener('contextmenu', contextmenuFun, false);
                  $panelContainer.find('.pictureitCtrlP')[0].addEventListener('click', clinkFunRemove, false);
                }

                if (sensors[sensor].displayMode === 'value') {
                  var val = ctrl.panel.valueMaps.filter(function (item) {
                    return item.name === sensors[sensor].name;
                  });
                  if (val.length > 0 && val[0].value !== undefined) {
                    // sensors[sensor].valueFormatted = kbn.valueFormats[sensors[sensor].format](val[0].value, sensors[sensor].decimals, null);
                    sensors[sensor].valueFormatted = val[0].value.toFixed(sensors[sensor].decimals) - 0 + sensors[sensor].format;
                  } else {
                    sensors[sensor].valueFormatted = '';
                  }
                } else {
                  sensors[sensor].valueFormatted = sensors[sensor].nameText;
                }
              };

              for (var sensor = 0; sensor < sensors.length; sensor++) {
                _loop(sensor);
              }
            }

            this.events.on('render', function () {
              render();
              ctrl.renderingCompleted();
            });
          }
        }]);

        return PictureItCtrl;
      }(MetricsPanelCtrl));

      _export('PictureItCtrl', PictureItCtrl);

      PictureItCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=pictureit_ctrl.js.map
