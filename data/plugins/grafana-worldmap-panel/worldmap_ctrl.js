'use strict';

System.register(['app/plugins/sdk', 'app/core/time_series2', 'app/core/utils/kbn', 'lodash', './map_renderer', './data_formatter', './css/worldmap-panel.css!'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, TimeSeries, kbn, _, mapRenderer, DataFormatter, _createClass, panelDefaults, mapCenters, that, WorldmapCtrl;

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
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_map_renderer) {
      mapRenderer = _map_renderer.default;
    }, function (_data_formatter) {
      DataFormatter = _data_formatter.default;
    }, function (_cssWorldmapPanelCss) {}],
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
        maxDataPoints: 1,
        mapCenter: '(0째, 0째)',
        mapCenterLatitude: 0,
        mapCenterLongitude: 0,
        initialZoom: 1,
        valueName: 'total',
        circleMinSize: 2,
        circleMaxSize: 30,
        thePositronUrl: '',
        theDarkUrl: '',
        locationData: 'countries',
        thresholds: '0,10',
        colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],
        unitSingle: '',
        unitPlural: '',
        showLegend: true,
        esMetric: 'Count',
        decimals: 0,
        hideEmpty: false,
        hideZero: false,
        stickyLabels: false,
        deciEveryUrl: [{
          link: {
            type: 'dashboard'
          },
          currentPoint: '',
          theUseName: '',
          wordCut: ''
        }],
        mapDatas: [],
        panelDataPointsKey: []
      };
      mapCenters = {
        '(0째, 0째)': { mapCenterLatitude: 0, mapCenterLongitude: 0 },
        'North America': { mapCenterLatitude: 40, mapCenterLongitude: -100 },
        'Europe': { mapCenterLatitude: 46, mapCenterLongitude: 14 },
        'West Asia': { mapCenterLatitude: 26, mapCenterLongitude: 53 },
        'SE Asia': { mapCenterLatitude: 10, mapCenterLongitude: 106 }
      };

      WorldmapCtrl = function (_MetricsPanelCtrl) {
        _inherits(WorldmapCtrl, _MetricsPanelCtrl);

        function WorldmapCtrl($scope, $injector, backendSrv, linkSrv, templateSrv, timeSrv, contextSrv) {
          _classCallCheck(this, WorldmapCtrl);

          var _this = _possibleConstructorReturn(this, (WorldmapCtrl.__proto__ || Object.getPrototypeOf(WorldmapCtrl)).call(this, $scope, $injector));

          _this.setMapProvider(contextSrv);
          _.defaults(_this.panel, panelDefaults);

          _this.dataFormatter = new DataFormatter(_this, kbn);

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataSnapshotLoad.bind(_this));
          _this.backendSrv = backendSrv;
          _this.timeSrv = timeSrv;
          _this.linkSrv = linkSrv;
          _this.loadLocationDataFromFile();
          that = _this;
          return _this;
        }

        _createClass(WorldmapCtrl, [{
          key: 'setMapProvider',
          value: function setMapProvider(contextSrv) {
            this.tileServer = contextSrv.user.lightTheme ? 'CartoDB Positron' : 'CartoDB Dark';
            this.setMapSaturationClass();
          }
        }, {
          key: 'setMapSaturationClass',
          value: function setMapSaturationClass() {
            if (this.tileServer === 'CartoDB Dark') {
              this.saturationClass = 'map-darken';
            } else {
              this.saturationClass = '';
            }
          }
        }, {
          key: 'loadLocationDataFromFile',
          value: function loadLocationDataFromFile(reload) {
            var _this2 = this;

            if (this.map && !reload) return;

            if (this.panel.snapshotLocationData) {
              this.locations = this.panel.snapshotLocationData;
              return;
            }

            if (this.panel.locationData === 'jsonp endpoint') {
              if (!this.panel.jsonpUrl || !this.panel.jsonpCallback) return;

              window.$.ajax({
                type: 'GET',
                url: this.panel.jsonpUrl + '?callback=?',
                contentType: 'application/json',
                jsonpCallback: this.panel.jsonpCallback,
                dataType: 'jsonp',
                success: function success(res) {
                  _this2.locations = res;
                  _this2.render();
                }
              });
            } else if (this.panel.locationData === 'json endpoint') {
              if (!this.panel.jsonUrl) return;

              window.$.getJSON(this.panel.jsonUrl).then(function (res) {
                _this2.locations = res;
                _this2.render();
              });
            } else if (this.panel.locationData === 'table') {
              // .. Do nothing
            } else if (this.panel.locationData !== 'geohash') {
              window.$.getJSON('public/plugins/grafana-worldmap-panel/data/' + this.panel.locationData + '.json').then(this.reloadLocations.bind(this));
            }
          }
        }, {
          key: 'reloadLocations',
          value: function reloadLocations(res) {
            this.locations = res;
            this.refresh();
          }
        }, {
          key: 'onPanelTeardown',
          value: function onPanelTeardown() {
            if (this.map) this.map.remove();
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Worldmap', 'public/plugins/grafana-worldmap-panel/partials/editor.html', 2);
            this.addEditorTab('Url映射', 'public/plugins/grafana-worldmap-panel/partials/setUrl.html', 3);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            if (!dataList) return;
            this.dataList = dataList;
            if (this.dashboard.snapshot && this.locations) {
              this.panel.snapshotLocationData = this.locations;
            }

            var data = [];
            this.panel.mapDatas = [];
            if (this.panel.locationData === 'geohash') {
              this.dataFormatter.setGeohashValues(dataList, data);
            } else if (this.panel.locationData === 'table') {
              var tableData = dataList.map(DataFormatter.tableHandler.bind(this));
              this.dataFormatter.setTableValues(tableData, data);
            } else {
              this.series = dataList.map(this.seriesHandler.bind(this));
              this.dataFormatter.setValues(data);
            }
            this.data = data;
            //建立数据
            for (var key in dataList[0].datapoints[0]) {
              var bool = this.panel.panelDataPointsKey.indexOf(key);
              if (bool === -1) {
                this.panel.panelDataPointsKey.push(key);
              }
            }
            if (dataList && dataList.length > 0) {
              for (var z = 0; z < this.panel.deciEveryUrl.length; z++) {
                var mapDatasOne = [];
                for (var j = 0; j < dataList[0].datapoints.length; j++) {
                  var dataType = this.panel.deciEveryUrl[z].theUseName;
                  var dataStoreOne = dataList[0].datapoints[j][dataType];
                  mapDatasOne.push(dataStoreOne);
                }
                this.panel.mapDatas.push(mapDatasOne);
              }
            }

            this.updateThresholdData();
            this.render();
          }
        }, {
          key: 'onDataSnapshotLoad',
          value: function onDataSnapshotLoad(snapshotData) {
            this.onDataReceived(snapshotData);
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {
            var series = new TimeSeries({
              datapoints: seriesData.datapoints,
              alias: seriesData.target
            });

            series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
            return series;
          }
        }, {
          key: 'setNewMapCenter',
          value: function setNewMapCenter() {
            if (this.panel.mapCenter !== 'custom') {
              this.panel.mapCenterLatitude = mapCenters[this.panel.mapCenter].mapCenterLatitude;
              this.panel.mapCenterLongitude = mapCenters[this.panel.mapCenter].mapCenterLongitude;
            }
            this.mapCenterMoved = true;
            this.render();
          }
        }, {
          key: 'setZoom',
          value: function setZoom() {
            this.map.setZoom(this.panel.initialZoom || 1);
          }
        }, {
          key: 'toggleLegend',
          value: function toggleLegend() {
            if (!this.panel.showLegend) {
              this.map.removeLegend();
            }
            this.render();
          }
        }, {
          key: 'toggleStickyLabels',
          value: function toggleStickyLabels() {
            this.map.clearCircles();
            this.render();
          }
        }, {
          key: 'changeThresholds',
          value: function changeThresholds() {
            this.updateThresholdData();
            this.map.legend.update();
            this.render();
          }
        }, {
          key: 'updateThresholdData',
          value: function updateThresholdData() {
            this.data.thresholds = this.panel.thresholds.split(',').map(function (strValue) {
              return Number(strValue.trim());
            });
            while (_.size(this.panel.colors) > _.size(this.data.thresholds) + 1) {
              // too many colors. remove the last one.
              this.panel.colors.pop();
            }
            while (_.size(this.panel.colors) < _.size(this.data.thresholds) + 1) {
              // not enough colors. add one.
              var newColor = 'rgba(50, 172, 45, 0.97)';
              this.panel.colors.push(newColor);
            }
          }
        }, {
          key: 'changeLocationData',
          value: function changeLocationData() {
            this.loadLocationDataFromFile(true);

            if (this.panel.locationData === 'geohash') {
              this.render();
            }
          }
        }, {
          key: 'addAnotherUrl',
          value: function addAnotherUrl() {
            this.panel.deciEveryUrl.push({
              link: {
                type: 'dashboard'
              },
              currentPoint: '',
              theUseName: '',
              wordCut: ''
            });
          }
        }, {
          key: 'removeAnotherUrl',
          value: function removeAnotherUrl(index) {
            this.panel.deciEveryUrl.splice(index, 1);
          }
        }, {
          key: 'searchDashboards',
          value: function searchDashboards(queryStr, callback) {
            that.backendSrv.search({ query: queryStr }).then(function (hits) {
              var dashboards = _.map(hits, function (dash) {
                return dash.title;
              });
              callback(dashboards);
            });
          }
        }, {
          key: 'dashboardChanged',
          value: function dashboardChanged(link) {
            that.backendSrv.search({ query: link.dashboard }).then(function (hits) {
              var dashboard = _.find(hits, { title: link.dashboard });
              if (dashboard) {
                link.dashUri = dashboard.uri;
                link.title = dashboard.title;
              }
            });
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            mapRenderer(scope, elem, attrs, ctrl);
          }
        }]);

        return WorldmapCtrl;
      }(MetricsPanelCtrl);

      _export('default', WorldmapCtrl);

      WorldmapCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=worldmap_ctrl.js.map
