'use strict';

System.register(['app/plugins/sdk', 'angular', 'lodash', 'jquery', './css/multistat-panel.css!', 'moment'], function (_export, _context) {
    "use strict";

    var OgeAlertMetricsPanelCtrl, angular, _, $, moment, _createClass, panelDefaults, that, MulticolTableCtrl;

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
        }, function (_cssMultistatPanelCss) {}, function (_moment) {
            moment = _moment.default;
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
                tableHeadTitels: []
            };

            _export('MulticolTableCtrl', MulticolTableCtrl = function (_OgeAlertMetricsPanel) {
                _inherits(MulticolTableCtrl, _OgeAlertMetricsPanel);

                function MulticolTableCtrl($scope, $injector, backendSrv, templateSrv, timeSrv, linkSrv) {
                    _classCallCheck(this, MulticolTableCtrl);

                    var _this = _possibleConstructorReturn(this, (MulticolTableCtrl.__proto__ || Object.getPrototypeOf(MulticolTableCtrl)).call(this, $scope, $injector, {
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
                    }, {
                        name: '数值映射',
                        value: 'valueMap'
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

                _createClass(MulticolTableCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.panel.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '130%', '140%', '150%', '160%', '170%', '200%'];
                        this.panel.fontPositions = [{ value: 'right', name: '右' }, { value: 'center', name: '居中' }, { value: 'left', name: '左' }];
                        this.addEditorTab('Options', 'public/plugins/oge_multicol_table/editor.html', 2);
                        this.addEditorTab('Url Setting', 'public/plugins/oge_multicol_table/urlsetting.html', 3);
                    }
                }, {
                    key: 'onDataError',
                    value: function onDataError(err) {
                        this.onDataReceived([]);
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        if (dataList && dataList.length > 0) {
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
                        this.data = dataList;
                        this.getdataAndRefId();
                        this.newCreate();
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
                        var link = outerIndex == 0 ? this.panel.tableHeadTitels[innerIndex].link : this.panel.tableArr[outerIndex][innerIndex].link;
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
                            'width': this.panel.tableHeadTitels[inde].colWidth,
                            'text-align': this.panel.fontposition
                        };
                        return this.panel.colStyle;
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
                            var rowLength = this.panel.tableArr.length;
                            for (var subtract = 1; this.panel.numFour[0] - rowLength - subtract >= 0; subtract++) {
                                //第一行是标题行
                                var subtractTableArr = new Array();
                                for (var row = 0; row < this.panel.numFour[1]; row++) {
                                    //行中的单元格数，列
                                    var tempArr = new Array();
                                    tempArr = {
                                        id: rowLength + subtract + "-" + (row + 1),
                                        target: "-",
                                        text: "-",
                                        fontsize: "100%",
                                        isAlertValue: false,
                                        alertValue1: 0,
                                        alertValue2: 10,
                                        displayMode: "text",
                                        count: rowLength * this.panel.numFour[1] + row,
                                        color: "",
                                        valueMap: [{ range: '', celText: '', id: "map-" + Math.ceil(Math.random() * 100000) }]
                                    };
                                    subtractTableArr.push(tempArr);
                                }
                                this.panel.tableArr.push(subtractTableArr);
                            }
                        } else if (this.panel.tableArr && this.panel.tableArr[1].length > this.panel.numFour[1]) {
                            //删除列
                            var columnLength = this.panel.tableArr[1].length;
                            for (var subtract = 0; columnLength - this.panel.numFour[1] - subtract > 0; subtract++) {
                                for (var column = 0; column < this.panel.tableArr.length; column++) {
                                    this.panel.tableArr[column].pop();
                                }
                            }
                        } else if (this.panel.tableArr && this.panel.tableArr[1].length < this.panel.numFour[1]) {
                            //添加列
                            var columnLength = this.panel.tableArr[1].length;
                            for (var column = 0; column < this.panel.tableArr.length; column++) {
                                for (var subtract = 0; this.panel.numFour[1] - columnLength - subtract > 0; subtract++) {
                                    var subtractTableArr = new Array();
                                    if (column == 0) {
                                        subtractTableArr = {
                                            id: 1 + "-" + (columnLength + subtract + 1),
                                            text: "",
                                            colWidth: '20%',
                                            displayMode: "text",
                                            count: columnLength + subtract,
                                            ismergeCell: false,
                                            mergeNumber: 1
                                        };
                                    } else {
                                        subtractTableArr = {
                                            id: column + 1 + "-" + (columnLength + subtract + 1),
                                            target: "-",
                                            text: "-",
                                            fontsize: "100%",
                                            isAlertValue: false,
                                            alertValue1: 0,
                                            alertValue2: 10,
                                            displayMode: "text",
                                            count: column * columnLength + columnLength + subtract + 1,
                                            color: "",
                                            valueMap: [{ range: '', celText: '', id: "map-" + Math.ceil(Math.random() * 100000) }]
                                        };
                                    }
                                    this.panel.tableArr[column].push(subtractTableArr);
                                }
                            }
                        } else {
                            var tableArr = new Array();
                            for (var column = 0; column < this.panel.numFour[0]; column++) {
                                //行
                                tableArr[column] = new Array();
                                for (var row = 0; row < this.panel.numFour[1]; row++) {
                                    var tableArrVal = this.panel.tableArr && this.panel.tableArr[column] && this.panel.tableArr[column][row] ? this.panel.tableArr[column][row] : false;
                                    if (column === 0) {
                                        tableArr[0][row] = {
                                            id: 1 + "-" + (row + 1),
                                            text: tableArrVal ? tableArrVal.text : "",
                                            colWidth: tableArrVal ? tableArrVal.colWidth : '20%',
                                            displayMode: tableArrVal ? tableArrVal.displayMode : "text",
                                            count: row,
                                            link: tableArrVal ? tableArrVal.link : {},
                                            ismergeCell: tableArrVal ? tableArrVal.ismergeCell : false,
                                            mergeNumber: tableArrVal ? tableArrVal.mergeNumber : 1
                                        };
                                    } else {
                                        var bool = tableArrVal && (tableArrVal.displayMode == 'value' || tableArrVal.displayMode == 'time') && tableArrVal.text !== '-';
                                        if (bool) {
                                            for (var i = 0; i < this.panel.dataAndRefId.length; i++) {
                                                if (tableArrVal.target === this.panel.dataAndRefId[i].target) {
                                                    tableArrVal.text = tableArrVal.displayMode == 'time' ? this.panel.dataAndRefId[i].time : this.panel.dataAndRefId[i].value;
                                                    tableArrVal.color = this.panel.dataAndRefId[i].color;
                                                }
                                            }
                                        } else if (tableArrVal.displayMode == 'valueMap') {
                                            this.changeDataShow(tableArrVal);
                                            tableArrVal = this.panel.tableArr[column][row];
                                        }
                                        tableArr[column][row] = { //填充单元格属性
                                            id: column + 1 + "-" + (row + 1),
                                            target: tableArrVal ? tableArrVal.target : "-",
                                            text: tableArrVal ? tableArrVal.text : "-",
                                            fontsize: tableArrVal ? tableArrVal.fontsize : "100%",
                                            isAlertValue: tableArrVal ? tableArrVal.isAlertValue : false,
                                            alertValue1: tableArrVal ? tableArrVal.alertValue1 : 0,
                                            alertValue2: tableArrVal ? tableArrVal.alertValue2 : 10,
                                            displayMode: tableArrVal ? tableArrVal.displayMode : "text",
                                            count: column * this.panel.numFour[1] + row,
                                            color: tableArrVal ? tableArrVal.color : "",
                                            link: tableArrVal ? tableArrVal.link : {},
                                            valueMap: tableArrVal ? tableArrVal.valueMap : [{ range: '', celText: '', id: "map-" + Math.ceil(Math.random() * 100000) }]
                                        };
                                    }
                                }
                                if (column === 0 && this.panel.tableArr) {
                                    var colMarginNum = 0;
                                    this.panel.tableHeadTitels = [];
                                    for (var row = 0; row < this.panel.tableArr[0].length; row++) {
                                        //填充标题列属性
                                        var tableArrVal = this.panel.tableArr[0][row];
                                        if (tableArrVal && tableArrVal.ismergeCell && tableArrVal.mergeNumber > 1) {
                                            colMarginNum = tableArrVal.mergeNumber - 1;
                                            this.panel.tableHeadTitels.push({
                                                id: 1 + "-" + (row + 1),
                                                text: tableArrVal ? tableArrVal.text : "",
                                                colWidth: tableArrVal ? tableArrVal.colWidth : '20%',
                                                displayMode: tableArrVal ? tableArrVal.displayMode : "text",
                                                count: row,
                                                link: tableArrVal ? tableArrVal.link : {},
                                                ismergeCell: tableArrVal ? tableArrVal.ismergeCell : false,
                                                mergeNumber: tableArrVal ? tableArrVal.mergeNumber : 1
                                            });
                                        } else if (colMarginNum > 0) {
                                            colMarginNum--;
                                        } else {
                                            this.panel.tableHeadTitels.push({
                                                id: 1 + "-" + (row + 1),
                                                text: tableArrVal ? tableArrVal.text : "",
                                                colWidth: tableArrVal ? tableArrVal.colWidth : '20%',
                                                displayMode: tableArrVal ? tableArrVal.displayMode : "text",
                                                count: row,
                                                link: tableArrVal ? tableArrVal.link : {},
                                                ismergeCell: tableArrVal ? tableArrVal.ismergeCell : false,
                                                mergeNumber: tableArrVal ? tableArrVal.mergeNumber : 1
                                            });
                                        }
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
                            for (var length = 0; length < this.data.length; length++) {
                                if (this.data[length].alarm && this.data[length].alarm.level !== undefined) {
                                    var color = this.getAlertLevelColor(this.data[length].alarm.level);
                                    var dataAndRefIdOptions = {
                                        target: "/" + this.data[length].target,
                                        name: this.data[length].target,
                                        value: this.data[length].value,
                                        time: this.data[length].time ? this.data[length].time : '-',
                                        color: color
                                    };
                                    this.panel.dataAndRefId.push(dataAndRefIdOptions);
                                } else {
                                    var dataAndRefIdOptions = {
                                        target: "/" + this.data[length].target,
                                        name: this.data[length].target,
                                        value: this.data[length].value,
                                        time: this.data[length].time ? this.data[length].time : '-',
                                        color: ''
                                    };
                                    this.panel.dataAndRefId.push(dataAndRefIdOptions);
                                }
                            }
                        }
                    }
                }, {
                    key: 'changeDataShow',
                    value: function changeDataShow(cell) {
                        //当改变cell中的值时
                        if (cell && cell.id) {
                            var newArr = cell.id.split('-');
                            if (cell.displayMode == 'value' || cell.displayMode == 'time' || cell.displayMode == 'valueMap') {
                                for (var i = 0; i < this.panel.dataAndRefId.length; i++) {
                                    if (cell.target === this.panel.dataAndRefId[i].target) {
                                        this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].text = cell.displayMode == 'value' || cell.displayMode == 'valueMap' ? this.panel.dataAndRefId[i].value : this.panel.dataAndRefId[i].time;
                                        this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].color = this.panel.dataAndRefId[i].color;
                                        if (cell.displayMode == 'valueMap' && cell.valueMap.length > 0) {
                                            this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].text = "";
                                            for (var j = 0; j < cell.valueMap.length; j++) {
                                                var rangeM = cell.valueMap[j].range.split(',');
                                                if (rangeM.length == 1 && rangeM[0] !== '' && rangeM[0] !== null && rangeM[0] !== undefined) {
                                                    if (Number(rangeM[0]) == this.panel.dataAndRefId[i].value) {
                                                        this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].text = cell.valueMap[j].celText;
                                                    }
                                                } else if (rangeM.length > 1 && rangeM[0] !== '' && rangeM[0] !== null && rangeM[0] !== undefined && rangeM[1] !== '' && rangeM[1] !== null && rangeM[1] !== undefined && Number(rangeM[0]) <= Number(rangeM[1])) {
                                                    if (this.panel.dataAndRefId[i].value >= Number(rangeM[0]) && this.panel.dataAndRefId[i].value <= Number(rangeM[1])) {
                                                        this.panel.tableArr[newArr[0] - 1][newArr[1] - 1].text = cell.valueMap[j].celText;
                                                    }
                                                }
                                            }
                                        }
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
                    key: 'addValueMap',
                    value: function addValueMap(cell) {
                        var randomValue = Math.ceil(Math.random() * 100000);
                        for (var i = 0; i < cell.valueMap.length; i++) {
                            if (cell.valueMap[i].id == "map-" + randomValue) {
                                randomValue = Math.ceil(Math.random() * 100000);
                            }
                        }
                        cell.valueMap.push({ range: '', celText: '', id: "map-" + randomValue });
                    }
                }, {
                    key: 'minusValueMap',
                    value: function minusValueMap(cell, ind) {
                        cell.valueMap.splice(ind, 1);
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

                return MulticolTableCtrl;
            }(OgeAlertMetricsPanelCtrl));

            _export('MulticolTableCtrl', MulticolTableCtrl);

            MulticolTableCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=multicoltable.js.map
