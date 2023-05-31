'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', 'vendor/echarts/echarts.min.js', 'jquery'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, moment, _, TimeSeries, echarts, $, _typeof, _createClass, panelDefaults, WaveCtrl;

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
        }, function (_vendorEchartsEchartsMinJs) {
            echarts = _vendorEchartsEchartsMinJs.default;
        }, function (_jquery) {
            $ = _jquery.default;
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
                tabIsShow: true, //是否显示标签页
                tabIndex: 0, //显示哪一个标签页, 获取波形的什么数据
                timeIsShow: true, //是否显示时间选择框
                timeIndex: 0, //默认数据索引
                currentSymbol: "circle", //键相显示方式
                showType: false,
                times: ''
            };

            _export('WaveCtrl', WaveCtrl = function (_MetricsPanelCtrl) {
                _inherits(WaveCtrl, _MetricsPanelCtrl);

                function WaveCtrl($scope, $injector, $rootScope, templateSrv, templateChange) {
                    _classCallCheck(this, WaveCtrl);

                    var _this = _possibleConstructorReturn(this, (WaveCtrl.__proto__ || Object.getPrototypeOf(WaveCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;
                    _this.templateChange = templateChange;
                    _.defaults(_this.panel, panelDefaults);

                    //是否显示下拉框
                    var options = [{
                        "name": "显示",
                        value: true
                    }, {
                        "name": "隐藏",
                        value: false
                    }];

                    //默认tabIndex下拉框
                    var tabOptions = [{
                        "name": "原始波形",
                        value: 0
                    }, {
                        "name": "阶次比",
                        value: 1
                    }, {
                        "name": "功率谱",
                        value: 2
                    }, {
                        "name": "相位谱",
                        value: 3
                    }];

                    //键相图标：symbolArr: ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']
                    var symbolArr = [{
                        "name": "圆形",
                        value: "circle"
                    }, {
                        "name": "正方形",
                        value: "rect"
                    }, {
                        "name": "正方形（圆角）",
                        value: "roundRect"
                    }, {
                        "name": "三角形",
                        value: "triangle"
                    }, {
                        "name": "钻石形",
                        value: "diamond"
                    }, {
                        "name": "大头针",
                        value: "pin"
                    }, {
                        "name": "箭头",
                        value: "arrow"
                    }];

                    //显示方式：同轴，分轴
                    var showTypeArr = [{
                        "name": "分轴",
                        value: 0
                    }, {
                        "name": "同轴",
                        value: 1
                    }];

                    _this.panel.options = options;
                    _this.panel.tabOptions = tabOptions;
                    _this.panel.symbolArr = symbolArr;
                    _this.panel.showTypeArr = showTypeArr;
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    return _this;
                }

                _createClass(WaveCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('Options', 'public/plugins/oge-kdm-wave/editor.html', 2);
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {

                        if (dataList == null || dataList.length == 0) {
                            console.error("no data found wave");
                            return;
                        }
                        var sType = _typeof(dataList[0]);
                        if (sType != "string") {
                            console.error("不匹配的数据类型，请检查数据源是否正确");
                            return;
                        }
                        this.panel.times = dataList[0];
                        var timeList = [];
                        for (var i = 0; i < dataList.length; i++) {
                            timeList.push({
                                value: i,
                                time: dataList[i]
                            });
                        }
                        this.panel.timeIndex = timeList.length - 1; //显示最后一条（最新一条）
                        this.panel.timeList = timeList;
                        this.render();
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {}
                }, {
                    key: 'changeViewType',
                    value: function changeViewType() {
                        this.render();
                    }
                }, {
                    key: 'changeWaveTab',
                    value: function changeWaveTab(index) {
                        this.panel.tabIndex = index;
                        this.render();
                    }
                }, {
                    key: 'getWaveDataByTime',
                    value: function getWaveDataByTime(inputTime, dataType, kksInfo) {
                        var _this2 = this;

                        if (this.datasource == undefined) return;

                        kksInfo.kksCode = this.templateChange.changeStart(kksInfo.kksCode);

                        var formData = new FormData();
                        formData.append("kksCodes", kksInfo.kksCode);
                        formData.append("waveTime", inputTime);
                        formData.append("waveType", dataType);
                        formData.append("kdmUrl", this.datasource.kdmUrl);
                        var options = {
                            method: 'POST',
                            data: formData
                        };
                        //如果连接的数据源地址为KDM Link地址
                        if (this.datasource.linkUser && this.datasource.linkPassword) {
                            options.url = this.datasource.url + '/rest/v1/data-points/wave/getWaves';
                        } else options.url = this.datasource.url + '/wave/getWaves';

                        var promise = new Promise(function (resolve, reject) {
                            _this2.datasource.getLoginStatus().then(function (data) {

                                _this2.datasource.request(options).then(function (body) {
                                    body.data.kksInfo = kksInfo;
                                    resolve(body.data);
                                }, function (error) {
                                    _this2.datasource.relogin(error, options).then(function (data) {
                                        body.data.kksInfo = kksInfo;
                                        resolve(data.body);
                                    }, function (error) {
                                        return reject(error);
                                    });
                                });
                            });
                        });
                        return promise;
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl, templateSrv) {
                        var systemColor = ["#7eb26d", "#EE0000", "#0000EE", "#EEEE00", "#8DEEEE", "#1874CD", "#00EE00", "#008B8B"];

                        function getTempData(data, index, kksName, tabIndex) {
                            var xAxis = {
                                data: data.x,
                                name: "时间",
                                axisLabel: {
                                    show: false
                                }
                            };

                            if (index == ctrl.panel.targets.length - 1) {
                                xAxis.axisLabel.show = true;

                                var formatStr = '';
                                if (tabIndex == 0) formatStr = 's';
                                if (tabIndex == 1 || tabIndex == 3) formatStr = 'X';
                                if (tabIndex == 2) formatStr = 'Hz';

                                xAxis.axisLabel.formatter = getFormatter(2, formatStr);
                            }

                            var yAxis = {
                                min: "dataMin",
                                axisLabel: {
                                    formatter: getFormatter(0, "")
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: ['#444343']
                                    }
                                }
                            };
                            var series = {
                                name: kksName,
                                type: tabIndex == 0 || tabIndex == 2 ? 'line' : 'bar',
                                data: data.y,
                                showSymbol: false, //不显示与X轴对应的坐标
                                symbol: "circle",
                                barWidth: 1,
                                barMaxWidth: 1,
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: systemColor[index]
                                    }
                                }
                            };
                            return [xAxis, yAxis, series];
                        }

                        //根据精度，单位； 返回echarts图表中的formatter对象
                        function getFormatter(num, unit) {
                            var formatter = function formatter(value, index) {
                                if (value == undefined) {
                                    return "";
                                }
                                if (value == 0 || value == parseInt(value)) {
                                    //如果数据本身就是一个正数，就不需要保留小数了
                                    return value;
                                }
                                if (unit == null) {
                                    unit = "";
                                }
                                if (num == 0) {
                                    return parseInt(value) + unit;
                                }
                                return value.toFixed(num) + unit;
                            };
                            return formatter;
                        }

                        function initGraph(xArr, yArr, sArr, kksNameArr, index, divArr) {
                            var myChart = echarts.init(divArr[index]);

                            var option = {
                                title: {
                                    text: '波形频谱',
                                    show: false
                                },
                                grid: {
                                    left: 40,
                                    top: 5,
                                    bottom: 5,
                                    right: 8
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    showDelay: 0,
                                    axisPointer: {
                                        show: true,
                                        type: 'line',
                                        lineStyle: {
                                            type: 'dashed',
                                            width: 2
                                        }
                                    },
                                    zlevel: 1
                                },
                                legend: {
                                    data: kksNameArr,
                                    right: "0px",
                                    top: "0px",
                                    z: 3,
                                    orient: "horizontal",
                                    textStyle: {
                                        color: "white" //图例字体颜色
                                    }
                                },
                                textStyle: {
                                    color: "white"
                                }
                            };
                            option.xAxis = xArr;
                            option.yAxis = yArr;
                            option.series = sArr;
                            myChart.group = "index_" + index;

                            var dataZoom = [{
                                show: false,
                                handleSize: '80%',
                                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                backgroundColor: 'transparent',
                                fillerColor: 'rgba(0,0,0,0.4)',
                                showDataShadow: false,
                                borderColor: 'transparent',
                                bottom: 30,
                                handleStyle: {
                                    color: 'rgba(255,255,255,0.7)',
                                    shadowBlur: 3,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                                    shadowOffsetX: 2,
                                    shadowOffsetY: 2
                                }
                            }];

                            //最后一个图表，展示最下测的数据筛选功能
                            if (index == divArr.length - 1) {
                                dataZoom[0].show = true;
                                option.grid.bottom = 60;
                            }
                            option.dataZoom = dataZoom;

                            myChart.setOption(option);
                            return myChart;
                        }

                        ctrl.events.on('render', function () {
                            var obj = elem.find('.data-panel');
                            obj.html("");

                            var allHeight = ctrl.height;
                            var marginTrue = false;
                            if (ctrl.panel.tabIsShow || ctrl.panel.timeIsShow) {
                                allHeight = allHeight - 40; //顶部标签页 + 时间选择
                                marginTrue = true;
                            }
                            ctrl.panel.marginTrue = marginTrue; //是否距离上边距40的像素，否则遮住了下拉框，无法选择

                            if (!ctrl.panel.showType) {
                                showSplitCharts(obj, allHeight); //分轴显示
                            } else {
                                showCoaxialCharts(obj, allHeight); //同轴显示
                            }
                        });

                        function showSplitCharts(obj, allHeight) {

                            allHeight = allHeight - 50; // 最下面的图表（数据筛选条 + 坐标）共占据50像素高度
                            var divArr = [];
                            var charts = [];
                            var targets = [];

                            if (ctrl.templateSrv.wave_kks && ctrl.templateSrv.page_name == ctrl.dashboard.meta.slug) {
                                var checkWaves = ctrl.templateSrv.wave_kks;
                                for (var i = 0; i < checkWaves.length; i++) {
                                    targets.push({
                                        target: checkWaves[i]
                                    });
                                }
                            } else {
                                targets = ctrl.panel.targets;
                            }

                            //过滤掉波形时刻为空的监测量
                            var codeTimes = [];
                            ctrl.panel.timeList.forEach(function (value, index) {

                                if (value && value != "") {

                                    codeTimes.push({
                                        time: value.time,
                                        tag: targets[index]
                                    });
                                }
                            });

                            if (codeTimes.length == 0) return;

                            var height = allHeight / codeTimes.length;
                            var promises = [];
                            for (var _i = 0; _i < codeTimes.length; _i++) {
                                var dataTime = codeTimes[_i].time;
                                if (dataTime && dataTime != "") {

                                    if (_i == codeTimes.length - 1) {
                                        height += 50; //最后一个图表的高度 = 平局高度 + 50;
                                    }
                                    var div = $("<div class='myDiv_" + _i + "' style='height:" + height + "px'></div>");
                                    divArr.push(div[0]);
                                    obj.append(div);

                                    var array = codeTimes[_i].tag.target.split("_"); //kks, name

                                    //异步请求数据返回的顺序可能不一致,所以在此处需要重新构建一个kksInfo对象
                                    var kksInfo = {
                                        kksCode: array[0],
                                        name: array[1]
                                    };
                                    var promise = ctrl.getWaveDataByTime(dataTime, ctrl.panel.tabIndex, kksInfo);
                                    promises.push(promise);
                                }
                            }

                            Promise.all(promises).then(function (data) {

                                if (!_.isArray(data)) return;

                                data.forEach(function (item, index) {

                                    if (!item) return;
                                    var kksNameArr = [];
                                    var xArr = [];
                                    var yArr = [];
                                    var sArr = [];
                                    var temp = getTempData(item, index, item.kksInfo.name, ctrl.panel.tabIndex);
                                    kksNameArr.push(item.kksInfo.name);

                                    xArr.push(temp[0]);
                                    yArr.push(temp[1]);
                                    sArr.push(temp[2]);

                                    if (ctrl.panel.tabIndex == 0 && item.y.length > 0) {
                                        //原始波形，显示键相
                                        var keyPhaseOffsetData = [];
                                        var keyPhaseOffsetIndex = item.keyPhaseOffsetIndex;
                                        for (var i = 0; i < keyPhaseOffsetIndex.length; i++) {
                                            keyPhaseOffsetData.push([keyPhaseOffsetIndex[i], item.y[keyPhaseOffsetIndex[i]]]);
                                        }
                                        var series = {
                                            name: '键相',
                                            symbol: ctrl.panel.currentSymbol,
                                            data: keyPhaseOffsetData,
                                            type: 'scatter',
                                            symbolSize: 5,
                                            itemStyle: {
                                                normal: {
                                                    color: "white"
                                                } //键相全部显示白色
                                            } };
                                        sArr.push(series);
                                        kksNameArr.push("键相");
                                    }
                                    var chart = initGraph(xArr, yArr, sArr, kksNameArr, index, divArr);
                                    charts.push(chart);
                                });
                                echarts.connect(charts);
                            }).catch(console.error);
                        }

                        function showCoaxialCharts(obj, height) {

                            var div = $("<div class='myDiv' style='height:" + height + "px'></div>");
                            obj.append(div);
                            var myChart = echarts.init(div[0]);
                            var targets = [];

                            if (ctrl.templateSrv.wave_kks && ctrl.templateSrv.page_name == ctrl.dashboard.meta.slug) {
                                var checkWaves = ctrl.templateSrv.wave_kks;
                                for (var i = 0; i < checkWaves.length; i++) {
                                    targets.push({
                                        target: checkWaves[i]
                                    });
                                }
                            } else {
                                targets = ctrl.panel.targets;
                            }

                            var kksNameArr = [];
                            var firstData;
                            var sArr = [];

                            var promises = [];
                            for (var i = 0; i < targets.length; i++) {

                                var dataTime = ctrl.panel.timeList[i].time;
                                if (dataTime && dataTime != "") {

                                    var array = targets[i].target.split("_");
                                    var kksName = array.length == 2 ? array[1] : "未定义";
                                    kksNameArr.push(kksName);

                                    var kksInfo = {
                                        kksCode: array[0],
                                        name: kksName
                                    };
                                    var promise = ctrl.getWaveDataByTime(dataTime, ctrl.panel.tabIndex, kksInfo);
                                    promises.push(promise);
                                }
                            }

                            Promise.all(promises).then(function (data) {

                                if (!_.isArray(data)) return;
                                data.forEach(function (item, index) {

                                    if (index == 0) {
                                        firstData = item;
                                    }
                                    var series = {
                                        name: item.kksInfo.name,
                                        type: ctrl.panel.tabIndex == 0 || ctrl.panel.tabIndex == 2 ? 'line' : 'bar',
                                        data: item.y,
                                        showSymbol: false, //不显示与X轴对应的坐标
                                        symbol: "circle",
                                        lineStyle: {
                                            normal: {
                                                width: 1
                                            }
                                        },
                                        barWidth: 1,
                                        barMaxWidth: 1,
                                        itemStyle: {
                                            normal: {
                                                color: systemColor[index]
                                            }
                                        }

                                    };
                                    sArr.push(series);

                                    if (ctrl.panel.tabIndex == 0 && item.y && item.y.length > 0) {

                                        //原始波形，显示键相
                                        var keyPhaseOffsetData = [];
                                        var keyPhaseOffsetIndex = item.keyPhaseOffsetIndex;
                                        for (var j = 0; j < keyPhaseOffsetIndex.length; j++) {
                                            keyPhaseOffsetData.push([keyPhaseOffsetIndex[j], item.y[keyPhaseOffsetIndex[j]]]);
                                        }

                                        var series1 = {
                                            name: '键相',
                                            symbol: ctrl.panel.currentSymbol,
                                            data: keyPhaseOffsetData,
                                            type: 'scatter',
                                            symbolSize: 5,
                                            itemStyle: {
                                                normal: {
                                                    color: "white"
                                                } //键相全部显示白色
                                            } };
                                        sArr.push(series1);
                                        kksNameArr.push("键相");
                                    }
                                });

                                var formatStr = '';
                                if (ctrl.panel.tabIndex == 0) formatStr = 's';
                                if (ctrl.panel.tabIndex == 1 || ctrl.panel.tabIndex == 3) formatStr = 'X';
                                if (ctrl.panel.tabIndex == 2) formatStr = 'Hz';

                                var eoption = {
                                    title: {
                                        text: '波形频谱',
                                        show: false
                                    },
                                    grid: {
                                        left: 40,
                                        top: 5,
                                        bottom: 60,
                                        right: 8
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        showDelay: 0,
                                        axisPointer: {
                                            show: true,
                                            type: 'line',
                                            lineStyle: {
                                                type: 'dashed',
                                                width: 2
                                            }
                                        },
                                        zlevel: 1
                                    },
                                    legend: {
                                        data: kksNameArr,
                                        right: "0px",
                                        top: "0px",
                                        z: 3,
                                        orient: "horizontal",
                                        textStyle: {
                                            color: "white" //图例字体颜色
                                        }
                                    },
                                    textStyle: {
                                        color: "white"
                                    },
                                    xAxis: {
                                        data: firstData.x,
                                        name: "时间",
                                        axisLabel: {
                                            show: true,
                                            formatter: getFormatter(2, formatStr)
                                        }
                                    },
                                    yAxis: {
                                        min: "dataMin",
                                        axisLabel: {
                                            formatter: getFormatter(0, '')
                                        },
                                        splitLine: {
                                            lineStyle: {
                                                color: ['#444343']
                                            }
                                        }
                                    },
                                    dataZoom: [{
                                        show: true,
                                        handleSize: '80%',
                                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                                        backgroundColor: 'transparent',
                                        fillerColor: 'rgba(0,0,0,0.4)',
                                        showDataShadow: false,
                                        borderColor: 'transparent',
                                        bottom: 30,
                                        handleStyle: {
                                            color: 'rgba(255,255,255,0.7)',
                                            shadowBlur: 3,
                                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                                            shadowOffsetX: 2,
                                            shadowOffsetY: 2
                                        }
                                    }],
                                    series: sArr

                                };

                                myChart.setOption(eoption);
                            }).catch(function (error) {
                                console.error(error);
                            });
                        }
                    }
                }]);

                return WaveCtrl;
            }(MetricsPanelCtrl));

            _export('WaveCtrl', WaveCtrl);

            WaveCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=wave_ctrl.js.map
