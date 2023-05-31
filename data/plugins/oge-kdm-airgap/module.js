'use strict';

System.register(['./css/style.css!', 'lodash', 'jquery', 'app/plugins/sdk', './airgap_circle_ctrl.js', './airgap_charts_ctrl.js', './datasource_util.js'], function (_export, _context) {
  "use strict";

  var _, $, MetricsPanelCtrl, AirgapCircleCtrl, AirgapChartsCtrl, DatasourceUtil, _createClass, panelDefaults, AirgapCtrl;

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
    setters: [function (_cssStyleCss) {}, function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_airgap_circle_ctrlJs) {
      AirgapCircleCtrl = _airgap_circle_ctrlJs.default;
    }, function (_airgap_charts_ctrlJs) {
      AirgapChartsCtrl = _airgap_charts_ctrlJs.default;
    }, function (_datasource_utilJs) {
      DatasourceUtil = _datasource_utilJs.default;
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
        // 显示设置
        tabIndex: 2, //显示哪一个标签页, 获取波形的什么数据
        isCoaxial: false, //是否同轴
        bar: {
          isAlignPhase: false, //相位对齐
          isShowOutline: false, //显示轮廓
          isShowExtension: false //显示伸长
        },
        circle: {
          canvasShow: {
            JXYTC: true, //间隙圆填充（黄色块）
            ZZZXY: true, //转子中心圆
            CJZSZ: true, //磁极指示针
            JXCKY: true, //间隙参考圆
            DZCKY: true, //定子参考圆（外圈圆，青色）
            ZZCKY: false, //转子参考圆（内圈圆，所有定子平均值，绿色）
            SZXBC: true, //十字型标尺
            WHXBC: true, //五环型标尺
            TDBJH: true //通道标记号
          }
        }
      };

      _export('PanelCtrl', _export('AirgapCtrl', AirgapCtrl = function (_MetricsPanelCtrl) {
        _inherits(AirgapCtrl, _MetricsPanelCtrl);

        function AirgapCtrl($scope, $injector, $rootScope) {
          _classCallCheck(this, AirgapCtrl);

          var _this = _possibleConstructorReturn(this, (AirgapCtrl.__proto__ || Object.getPrototypeOf(AirgapCtrl)).call(this, $scope, $injector));

          _this.$timeout = $injector.get('$timeout');
          _this.templateSrv = $injector.get('templateSrv');
          _.defaultsDeep(_this.panel, panelDefaults);

          _this.ctrlCircle = new AirgapCircleCtrl(_this);
          _this.ctrlCharts = new AirgapChartsCtrl(_this);

          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('render', _this.onRender.bind(_this));
          return _this;
        }

        _createClass(AirgapCtrl, [{
          key: 'onDataError',
          value: function onDataError(e) {
            console.error(e);
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            // this.addEditorTab('Options','public/plugins/oge-kdm-airgap/editor.html', 2);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(data) {
            console.log("onDataReceived.....", data);

            if (!this.datasource || !this.datasource.kdmUrl) {
              console.error("数据源没有配置KDM地址,请选择正确的数据源");
              return;
            }

            if (!data || !data.currentTime || _.isEmpty(data.kksList)) {
              this.time = null;
              console.info("该时间段内没有波形数据!");
              return;
            }

            this.kksList = data.kksList;
            //更换机组号
            var jz = this.templateSrv.replace("$jz");
            if (jz !== "$jz") {
              for (var i = 0; i < this.kksList; i++) {
                var temp = this.kksList[i].kks;
                if (temp) {
                  var indexof = temp.indexOf('HP', 1);
                  if (indexof !== -1) {
                    this.kksList[i].kks = temp.substring(0, indexof + 2) + jz + temp.substring(indexof + 3);
                  }
                }
              }
            }

            this.time = data.currentTime;
            this.render();
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            var _this2 = this;

            //气隙轮廓; 棒图
            if (this.kksList) {
              if (this.panel.tabIndex <= 1) {
                this.ctrlCharts._render(this.elem);
              } else {

                this.ctrlCircle._dataReceived(this.kksList, this.time).then(function (data) {
                  _this2.ctrlCircle._render(_this2.elem);
                });
              }
            }
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            ctrl.elem = elem;
          }
        }, {
          key: 'changeSwitch',
          value: function changeSwitch(obj, prop, isRender) {
            obj[prop] = !obj[prop];
            if (isRender) this.render();
          }
        }, {
          key: 'changeWaveTab',
          value: function changeWaveTab(index) {
            this.panel.tabIndex = index;
            this.render();
          }
        }, {
          key: 'getWaveDataByTime',
          value: function getWaveDataByTime(time, dataType, kksInfo) {
            return DatasourceUtil.getWaveDataByTime(this.datasource, time, dataType, kksInfo);
          }
        }]);

        return AirgapCtrl;
      }(MetricsPanelCtrl)));

      _export('AirgapCtrl', AirgapCtrl);

      AirgapCtrl.templateUrl = 'module.html';

      _export('PanelCtrl', AirgapCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
