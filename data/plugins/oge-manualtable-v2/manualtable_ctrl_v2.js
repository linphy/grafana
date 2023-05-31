'use strict';

System.register(['app/plugins/sdk', 'angular', 'lodash', 'jquery', './css/multistat-panel.css!', 'app/core/utils/kbn', 'app/core/config', 'app/core/time_series2'], function (_export, _context) {
    "use strict";

    var OgeAlertMetricsPanelCtrl, angular, _, $, kbn, config, TimeSeries, _typeof, _createClass, panelDefaults, that, ManualTableCtrl;

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
                dataAndRefId: [],
                numFour: [2, 2],
                data: [],
                valueFontSize: '100%',
                valuesUrl: [],
                dataPrecise: 1,
                statvalues: 'current',
                fontSize: '100%',
                displayMode: 'text',
                link: [{
                    type: 'dashboard'
                }]
            };

            _export('ManualTableCtrl', ManualTableCtrl = function (_OgeAlertMetricsPanel) {
                _inherits(ManualTableCtrl, _OgeAlertMetricsPanel);

                function ManualTableCtrl($scope, $injector, backendSrv, templateSrv, timeSrv, linkSrv) {
                    _classCallCheck(this, ManualTableCtrl);

                    var _this = _possibleConstructorReturn(this, (ManualTableCtrl.__proto__ || Object.getPrototypeOf(ManualTableCtrl)).call(this, $scope, $injector, {
                        showCover: true
                    }));

                    _.defaults(_this.panel, panelDefaults);
                    _this.displayModeOptions = [{
                        name: '文本',
                        value: 'text'
                    }, {
                        name: '值',
                        value: 'value'
                    }];
                    _this.valueShowStatOptions = [{
                        text: 'Avg',
                        value: 'avg'
                    }, {
                        text: 'Min',
                        value: 'min'
                    }, {
                        text: 'Max',
                        value: 'max'
                    }, {
                        text: 'Total',
                        value: 'total'
                    }, {
                        text: 'Count',
                        value: 'count'
                    }, {
                        text: 'Current',
                        value: 'current'
                    }];
                    _this.backendSrv = backendSrv;
                    _this.timeSrv = timeSrv;
                    _this.linkSrv = linkSrv;
                    _this.manualTableElem = [];
                    _this.panelNewHeight = '';
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    that = _this;
                    return _this;
                }

                _createClass(ManualTableCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.panel.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '130%', '140%', '150%', '160%', '170%', '200%'];
                        this.addEditorTab('Options', 'public/plugins/oge-manualtable-v2/editor.html', 2);
                        this.addEditorTab('Url Setting', 'public/plugins/oge-manualtable-v2/urlsetting.html', 3);
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError(err) {
                        this.onDataReceived([]);
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        var data = [];
                        data = dataList;
                        var compare = function compare(prop) {
                            return function (obj1, obj2) {
                                var val1 = obj1[prop];
                                var val2 = obj2[prop];
                                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                                    val1 = Number(val1);
                                    val2 = Number(val2);
                                }
                                if (val1 < val2) {
                                    return -1;
                                } else if (val1 > val2) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            };
                        };
                        //处理告警 (你原来的代码，删除了部分，改动了一下部分)   
                        if (dataList !== null && dataList.length > 0 && dataList[0].alarm !== undefined) {
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].alarm.level == 0) {
                                    data[j].color = '';
                                }
                                data[j].color = this.getAlertLevelColor(data[j].alarm.level);
                            }
                        }
                        if (dataList && dataList.length > 0) {
                            var dataOne = [];
                            var dataTwo = [];
                            for (var j = 0; j < dataList.length; j++) {
                                if (isNaN(Number(data[j].refId))) {
                                    dataOne.push(data[j]);
                                } else {
                                    dataTwo.push(data[j]);
                                }
                                if (dataList[j].datapoints === undefined || dataList[j].datapoints.length === 0 || !_.isArray(dataList[j].datapoints[0])) {
                                    dataList[j].value = '';
                                    data[j].value = '';
                                    continue;
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
                                        dataList[j].value = '';
                                    }
                                }
                                switch (this.panel.statvalues) {
                                    case 'avg':
                                        data[j].value = parseFloat((totalNum / dataList[j].datapoints.length).toFixed(this.panel.dataPrecise));
                                        break;
                                    case 'min':
                                        data[j].value = parseFloat(statMin.toFixed(this.panel.dataPrecise));
                                        break;
                                    case 'max':
                                        data[j].value = parseFloat(statMax.toFixed(this.panel.dataPrecise));
                                        break;
                                    case 'total':
                                        data[j].value = parseFloat(totalNum.toFixed(this.panel.dataPrecise));
                                        break;
                                    case 'count':
                                        data[j].value = parseFloat(dataList[j].datapoints.length);
                                        break;
                                    default:
                                        var lastPoint = _.last(dataList[j].datapoints);
                                        var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;
                                        var firstValue = _.isArray(lastPoint) ? lastPoint[1] : null;
                                        if (lastValue == null) {
                                            data[j].value = '';
                                        } else {
                                            data[j].value = parseFloat(lastValue.toFixed(this.panel.dataPrecise));
                                        }
                                }
                            }
                            dataOne = dataOne.sort(compare('refId'));
                            dataTwo = dataTwo.sort(compare('refId'));
                            data = dataOne.concat(dataTwo);
                        }
                        this.data = data;
                        this.panel.data = data;
                        this.getdataAndRefId();
                    }
                }, {
                    key: 'ogeAlertManualTable',
                    value: function ogeAlertManualTable(fontSize, color, cursor, innerIndex) {
                        //你的代码，没有动
                        var tbodyElem = this.manualTableElem.find('tbody');
                        this.panel.tableStyle = {};
                        if (innerIndex === 0) {
                            this.panel.tableStyle = {
                                'font-size': fontSize
                            };
                            return this.panel.tableStyle;
                        }
                        if (this.panel.ogeAlertEnabled && this.panel.ogeAlertColorType === 'B') {
                            this.panel.tableStyle = {
                                'font-size': fontSize,
                                'background-color': color,
                                'cursor': cursor
                            };
                        } else if (this.panel.ogeAlertEnabled && this.panel.ogeAlertColorType === 'V') {
                            this.panel.tableStyle = {
                                'font-size': fontSize,
                                'color': color,
                                'cursor': cursor
                            };
                        } else {
                            this.panel.tableStyle = {};
                        }
                        return this.panel.tableStyle;
                    }
                }, {
                    key: 'url',
                    value: function url(outerIndex, innerIndex) {
                        //你的代码，没有动
                        if (outerIndex === undefined) {
                            var urlIndex = innerIndex;
                        } else {
                            var urlIndex = outerIndex * this.panel.numFour[1] + innerIndex;
                        }
                        if (this.panel.link[urlIndex] && this.panel.link[urlIndex].type && this.panel.link[urlIndex].type === 'dashboard') {
                            if (this.panel.link[urlIndex].dashUri === undefined || this.panel.link[urlIndex].dashUri === '') {
                                this.panel.link[urlIndex].url = '';
                                return;
                            }
                        } else if (this.panel.link[urlIndex] && this.panel.link[urlIndex].type && this.panel.link[urlIndex].type === 'absolute') {
                            if (this.panel.link[urlIndex].url === undefined || this.panel.link[urlIndex].url === '') {
                                this.panel.link[urlIndex].dashUri = '';
                                return;
                            }
                        } else {
                            this.panel.link[urlIndex].url = '';
                            this.panel.link[urlIndex].dashUri = '';
                        }
                        var theTemplates = this.templateSrv.variables;
                        var linkInfo = this.linkSrv.getPanelLinkAnchorInfo(this.panel.link[urlIndex], theTemplates);
                        window.open(linkInfo.href, linkInfo.target);
                    }
                }, {
                    key: 'newWidth',
                    value: function newWidth(inde) {
                        this.panel.colStyle = {
                            'width': this.panel.tableArr[0][inde].colWidth
                        };
                        return this.panel.colStyle;
                    }
                }, {
                    key: 'newCreate',
                    value: function newCreate() {
                        //这个方法创建了表格，并且控制表格的删除和增加
                        if (this.panel.tableArr === undefined) {
                            //新建表格数组
                            var tableArr = new Array();
                            for (var column = 0; column < this.panel.numFour[0]; column++) {
                                tableArr[column] = new Array();
                                for (var row = 0; row < this.panel.numFour[1]; row++) {
                                    //填充标题列属性
                                    if (column === 0) {
                                        tableArr[column][row] = {
                                            id: column + 1 + "-" + (row + 1),
                                            text: "",
                                            colWidth: '20%',
                                            displayMode: "text",
                                            count: column * this.panel.numFour[1] + row
                                        };
                                    }
                                    tableArr[column][row] = { //填充单元格属性
                                        id: column + 1 + "-" + (row + 1),
                                        target: "-",
                                        text: "-",
                                        fontsize: "100%",
                                        displayMode: "text",
                                        count: column * this.panel.numFour[1] + row,
                                        color: ""
                                    };
                                }
                            }
                            this.panel.tableArr = tableArr;
                        } else if (this.panel.tableArr && this.panel.tableArr.length > this.panel.numFour[0]) {
                            //删除行
                            var rowLength = this.panel.tableArr.length;
                            for (var subtract = rowLength - this.panel.numFour[0]; subtract > 0; subtract--) {
                                this.panel.tableArr.pop();
                            }
                        } else if (this.panel.tableArr && this.panel.tableArr.length < this.panel.numFour[0]) {
                            //添加行
                            var _rowLength = this.panel.tableArr.length;
                            for (var _subtract = 1; this.panel.numFour[0] - _rowLength - _subtract >= 0; _subtract++) {
                                var _subtractTableArr = new Array();
                                for (var _row = 0; _row < this.panel.numFour[1]; _row++) {
                                    var tempArr = new Array();
                                    tempArr = {
                                        id: _rowLength + _subtract + "-" + (_row + 1),
                                        target: "-",
                                        text: "-",
                                        fontsize: "100%",
                                        displayMode: "text",
                                        count: _rowLength * this.panel.numFour[1] + _row,
                                        color: ""
                                    };
                                    _subtractTableArr.push(tempArr);
                                }
                                this.panel.tableArr.push(_subtractTableArr);
                            }
                        } else if (this.panel.tableArr && this.panel.tableArr[0].length > this.panel.numFour[1]) {
                            //删除列
                            var columnLength = this.panel.tableArr[0].length;
                            for (var _subtract2 = 0; columnLength - this.panel.numFour[1] - _subtract2 > 0; _subtract2++) {
                                for (var _column = 0; _column < this.panel.tableArr.length; _column++) {
                                    this.panel.tableArr[_column].pop();
                                }
                            }
                        } else if (this.panel.tableArr && this.panel.tableArr[0].length < this.panel.numFour[1]) {
                            //添加列
                            var _columnLength = this.panel.tableArr[0].length;
                            for (var _column2 = 0; _column2 < this.panel.tableArr.length; _column2++) {
                                for (var _subtract3 = 0; this.panel.numFour[1] - _columnLength - _subtract3 > 0; _subtract3++) {
                                    var subtractTableArr = new Array();
                                    if (_column2 == 0) {
                                        subtractTableArr = {
                                            id: 1 + "-" + (_columnLength + _subtract3 + 1),
                                            text: "",
                                            colWidth: '20%',
                                            displayMode: "text",
                                            count: _columnLength + _subtract3
                                        };

                                        this.panel.tableArr[_column2].push(subtractTableArr);
                                    } else {
                                        subtractTableArr = {
                                            id: _column2 + 1 + "-" + (_columnLength + _subtract3 + 1),
                                            target: "-",
                                            text: "-",
                                            fontsize: "100%",
                                            displayMode: "text",
                                            count: _column2 * _columnLength + _columnLength + _subtract3 + 1,
                                            color: ""
                                        };
                                        this.panel.tableArr[_column2].push(subtractTableArr);
                                    }
                                }
                            }
                        } else {
                            return;
                        }
                    }
                }, {
                    key: 'getdataAndRefId',
                    value: function getdataAndRefId() {
                        //获取value/name/color，并为target做了标识

                        if (this.panel.dataAndRefId == undefined || this.panel.dataAndRefId.length == 0) {
                            if (this.data.length === undefined) {
                                return;
                            } else if (this.data.length) {

                                for (var length = 0; length < this.data.length; length++) {
                                    if (this.data[length].color === undefined) {
                                        var dataAndRefIdOptions = {
                                            target: "/" + this.data[length].target,
                                            name: this.data[length].target,
                                            //value: this.data[length].value,
                                            color: ''
                                        };
                                        this.panel.dataAndRefId.push(dataAndRefIdOptions);
                                    } else if (this.data[length].color) {
                                        var dataAndRefIdOptions = {
                                            target: "/" + this.data[length].target,
                                            name: this.data[length].target,
                                            //value: this.data[length].value,
                                            color: this.data[length].color
                                        };
                                        this.panel.dataAndRefId.push(dataAndRefIdOptions);
                                    }
                                }
                            }
                        }
                        //---------删除kks查询时
                        else if (this.panel.data.length < this.panel.dataAndRefId.length) {
                                for (var i = 0; i < this.panel.dataAndRefId.length; i++) {
                                    var count = 0;
                                    for (var x = 0; x < this.panel.data.length; x++) {
                                        if ("/" + this.panel.data[x].target === this.panel.dataAndRefId[i].target) {
                                            /* this.panel.dataAndRefId[i] = {
                                                refId: "/" + this.panel.data[x].refId,
                                                name: this.panel.data[x].target,
                                                value: this.panel.data[x].value,
                                                color: this.panel.data[x].color
                                            } */
                                            break;
                                        } else {
                                            count++;
                                        }
                                    }
                                    if (count == this.panel.data.length) {
                                        this.panel.dataAndRefId.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                            //--------增加kks查询时
                            else if (this.panel.data.length > this.panel.dataAndRefId.length) {
                                    var newDataAndRefId = [];
                                    for (var _i = 0; _i < this.panel.data.length; _i++) {
                                        var dataAndRefIdOptions = {
                                            target: "/" + this.panel.data[_i].target,
                                            name: this.panel.data[_i].target,
                                            //value: this.panel.data[i].value,
                                            color: this.panel.data[_i].color
                                        };
                                        newDataAndRefId.push(dataAndRefIdOptions);
                                    }
                                    for (var _i2 = 0; _i2 < newDataAndRefId.length; _i2++) {
                                        var obj = newDataAndRefId[_i2];
                                        var target = obj.target;
                                        var isExist = false;
                                        for (var j = 0; j < this.panel.dataAndRefId.length; j++) {
                                            var aj = this.panel.dataAndRefId[j];
                                            var newTarget = aj.target;
                                            if (newTarget == target) {
                                                isExist = true;
                                                break;
                                            }
                                        }
                                        if (!isExist) {
                                            this.panel.dataAndRefId.push(obj);
                                        }
                                    }
                                }
                    }
                }, {
                    key: 'getText',
                    value: function getText(target) {
                        //get value for text
                        if (target == null) {
                            return " ";
                        }
                        if (target.substr(0, 1) === "/") {
                            for (var i = 0; i < this.panel.dataAndRefId.length; i++) {
                                if (target === "/" + this.panel.data[i].target) {
                                    return this.panel.data[i].value;
                                }
                            }
                        } else {
                            return target;
                        }
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
                    key: 'searchDashboards',
                    value: function searchDashboards(queryStr, callback) {
                        that.backendSrv.search({
                            query: queryStr
                        }).then(function (hits) {
                            var dashboards = _.map(hits, function (dash) {
                                return dash.title;
                            });
                            callback(dashboards);
                        });
                    }
                }, {
                    key: 'dashboardChanged',
                    value: function dashboardChanged(link) {
                        that.backendSrv.search({
                            query: link.dashboard
                        }).then(function (hits) {
                            var dashboard = _.find(hits, {
                                title: link.dashboard
                            });
                            if (dashboard) {
                                link.dashUri = dashboard.uri;
                                link.title = dashboard.title;
                            }
                        });
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        ctrl.manualTableElem = elem;
                        ctrl.panelNewHeight = ctrl.height;
                    }
                }]);

                return ManualTableCtrl;
            }(OgeAlertMetricsPanelCtrl));

            _export('ManualTableCtrl', ManualTableCtrl);

            ManualTableCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=manualtable_ctrl_v2.js.map
