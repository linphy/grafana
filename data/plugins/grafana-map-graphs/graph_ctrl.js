'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'jquery', './pageing'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, moment, _, TimeSeries, $, pageing, _createClass, MapCtrl;

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
    }, function (_pageing) {
      pageing = _pageing.default;
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

      _export('MapCtrl', MapCtrl = function (_MetricsPanelCtrl) {
        _inherits(MapCtrl, _MetricsPanelCtrl);

        function MapCtrl($scope, $injector, $rootScope) {
          _classCallCheck(this, MapCtrl);

          var _this = _possibleConstructorReturn(this, (MapCtrl.__proto__ || Object.getPrototypeOf(MapCtrl)).call(this, $scope, $injector));

          _this.$rootScope = $rootScope;

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          return _this;
        }

        _createClass(MapCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/grafana-map-graphs/editor.html', 2);
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
            pageing(scope, elem, attrs, ctrl);
          }
        }]);

        return MapCtrl;
      }(MetricsPanelCtrl));

      _export('MapCtrl', MapCtrl);

      MapCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=graph_ctrl.js.map
