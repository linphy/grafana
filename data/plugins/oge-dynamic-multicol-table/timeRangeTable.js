'use strict';

System.register(['app/plugins/sdk', 'angular', 'lodash', 'jquery', './css/multistat-panel.css!', 'moment'], function (_export, _context) {
    "use strict";

    var OgeAlertMetricsPanelCtrl, angular, _, isNumber, $, moment, relativeTimeThreshold, _createClass, panelDefaults, that, TimeRangeTableTableCtrl;

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
            isNumber = _lodash.isNumber;
        }, function (_jquery) {
            $ = _jquery.default;
        }, function (_cssMultistatPanelCss) {}, function (_moment) {
            moment = _moment.default;
            relativeTimeThreshold = _moment.relativeTimeThreshold;
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
                Fmetrics: {},
                dataAndRefId: [],
                numFour: [2, 2],
                data: [],
                valueFontSize: '100%',
                valuesUrl: [],
                dataPrecise: 1,
                statvalues: 'current',
                fontSize: '100%',
                displayMode: 'text',
                fontposition: 'left',
                showRange: false,
                rangeAttri: {
                    value: '0',
                    timeList: []
                }
            };

            _export('TimeRangeTableTableCtrl', TimeRangeTableTableCtrl = function (_OgeAlertMetricsPanel) {
                _inherits(TimeRangeTableTableCtrl, _OgeAlertMetricsPanel);

                function TimeRangeTableTableCtrl($scope, $injector, backendSrv, templateSrv, timeSrv, linkSrv) {
                    _classCallCheck(this, TimeRangeTableTableCtrl);

                    var _this = _possibleConstructorReturn(this, (TimeRangeTableTableCtrl.__proto__ || Object.getPrototypeOf(TimeRangeTableTableCtrl)).call(this, $scope, $injector, {
                        showCover: true
                    }));

                    _.defaults(_this.panel, panelDefaults);
                    _this.displayModeOptions = [{
                        name: '文本',
                        value: 'text'
                    }, {
                        name: '值',
                        value: 'value'
                    }, {
                        name: '时间',
                        value: 'time'
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
                    _this.timeRangeLabelS = {
                        show: 'none',
                        xPos: 0,
                        currentVal: ''
                    };
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    that = _this;
                    return _this;
                }

                _createClass(TimeRangeTableTableCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.panel.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '130%', '140%', '150%', '160%', '170%', '200%'];
                        this.panel.fontPositions = [{ value: 'right', name: '右' }, { value: 'center', name: '居中' }, { value: 'left', name: '左' }];
                        this.addEditorTab('Options', 'public/plugins/oge-dynamic-multicol-table/editor.html', 2);
                        this.addEditorTab('Url Setting', 'public/plugins/oge-dynamic-multicol-table/urlsetting.html', 3);
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError(err) {
                        this.onDataReceived([]);
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        var _this2 = this;

                        if (dataList && dataList.length > 0) {
                            if (this.panel.showRange) {
                                this.panel.rangeAttri.timeList = [];
                                dataList.map(function (dl) {
                                    if (dl.datapoints && dl.datapoints.length > 0 && _.isArray(dl.datapoints[0])) {
                                        dl.datapoints.map(function (dldp) {
                                            if (_.isArray(dldp)) {
                                                if (_this2.panel.rangeAttri.timeList.indexOf(dldp[1]) == -1) {
                                                    _this2.panel.rangeAttri.timeList.push(dldp[1]);
                                                    _this2.panel.rangeAttri.timeList.sort(function (a, b) {
                                                        return a - b;
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            }

                            for (var j = 0; j < dataList.length; j++) {
                                if (!dataList[j].datapoints || dataList[j].datapoints.length === 0 || !_.isArray(dataList[j].datapoints[0])) {
                                    dataList[j].value = '';
                                    continue;
                                }
                                var totalNum = 0;
                                var statMax = dataList[j].datapoints[0][0];
                                var timeMax = dataList[j].datapoints[0][1];
                                var statMin = dataList[j].datapoints[0][0];
                                var timeMin = dataList[j].datapoints[0][1];
                                for (var i = 0; i < dataList[j].datapoints.length; i++) {
                                    if (_.isArray(dataList[j].datapoints[i])) {
                                        var value = dataList[j].datapoints[i][0];
                                        var time = dataList[j].datapoints[i][1];
                                        if (statMax < value) {
                                            statMax = value;
                                            timeMax = time;
                                        }
                                        if (statMin > value) {
                                            statMin = value;
                                            timeMin = time;
                                        }
                                        totalNum += value;
                                    } else {
                                        dataList[j].value = '';
                                    }
                                }

                                switch (this.panel.statvalues) {
                                    case 'avg':
                                        dataList[j].value = parseFloat((totalNum / dataList[j].datapoints.length).toFixed(this.panel.dataPrecise));
                                        break;
                                    case 'min':
                                        dataList[j].value = parseFloat(statMin.toFixed(this.panel.dataPrecise));
                                        dataList[j].time = moment(Number.parseInt(timeMin)).format("YYYY-MM-DD HH:mm:ss");
                                        break;
                                    case 'max':
                                        dataList[j].value = parseFloat(statMax.toFixed(this.panel.dataPrecise));
                                        dataList[j].time = moment(Number.parseInt(timeMax)).format("YYYY-MM-DD HH:mm:ss");
                                        break;
                                    case 'total':
                                        dataList[j].value = parseFloat(totalNum.toFixed(this.panel.dataPrecise));
                                        break;
                                    case 'count':
                                        dataList[j].value = parseFloat(dataList[j].datapoints.length);
                                        break;
                                    default:
                                        if (this.panel.showRange && this.panel.rangeAttri.timeList[this.panel.rangeAttri.value] !== undefined) {
                                            var isoint = dataList[j].datapoints[0];
                                            if (_.isArray(isoint)) {
                                                var curPointArr = dataList[j].datapoints.filter(function (item) {
                                                    return item[1] === _this2.panel.rangeAttri.timeList[_this2.panel.rangeAttri.value];
                                                });
                                                dataList[j].value = curPointArr.length > 0 ? parseFloat(curPointArr[0][0].toFixed(this.panel.dataPrecise)) : '';
                                                dataList[j].time = curPointArr.length > 0 ? moment(Number.parseInt(curPointArr[0][1])).format("YYYY-MM-DD HH:mm:ss") : '';
                                            } else {
                                                dataList[j].value = '';
                                            }
                                        } else {
                                            var lastPoint = _.last(dataList[j].datapoints);
                                            var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;
                                            if (lastValue == null) {
                                                dataList[j].value = '';
                                            } else {
                                                dataList[j].value = parseFloat(lastValue.toFixed(this.panel.dataPrecise));
                                                dataList[j].time = moment(Number.parseInt(lastPoint[1])).format("YYYY-MM-DD HH:mm:ss");
                                            }
                                        }
                                }
                            }
                            var timeRangeN = this.manualTableElem.find('.timerangen');
                            timeRangeN[0].max = this.panel.rangeAttri.timeList.length - 1;
                        }

                        this.data = dataList;
                        this.getdataAndRefId();
                        this.newCreate();
                    }
                }, {
                    key: 'rangeClickTime',
                    value: function rangeClickTime() {
                        var _this3 = this;

                        if (this.panel.showRange && this.panel.statvalues == 'current' && this.panel.rangeAttri.timeList[this.panel.rangeAttri.value]) {
                            this.data.map(function (dl) {
                                var isdlp = dl.datapoints[0];
                                if (_.isArray(isdlp)) {
                                    var curPointAr = dl.datapoints.filter(function (item) {
                                        return item[1] === _this3.panel.rangeAttri.timeList[_this3.panel.rangeAttri.value];
                                    });
                                    dl.value = curPointAr.length > 0 ? parseFloat(curPointAr[0][0].toFixed(_this3.panel.dataPrecise)) : '';
                                    dl.time = curPointAr.length > 0 ? moment(Number.parseInt(curPointAr[0][1])).format("YYYY-MM-DD HH:mm:ss") : '';
                                } else {
                                    dl.value = '';
                                }
                            });
                            this.getdataAndRefId();
                            this.newCreate();
                        }
                    }
                }, {
                    key: 'ogeAlertManualTable',
                    value: function ogeAlertManualTable(cell, cursor, outInd, innerInd) {
                        this.panel.tableStyle = {};
                        var fontStyle = 'normal';
                        var alertColor = '';
                        var bool = this.panel.tableArr[outInd][innerInd].link && this.panel.tableArr[outInd][innerInd].link.url;
                        if (bool) {
                            fontStyle = 'italic';
                        }
                        if (cell.isAlertValue && cell.displayMode === "value") {
                            var v1 = cell.alertValue1;
                            var v2 = cell.alertValue2;
                            var v = Number(cell.text);
                            if (!isNaN(v1) && v < v1) {
                                alertColor = this.getAlertLevelColor(1);
                            } else if (!isNaN(v1) && !isNaN(v2) && v >= v1 && v <= v2) {
                                alertColor = this.getAlertLevelColor(2);
                            } else if (!isNaN(v2) && v > v2) {
                                alertColor = this.getAlertLevelColor(3);
                            }
                        }
                        if (this.panel.ogeAlertEnabled && this.panel.ogeAlertColorType === 'B') {
                            this.panel.tableStyle = {
                                'font-size': cell.fontsize,
                                'font-style': fontStyle,
                                'background-color': alertColor ? alertColor : cell.color,
                                'text-align': this.panel.fontposition,
                                'cursor': cursor
                            };
                        } else if (this.panel.ogeAlertEnabled && this.panel.ogeAlertColorType === 'V') {
                            this.panel.tableStyle = {
                                'font-size': cell.fontsize,
                                'font-style': fontStyle,
                                'color': alertColor ? alertColor : cell.color,
                                'text-align': this.panel.fontposition,
                                'cursor': cursor
                            };
                        } else {
                            this.panel.tableStyle = {
                                'font-size': cell.fontsize,
                                'text-align': this.panel.fontposition,
                                'font-style': fontStyle
                            };
                        }
                        return this.panel.tableStyle;
                    }
                }, {
                    key: 'url',
                    value: function url(outerIndex, innerIndex) {
                        //你的代码，没有动
                        var link = this.panel.tableArr[outerIndex][innerIndex].link;
                        if (link && link.type && link.type === 'dashboard') {
                            if (link.dashUri === undefined || link.dashUri === '') {
                                link.url = '';
                                return;
                            }
                        } else if (link && link.type && link.type === 'absolute') {
                            if (link.url === undefined || link.url === '') {
                                link.dashUri = '';
                                return;
                            }
                        } else {
                            return;
                        }
                        var theTemplates = this.templateSrv.variables;
                        var linkInfo = this.linkSrv.getPanelLinkAnchorInfo(link, theTemplates);
                        window.open(linkInfo.href, linkInfo.target);
                    }
                }, {
                    key: 'newWidth',
                    value: function newWidth(inde) {
                        this.panel.colStyle = {
                            'width': this.panel.tableArr[0][inde].colWidth,
                            'text-align': this.panel.fontposition
                        };
                        return this.panel.colStyle;
                    }
                }, {
                    key: 'rangeMouseEnter',
                    value: function rangeMouseEnter(e) {
                        var elemWidth = this.manualTableElem.find('input[type=range]').innerWidth();
                        this.timeRangeLabelS.show = 'block';
                        if (e.offsetX >= elemWidth - 120) {
                            this.timeRangeLabelS.xPos = elemWidth - 120;
                        } else {
                            this.timeRangeLabelS.xPos = e.offsetX;
                        }
                        var currenPV = Math.floor(e.offsetX * this.panel.rangeAttri.timeList.length / elemWidth);
                        this.timeRangeLabelS.currentVal = moment(Number.parseInt(this.panel.rangeAttri.timeList[currenPV])).format("YYYY-MM-DD HH:mm:ss");
                    }
                }, {
                    key: 'rangeMouseLeave',
                    value: function rangeMouseLeave(e) {
                        this.timeRangeLabelS.show = 'none';
                    }
                }, {
                    key: 'timeRangeNHangeLabel',
                    value: function timeRangeNHangeLabel() {
                        return {
                            'position': 'fixed',
                            'z-index': 5,
                            'display': this.timeRangeLabelS.show,
                            'left': this.timeRangeLabelS.xPos + 'px',
                            'top': '10px'
                        };
                    }
                }, {
                    key: 'newCreate',
                    value: function newCreate() {
                        //这个方法创建了表格，并且控制表格的删除和增加
                        if (this.panel.tableArr && this.panel.tableArr.length > this.panel.numFour[0]) {
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
                                for (var row = 0; row < this.panel.numFour[1]; row++) {
                                    var tempArr = new Array();
                                    tempArr = {
                                        id: _rowLength + _subtract + "-" + (row + 1),
                                        target: "-",
                                        text: "-",
                                        fontsize: "100%",
                                        isAlertValue: false,
                                        alertValue1: 0,
                                        alertValue2: 10,
                                        displayMode: "text",
                                        count: _rowLength * this.panel.numFour[1] + row,
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
                                for (var column = 0; column < this.panel.tableArr.length; column++) {
                                    this.panel.tableArr[column].pop();
                                }
                            }
                        } else if (this.panel.tableArr && this.panel.tableArr[0].length < this.panel.numFour[1]) {
                            //添加列
                            var _columnLength = this.panel.tableArr[0].length;
                            for (var _column = 0; _column < this.panel.tableArr.length; _column++) {
                                for (var _subtract3 = 0; this.panel.numFour[1] - _columnLength - _subtract3 > 0; _subtract3++) {
                                    var subtractTableArr = new Array();
                                    if (_column == 0) {
                                        subtractTableArr = {
                                            id: 1 + "-" + (_columnLength + _subtract3 + 1),
                                            text: "",
                                            colWidth: '20%',
                                            displayMode: "text",
                                            count: _columnLength + _subtract3
                                        };

                                        this.panel.tableArr[_column].push(subtractTableArr);
                                    } else {
                                        subtractTableArr = {
                                            id: _column + 1 + "-" + (_columnLength + _subtract3 + 1),
                                            target: "-",
                                            text: "-",
                                            fontsize: "100%",
                                            isAlertValue: false,
                                            alertValue1: 0,
                                            alertValue2: 10,
                                            displayMode: "text",
                                            count: _column * _columnLength + _columnLength + _subtract3 + 1,
                                            color: ""
                                        };
                                        this.panel.tableArr[_column].push(subtractTableArr);
                                    }
                                }
                            }
                        } else {
                            var tableArr = new Array();
                            for (var _column2 = 0; _column2 < this.panel.numFour[0]; _column2++) {
                                tableArr[_column2] = new Array();
                                for (var _row = 0; _row < this.panel.numFour[1]; _row++) {
                                    //填充标题列属性
                                    var tableArrVal = this.panel.tableArr && this.panel.tableArr[_column2] && this.panel.tableArr[_column2][_row] ? this.panel.tableArr[_column2][_row] : false;
                                    if (_column2 === 0) {
                                        tableArr[_column2][_row] = {
                                            id: _column2 + 1 + "-" + (_row + 1),
                                            text: tableArrVal ? tableArrVal.text : "",
                                            colWidth: tableArrVal ? tableArrVal.colWidth : '20%',
                                            displayMode: tableArrVal ? tableArrVal.displayMode : "text",
                                            count: _column2 * this.panel.numFour[1] + _row,
                                            link: tableArrVal ? tableArrVal.link : {}
                                        };
                                    } else {
                                        var bool = tableArrVal && (tableArrVal.displayMode == 'value' || tableArrVal.displayMode == 'time');
                                        if (bool) {
                                            for (var i = 0; i < this.panel.dataAndRefId.length; i++) {
                                                if (tableArrVal.target === this.panel.dataAndRefId[i].target) {
                                                    tableArrVal.text = tableArrVal.displayMode == 'time' ? this.panel.dataAndRefId[i].time : this.panel.dataAndRefId[i].value;
                                                    tableArrVal.color = this.panel.dataAndRefId[i].color;
                                                }
                                            }
                                        }
                                        tableArr[_column2][_row] = { //填充单元格属性
                                            id: _column2 + 1 + "-" + (_row + 1),
                                            target: tableArrVal ? tableArrVal.target : "-",
                                            text: tableArrVal ? tableArrVal.text : "-",
                                            fontsize: tableArrVal ? tableArrVal.fontsize : "100%",
                                            isAlertValue: tableArrVal ? tableArrVal.isAlertValue : false,
                                            alertValue1: tableArrVal ? tableArrVal.alertValue1 : 0,
                                            alertValue2: tableArrVal ? tableArrVal.alertValue2 : 10,
                                            displayMode: tableArrVal ? tableArrVal.displayMode : "text",
                                            count: _column2 * this.panel.numFour[1] + _row,
                                            color: tableArrVal ? tableArrVal.color : "",
                                            link: tableArrVal ? tableArrVal.link : {}
                                        };
                                    }
                                }
                            }
                            this.panel.tableArr = tableArr;
                        }
                    }
                }, {
                    key: 'getdataAndRefId',
                    value: function getdataAndRefId() {
                        //获取value/name/color，并为target做了标识
                        this.panel.dataAndRefId = [];
                        if (this.data && this.data.length > 0) {
                            for (var _length = 0; _length < this.data.length; _length++) {
                                if (this.data[_length].alarm && this.data[_length].alarm.level !== undefined) {
                                    var color = this.getAlertLevelColor(this.data[_length].alarm.level);
                                    var dataAndRefIdOptions = {
                                        target: "/" + this.data[_length].target,
                                        name: this.data[_length].target,
                                        value: this.data[_length].value,
                                        time: this.data[_length].time ? this.data[_length].time : '-',
                                        color: color
                                    };
                                    this.panel.dataAndRefId.push(dataAndRefIdOptions);
                                } else {
                                    var dataAndRefIdOptions = {
                                        target: "/" + this.data[_length].target,
                                        name: this.data[_length].target,
                                        value: this.data[_length].value,
                                        time: this.data[_length].time ? this.data[_length].time : '-',
                                        color: ''
                                    };
                                    this.panel.dataAndRefId.push(dataAndRefIdOptions);
                                }
                            }
                        } else {
                            var dataSourceTargets = this.panel.targets;
                            for (var len = 0; length < dataSourceTargets.length; len++) {
                                var dataAndRefIdOptions = {
                                    target: "/" + (dataSourceTargets[len].targetName ? dataSourceTargets[len].targetName : dataSourceTargets[len].targetCode),
                                    name: dataSourceTargets[len].targetName ? dataSourceTargets[len].targetName : dataSourceTargets[len].targetCode,
                                    value: '',
                                    time: '-',
                                    color: ''
                                };
                                this.panel.dataAndRefId.push(dataAndRefIdOptions);
                            }
                        }
                    }
                }, {
                    key: 'changeDataShow',
                    value: function changeDataShow(cell) {
                        //当改变cell中的值时
                        if (cell && cell.id) {
                            var newArr = cell.id.split('-');
                            if (cell.displayMode == 'value' || cell.displayMode == 'time') {
                                for (var i = 0; i < this.panel.dataAndRefId.length; i++) {
                                    if (cell.target === this.panel.dataAndRefId[i].target) {
                                        this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].text = cell.displayMode == 'value' ? this.panel.dataAndRefId[i].value : this.panel.dataAndRefId[i].time;
                                        this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].color = this.panel.dataAndRefId[i].color;
                                    }
                                }
                            } else {
                                this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].text = cell.target;
                            }
                        }
                    }
                }, {
                    key: 'changeDisplayMode',
                    value: function changeDisplayMode(cell) {
                        if (cell && cell.id) {
                            var newArr = cell.id.split('-');
                            this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].text = '-';
                            this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].color = '';
                            cell.target = '-';
                        }
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

                return TimeRangeTableTableCtrl;
            }(OgeAlertMetricsPanelCtrl));

            _export('TimeRangeTableTableCtrl', TimeRangeTableTableCtrl);

            TimeRangeTableTableCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=timeRangeTable.js.map
