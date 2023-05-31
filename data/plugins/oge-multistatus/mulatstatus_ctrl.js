'use strict';

System.register(['app/plugins/sdk', 'angular', 'lodash', 'jquery', './css/multistat-panel.css!', 'app/core/utils/kbn', 'app/core/config', 'app/core/time_series2'], function (_export, _context) {
  "use strict";

  var OgeAlertMetricsPanelCtrl, angular, _, $, kbn, config, TimeSeries, _typeof, _createClass, panelDefaults, that, MultistatusCtrl;

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
      OgeAlertMetricsPanelCtrl = _appPluginsSdk.OgeAlertMetricsPanelCtrl;
    }, function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_cssMultistatPanelCss) {}, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

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
        data: [],
        fontSizes: [],
        valueNum: 6,
        minValue: 0,
        minTwoValue: 1,
        minThreeValue: 2,
        maxValue: 3,
        valueEHeight: 100,
        valueFontSize: '100%',
        titleFontSize: '100%',
        BackgroundEColor: "red",
        marginLandR: 3,
        showState: false,
        valuesUrl: '',
        series: [],
        pointNamesSaris: '',
        mappingTypes: [{ name: 'value to text', value: 1 }, { name: 'range to text', value: 2 }, { name: 'value to image', value: 3 }, { name: 'range to image', value: 4 }],
        coloringTypes: [{ name: 'value to color', value: 1 }, { name: 'range to color', value: 2 }],
        panelListUrl: [],
        valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
        rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
        valueMapsImg: [{ value: 'null', op: '=', text: 'N/A' }],
        rangeMapsImg: [{ from: 'null', to: 'null', text: 'N/A' }],
        valueColors: [{ thecolorSource: '',
          coloringType: 1,
          theColorvalues: [{ value: 'null', op: '=', color: 'red' }],
          theRangeColor: [{ from: 'null', to: 'null', color: 'red' }]
        }],
        // rangeColors: [
        //   { from: 'null', to: 'null', color: 'red' }
        // ],
        dataSources: [{ regexOne: '', alisa: '' }],
        mappingType: 1,
        showUnitOne: false,
        dataPrecise: 0,
        showNetUrl: false,
        titlePositionNow: '中上',
        statvalues: 'current',
        dataUnitPrecise: 1,
        // multiStatElem:{},
        multiStyle: {},
        theMainSource: '',
        theShowSource: '',
        theUrlSource: '',
        theUrlRegex: '',
        link: {
          type: 'dashboard'
        }
      };

      _export('MultistatusCtrl', MultistatusCtrl = function (_OgeAlertMetricsPanel) {
        _inherits(MultistatusCtrl, _OgeAlertMetricsPanel);

        function MultistatusCtrl($scope, $injector, backendSrv, templateSrv, timeSrv, linkSrv) {
          _classCallCheck(this, MultistatusCtrl);

          var _this = _possibleConstructorReturn(this, (MultistatusCtrl.__proto__ || Object.getPrototypeOf(MultistatusCtrl)).call(this, $scope, $injector, { showCover: true }));

          _.defaults(_this.panel, panelDefaults);
          _this.data = [];
          _this.dataTwo;
          _this.subTabIndex = 0;
          _this.multiStatElem = [];
          // that = this;
          _this.valueShowStatOptions = [{ text: 'Avg', value: 'avg' }, { text: 'Min', value: 'min' }, { text: 'Max', value: 'max' }, { text: 'Total', value: 'total' }, { text: 'Count', value: 'count' }, { text: 'Current', value: 'current' }];
          _this.titlePosition = ['左上', '中上', '右上', '左下', '中下', '右下'];
          _this.backendSrv = backendSrv;
          _this.timeSrv = timeSrv;
          _this.linkSrv = linkSrv;
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('render', _this.optionPanel.bind(_this));
          that = _this;
          // this.events.on('refresh', this.optionPanel.bind(this));
          return _this;
        }

        _createClass(MultistatusCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.panel.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
            this.addEditorTab('Options', 'public/plugins/oge-multistatus/editor.html', 2);
            this.addEditorTab('Value Mappings', 'public/plugins/oge-multistatus/mappings.html', 3);
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.onDataReceived([]);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            var dataTwo = [];
            dataTwo = dataList;
            //处理告警
            if (dataTwo !== null && dataTwo.length > 0 && dataTwo[0].alarm !== undefined) {
              for (var j = 0; j < dataTwo.length; j++) {
                dataTwo[j].alarm = dataList[j].alarm;
              }
            }
            if (dataList && dataList.length > 0) {
              for (var j = 0; j < dataList.length; j++) {
                if (dataList[j].datapoints === undefined || dataList[j].datapoints.length === 0 || !_.isArray(dataList[j].datapoints[0])) {
                  dataTwo[j].value = 'No datapoint!';
                  return;
                }
                var totalNum = 0;
                var statMax = dataList[j].datapoints[0][0];
                var statMin = dataList[j].datapoints[0][0];
                for (var i = 0; i < dataList[j].datapoints.length; i++) {
                  if (_.isArray(dataList[j].datapoints[i])) {
                    var value = dataList[j].datapoints[i][0];
                    if (statMax < value) {
                      statMax = value;
                    }
                    if (statMin > value) {
                      statMin = value;
                    }
                    totalNum += value;
                  } else {
                    dataTwo[j].value = '';
                  }
                }
                switch (this.panel.statvalues) {
                  case 'avg':
                    dataTwo[j].value = parseFloat((totalNum / dataList[j].datapoints.length).toFixed(this.panel.dataPrecise));
                    break;
                  case 'min':
                    dataTwo[j].value = parseFloat(statMin.toFixed(this.panel.dataPrecise));
                    break;
                  case 'max':
                    dataTwo[j].value = parseFloat(statMax.toFixed(this.panel.dataPrecise));
                    break;
                  case 'total':
                    dataTwo[j].value = parseFloat(totalNum.toFixed(this.panel.dataPrecise));
                    break;
                  case 'count':
                    dataTwo[j].value = parseFloat(dataList[j].datapoints.length);
                    break;
                  default:
                    var lastPoint = _.last(dataList[j].datapoints);
                    var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;
                    var firstValue = _.isArray(lastPoint) ? lastPoint[1] : null;
                    if (lastValue == null) {
                      dataTwo[j].value = '';
                    } else {
                      dataTwo[j].value = parseFloat(lastValue.toFixed(this.panel.dataPrecise));
                    }
                }
              }
            }
            this.dataTwo = this.objDeepCopy(dataTwo);
            var data = [];
            var dataShowSour = [];
            var reg = eval(this.panel.theMainSource);
            var regShow = eval(this.panel.theShowSource);
            dataShowSour = this.regexMultistatus(regShow, dataTwo);
            data = this.regexMultistatus(reg, dataTwo);
            if (dataShowSour) {
              if (data && data.length > 0) {
                if (data.length === dataShowSour.length) {
                  data = dataShowSour;
                } else if (data.length > dataShowSour.length) {
                  for (var m = dataShowSour.length; m < data.length; m++) {
                    data[m].value = '';
                    for (var n = 0; n < dataShowSour.length; n++) {
                      data[n] = dataShowSour[n];
                    }
                  }
                } else if (data.length < dataShowSour.length) {
                  for (var _n = 0; _n < data.length; _n++) {
                    data[_n] = dataShowSour[_n];
                  }
                }
              }
            }
            this.data = data;
            this.panel.data = data;
          }
        }, {
          key: 'objDeepCopy',
          value: function objDeepCopy(source) {
            var sourceCopy = source instanceof Array ? [] : {};
            for (var item in source) {
              sourceCopy[item] = _typeof(source[item]) === 'object' ? this.objDeepCopy(source[item]) : source[item];
            }
            return sourceCopy;
          }
        }, {
          key: 'optionPanel',
          value: function optionPanel() {
            if (this.data == undefined || this.data.length == 0) return;
            var multiStat = this.multiStatElem.find('.multi-stat');
            var multistatPanel = this.multiStatElem.find('.multistat-panel');
            var multiStatNamesSaris = this.multiStatElem.find('.pointNamesSaris');
            var multiStatValuesSaris = this.multiStatElem.find('.pointValuesSaris');
            var multiStatNamesSarisTwo = this.multiStatElem.find('.pointNamesSarisTwo');
            var backgroundOrFontColor = 'background';
            var pointNamesIndexBool = this.panel.pointNamesSaris.indexOf('{{index}}');
            if (multiStat.length < 1) return;
            for (var z = 0; z < multiStat.length; z++) {
              if (this.panel.pointNamesSaris == '') {
                multiStatNamesSaris[z].style.cssText = 'height:0px;';
                multiStatValuesSaris[z].style.cssText = 'height:100%;font-size:' + 2.5 * (parseFloat(this.panel.valueFontSize) / 100) + 'em;';
                multiStatValuesSaris[z].style.lineHeight = this.panel.valueEHeight - this.panel.valueEHeight * 0.08 + 'px';
                multiStatNamesSaris[z].innerHTML = '';
              } else if (pointNamesIndexBool >= 0) {
                var pointNamesSarisReplaceName = this.panel.pointNamesSaris.replace(/{{index}}/g, function () {
                  var pointNamesSarisReplaceIndex = z + 1 + '';
                  return pointNamesSarisReplaceIndex;
                });
                this.titlePositionStyle(z);
                if (this.panel.titlePositionNow === '左下' || this.panel.titlePositionNow === '右下' || this.panel.titlePositionNow === '中下') {
                  multiStatNamesSaris[z].innerHTML = '';
                  multiStatNamesSarisTwo[z].innerHTML = pointNamesSarisReplaceName;
                } else {
                  multiStatNamesSarisTwo[z].innerHTML = '';
                  multiStatNamesSaris[z].innerHTML = pointNamesSarisReplaceName;
                }
              } else {
                this.titlePositionStyle(z);
                if (this.panel.titlePositionNow === '左下' || this.panel.titlePositionNow === '右下' || this.panel.titlePositionNow === '中下') {
                  multiStatNamesSaris[z].innerHTML = '';
                  multiStatNamesSarisTwo[z].innerHTML = this.panel.pointNamesSaris;
                } else {
                  multiStatNamesSarisTwo[z].innerHTML = '';
                  multiStatNamesSaris[z].innerHTML = this.panel.pointNamesSaris;
                }
              }
              var theUnitShow = '';
              if (this.panel.showUnitOne) {
                if (this.panel.data[z].value >= 0 && this.panel.data[z].value < 1000) {
                  theUnitShow = this.panel.data[z].value;
                } else if (this.panel.data[z].value >= 1000 && this.panel.data[z].value < 1000000) {
                  theUnitShow = (this.panel.data[z].value / 1000).toFixed(this.panel.dataUnitPrecise) + 'K';
                } else if (this.panel.data[z].value >= 1000000 && this.panel.data[z].value < 1000000000) {
                  theUnitShow = (this.panel.data[z].value / 1000000).toFixed(this.panel.dataUnitPrecise) + 'Mil';
                } else if (this.panel.data[z].value >= 1000000000 && this.panel.data[z].value < 1000000000000) {
                  theUnitShow = (this.panel.data[z].value / 1000000000).toFixed(this.panel.dataUnitPrecise) + 'Bil';
                } else if (this.panel.data[z].value >= 1000000000000) {
                  theUnitShow = (this.panel.data[z].value / 1000000000000).toFixed(this.panel.dataUnitPrecise) + 'Tri';
                } else {
                  theUnitShow = this.panel.data[z].value;
                }
              } else {
                theUnitShow = this.panel.data[z].value;
              }
              multiStatValuesSaris[z].innerHTML = theUnitShow;
              this.data[z].color = 'red';
              if (this.panel.mappingType === 1) {
                for (var i = 0; i < this.panel.valueMaps.length; i++) {
                  var map = this.panel.valueMaps[i];
                  var value = parseFloat(map.value);
                  if (value === this.panel.data[z].value) {
                    if (map.text == '') {
                      multiStatValuesSaris[z].innerHTML = theUnitShow;
                    } else {
                      multiStatValuesSaris[z].innerHTML = map.text;
                    }
                  }
                }
              } else if (this.panel.mappingType === 2) {
                for (var _i2 = 0; _i2 < this.panel.rangeMaps.length; _i2++) {
                  var _map = this.panel.rangeMaps[_i2];
                  var from = parseFloat(_map.from);
                  var to = parseFloat(_map.to);
                  if (to > this.panel.data[z].value && from <= this.panel.data[z].value) {
                    if (_map.text == '') {
                      multiStatValuesSaris[z].innerHTML = theUnitShow;
                    } else {
                      multiStatValuesSaris[z].innerHTML = _map.text;
                    }
                  }
                }
              } else if (this.panel.mappingType === 3) {
                for (var _i3 = 0; _i3 < this.panel.valueMapsImg.length; _i3++) {
                  var _map2 = this.panel.valueMapsImg[_i3];
                  var value = parseFloat(_map2.value);
                  if (_map2.value === 'null' || _map2.text == 'N/A') {} else {
                    if (value === this.panel.data[z].value) {
                      if (_map2.text == '') {
                        multiStatValuesSaris[z].innerHTML = theUnitShow;
                      } else {
                        multiStat[z].innerHTML = "<img src='/public/img/" + _map2.text + "' style='width:100%;height:100%;' />";
                      }
                    }
                  }
                }
              } else if (this.panel.mappingType === 4) {
                for (var _i4 = 0; _i4 < this.panel.rangeMapsImg.length; _i4++) {
                  var _map3 = this.panel.rangeMapsImg[_i4];
                  var from = parseFloat(_map3.from);
                  var to = parseFloat(_map3.to);
                  if (_map3.value === 'null' || _map3.text == 'N/A') {} else {
                    if (to > this.panel.data[z].value && from <= this.panel.data[z].value) {
                      if (_map3.text == '') {
                        multiStatValuesSaris[z].innerHTML = theUnitShow;
                      } else {
                        multiStat[z].innerHTML = "<img src='/public/img/" + _map3.text + "' style='width:100%;height:100%;' />";
                      }
                    }
                  }
                }
              }
            }
            for (var _i = 0; _i < this.panel.valueColors.length; _i++) {
              var regColors = eval(this.panel.valueColors[_i].thecolorSource);
              var datasColor = this.regexMultistatus(regColors, this.dataTwo);
              if (datasColor && datasColor.length > 0) {
                for (var _z = 0; _z < multiStat.length; _z++) {
                  if (this.panel.valueColors[_i].coloringType === 1) {
                    for (var j = 0; j < this.panel.valueColors[_i].theColorvalues.length; j++) {
                      var _map4 = this.panel.valueColors[_i].theColorvalues[j];
                      var value = parseFloat(_map4.value);
                      if (datasColor.length < multiStat.length && _z >= datasColor.length) {
                        continue;
                      }
                      if (datasColor[_z].value === '') {
                        continue;
                      }
                      if (value === datasColor[_z].value) {
                        this.data[_z].color = _map4.color;
                      }
                    }
                  } else if (this.panel.valueColors[_i].coloringType === 2) {
                    for (var _j = 0; _j < this.panel.valueColors[_i].theRangeColor.length; _j++) {
                      var _map5 = this.panel.valueColors[_i].theRangeColor[_j];
                      var from = parseFloat(_map5.from);
                      var to = parseFloat(_map5.to);
                      if (datasColor.length < multiStat.length && _z >= datasColor.length) {
                        continue;
                      }
                      if (datasColor[_z].value === '') {
                        continue;
                      }
                      if (to > datasColor[_z].value && from <= datasColor[_z].value) {
                        this.data[_z].color = _map5.color;
                      }
                    }
                  }
                }
              }
            }
          }
        }, {
          key: 'initShowPanel',
          value: function initShowPanel(bOaColor, last) {
            var multistatPanel = this.multiStatElem.find('.multistat-panel');
            //每行显示个数计算和字体大小
            if (last) {
              this.optionPanel();
            }
            var multistatPanelWidth = (multistatPanel[0].offsetWidth - 12) / this.panel.valueNum - this.panel.marginLandR * 2;
            // var currFontSize = (multistatPanelWidth/16)*(parseFloat(this.panel.valueFontSize)/100);
            this.panel.multiStyle = {
              'width': multistatPanelWidth + "px",
              'height': this.panel.valueEHeight + "px",
              'fontSize': multistatPanelWidth / 16 + "px",
              'margin': this.panel.marginLandR + "px",
              'text-align': 'center',
              'float': 'left',
              'cursor': 'pointer',
              'position': 'relative',
              'background-color': bOaColor
            };
            this.panel.BackgroundEColor = bOaColor;

            return this.panel.multiStyle;
          }
        }, {
          key: 'titlePositionStyle',
          value: function titlePositionStyle(z) {
            var multiStat = this.multiStatElem.find('.multi-stat');
            var multiStatNamesSaris = this.multiStatElem.find('.pointNamesSaris');
            var multiStatValuesSaris = this.multiStatElem.find('.pointValuesSaris');
            var multiStatNamesSarisTwo = this.multiStatElem.find('.pointNamesSarisTwo');
            var height = multiStat[z].style.height;
            multiStatNamesSaris[z].style.cssText = 'height:0px;';
            multiStatValuesSaris[z].style.cssText = 'height:100%;font-size:' + 2.5 * (parseFloat(this.panel.valueFontSize) / 100) + 'em;line-height:' + height + ';';
            multiStatNamesSarisTwo[z].style.cssText = 'height:0px;';
            switch (this.panel.titlePositionNow) {
              case '左上':
                multiStatNamesSaris[z].style.cssText = 'font-size:' + 1.3 * (parseFloat(this.panel.titleFontSize) / 100) + 'em; position:absolute; left:3px; top:3px; width:fit-content;';
                break;
              case '中上':
                multiStatNamesSaris[z].style.cssText = 'font-size:' + 1.3 * (parseFloat(this.panel.titleFontSize) / 100) + 'em;position:absolute; left:50%; top:3px;width:auto;';
                var width = multiStatNamesSaris[z].offsetWidth;
                multiStatNamesSaris[z].style.cssText = 'font-size:' + 1.3 * (parseFloat(this.panel.titleFontSize) / 100) + 'em;position:absolute; left:50%; top:3px;width:auto;margin-left:' + -width / 2 + 'px;';
                break;
              case '右上':
                multiStatNamesSaris[z].style.cssText = 'font-size:' + 1.3 * (parseFloat(this.panel.titleFontSize) / 100) + 'em; position:absolute; right:3px; top:3px;width:fit-content;';
                break;
              case '左下':
                multiStatNamesSarisTwo[z].style.cssText = 'font-size:' + 1.3 * (parseFloat(this.panel.titleFontSize) / 100) + 'em; position:absolute; left:3px; bottom:3px;width:fit-content;';
                break;
              case '中下':
                multiStatNamesSarisTwo[z].style.cssText = 'font-size:' + 1.3 * (parseFloat(this.panel.titleFontSize) / 100) + 'em;position:absolute; left:50%; bottom:3px;width:auto;';
                var width = multiStatNamesSarisTwo[z].offsetWidth;
                multiStatNamesSarisTwo[z].style.cssText = 'font-size:' + 1.3 * (parseFloat(this.panel.titleFontSize) / 100) + 'em;position:absolute; left:50%; bottom:3px;width:auto;margin-left:' + -width / 2 + 'px;';
                break;
              default:
                multiStatNamesSarisTwo[z].style.cssText = 'font-size:' + 1.3 * (parseFloat(this.panel.titleFontSize) / 100) + 'em; position:absolute; right:3px; bottom:3px;width:fit-content;';
                break;
            }
          }
        }, {
          key: 'url',
          value: function url(index) {
            if (this.panel.link.type && this.panel.link.type === 'dashboard') {
              if (this.panel.link.dashUri === undefined || this.panel.link.dashUri === '') {
                this.panel.link.url = '';
                return;
              }
            } else if (this.panel.link.type && this.panel.link.type === 'absolute') {
              if (this.panel.link.url === undefined || this.panel.link.url === '') {
                this.panel.link.dashUri = '';
                return;
              }
            }

            var urlDatas;
            if (this.panel.theUrlSource) {
              var regx = eval(this.panel.theUrlSource);
              urlDatas = this.regexMultistatus(regx, this.dataTwo);
            } else {
              urlDatas = this.panel.data;
            }
            var str;
            var reg = eval(this.panel.theUrlRegex);
            var arr;
            if (reg === undefined || urlDatas.length === 0 || !urlDatas[0].target) {
              arr = [];
            } else {
              str = urlDatas[index].target;
              arr = reg.exec(str);
            }
            var inputParams = this.panel.link.paramsOne;
            var exceParams = [];
            var paramsReplace = void 0;
            exceParams[0] = inputParams;
            if (inputParams === '' || arr === null || arr.length === 0) {} else {
              for (var n = 0; n < arr.length; n++) {
                var ind = n + 1;
                var text = '$' + ind;
                if (arr[ind] === undefined) {} else {
                  paramsReplace = arr[ind].toUpperCase();
                }
                exceParams[n + 1] = exceParams[n].replace(text, paramsReplace);
              }
              this.panel.link.params = exceParams[n];
            }
            var theTemplates = this.templateSrv.variables;
            var linkInfo = this.linkSrv.getPanelLinkAnchorInfo(this.panel.link, theTemplates);
            // window.open(linkInfo.href, linkInfo.target); 
            var paramsNum = linkInfo.href.indexOf('?');
            var paramsNew = '';
            var dataRefId = this.panel.data[index].refId;
            var theNewIndex;
            var theTemplatesSectences = '';
            if (paramsNum !== -1) {
              if (linkInfo.href.length - paramsNum > 1) {
                paramsNew = '&';
              }
            } else {
              paramsNew = '?';
            }
            if (index < 10) {
              theNewIndex = '0' + index;
            } else {
              theNewIndex = index;
            }
            // if (dataRefId === undefined) {
            // for (var n=0; n<theTemplates.length; n++) {
            //   var jznumber = theTemplates[n].current.value;
            //   var jzName = theTemplates[n].name;
            //   theTemplatesSectences += '&var-' + jzName + '=' + jznumber;
            // }
            window.open(linkInfo.href + paramsNew + 'var-index=' + theNewIndex, linkInfo.target);
            // } else {
            //   var dataRefIdArr = dataRefId.split('_');
            //   if ( dataRefIdArr === undefined) {
            //     window.open( linkInfo.href + paramsNew +'var-index=' +  theNewIndex, linkInfo.target);
            //   } else if ( dataRefIdArr.length === 1) {
            //     window.open( linkInfo.href, linkInfo.target);
            //   } else {
            //     window.open( linkInfo.href + paramsNew +'var-jz=' +  dataRefIdArr[1] + '&var-dc=' + dataRefIdArr[0], linkInfo.target);
            //   }
            // }
          }
        }, {
          key: 'regexMultistatus',
          value: function regexMultistatus(reg, Alldata) {
            if (reg === undefined) {
              return Alldata;
            }
            var regexMulti = reg;
            var dataOne = [];
            if (reg && Alldata.length > 0 && Alldata[0].target) {
              for (var i = 0; i < Alldata.length; i++) {
                var str = Alldata[i].target;
                var val = str.match(reg);
                if (val) {
                  dataOne.push(Alldata[i]);
                }
              }
            }
            return dataOne;
          }
        }, {
          key: 'removeValueMap',
          value: function removeValueMap(map) {
            var index = _.indexOf(this.panel.valueMaps, map);
            this.panel.valueMaps.splice(index, 1);
            this.render();
          }
        }, {
          key: 'addValueMap',
          value: function addValueMap() {
            this.panel.valueMaps.push({ value: '', op: '=', text: '' });
          }
        }, {
          key: 'removeRangeMap',
          value: function removeRangeMap(rangeMap) {
            var index = _.indexOf(this.panel.rangeMaps, rangeMap);
            this.panel.rangeMaps.splice(index, 1);
            this.render();
          }
        }, {
          key: 'addRangeMap',
          value: function addRangeMap() {
            this.panel.rangeMaps.push({ from: '', to: '', text: '' });
          }
        }, {
          key: 'removeValueMapImg',
          value: function removeValueMapImg(mapImg) {
            var index = _.indexOf(this.panel.valueMapsImg, mapImg);
            this.panel.valueMapsImg.splice(index, 1);
            this.render();
          }
        }, {
          key: 'addValueMapImg',
          value: function addValueMapImg() {
            this.panel.valueMapsImg.push({ value: '', op: '=', text: '' });
          }
        }, {
          key: 'removeRangeMapImg',
          value: function removeRangeMapImg(rangeMapImg) {
            var index = _.indexOf(this.panel.rangeMapsImg, rangeMapImg);
            this.panel.rangeMapsImg.splice(index, 1);
            this.render();
          }
        }, {
          key: 'addRangeMapImg',
          value: function addRangeMapImg() {
            this.panel.rangeMapsImg.push({ from: '', to: '', text: '' });
          }
        }, {
          key: 'removeColorValue',
          value: function removeColorValue(valueColor, index) {
            var indexOne = _.indexOf(this.panel.valueColors[index].theColorvalues, valueColor);
            this.panel.valueColors[index].theColorvalues.splice(indexOne, 1);
            this.render();
          }
        }, {
          key: 'addColorValue',
          value: function addColorValue(index) {
            this.panel.valueColors[index].theColorvalues.push({ value: '', op: '=', color: 'red' });
          }
        }, {
          key: 'removeColorRang',
          value: function removeColorRang(rangColor, index) {
            var indexOne = _.indexOf(this.panel.valueColors[index].theRangeColor, rangColor);
            this.panel.valueColors[index].theRangeColor.splice(indexOne, 1);
            this.render();
          }
        }, {
          key: 'addColorRang',
          value: function addColorRang(index) {
            this.panel.valueColors[index].theRangeColor.push({ value: '', op: '=', color: 'red' });
          }
        }, {
          key: 'addTheValueColors',
          value: function addTheValueColors() {
            this.panel.valueColors.push({
              thecolorSource: '',
              coloringType: 1,
              theColorvalues: [{ value: 'null', op: '=', color: 'red' }],
              theRangeColor: [{ from: 'null', to: 'null', color: 'red' }]
            });
          }
        }, {
          key: 'removeTheValueColors',
          value: function removeTheValueColors(item) {
            var index = _.indexOf(this.panel.valueColors, item);
            this.panel.valueColors.splice(index, 1);
            this.render();
          }
        }, {
          key: 'removeHasSourceList',
          value: function removeHasSourceList(index) {
            this.panel.dataSources.splice(index, 1);
            this.render();
          }
        }, {
          key: 'addHasSourceList',
          value: function addHasSourceList() {
            this.panel.dataSources.push({ regexOne: '', alisa: '' });
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
            that.backendSrv.search({ query: that.panel.link.dashboard }).then(function (hits) {
              var dashboard = _.find(hits, { title: that.panel.link.dashboard });
              if (dashboard) {
                that.panel.link.dashUri = dashboard.uri;
                that.panel.link.title = dashboard.title;
              }
            });
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            ctrl.multiStatElem = elem;
          }
        }]);

        return MultistatusCtrl;
      }(OgeAlertMetricsPanelCtrl));

      _export('MultistatusCtrl', MultistatusCtrl);

      MultistatusCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=mulatstatus_ctrl.js.map
