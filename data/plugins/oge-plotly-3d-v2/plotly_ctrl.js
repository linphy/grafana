'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'jquery', 'app/core/time_series', 'vendor/plotly/plotly-latest.min.js', './pageing'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, moment, _, $, TimeSeries, Plotly, pageing, _createClass, panelDefaults, PlotlyCtrl;

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
        }, function (_jquery) {
            $ = _jquery.default;
        }, function (_appCoreTime_series) {
            TimeSeries = _appCoreTime_series.default;
        }, function (_vendorPlotlyPlotlyLatestMinJs) {
            Plotly = _vendorPlotlyPlotlyLatestMinJs.default;
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

            panelDefaults = {
                showCut: "0", //是否画切面
                showscale: "0",
                isConvergence: "0"
            };

            _export('PlotlyCtrl', PlotlyCtrl = function (_MetricsPanelCtrl) {
                _inherits(PlotlyCtrl, _MetricsPanelCtrl);

                function PlotlyCtrl($scope, $injector, $rootScope) {
                    _classCallCheck(this, PlotlyCtrl);

                    var _this = _possibleConstructorReturn(this, (PlotlyCtrl.__proto__ || Object.getPrototypeOf(PlotlyCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;
                    _this.xData = [];
                    _this.yData = [];
                    _this.zData = [];
                    _this.source = []; //z轴原始数据
                    _this.modeData = {};
                    _this.dataModel = 2;
                    _this.tags = [];
                    _this.tagsValues = [];
                    _.defaults(_this.panel, panelDefaults);

                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    return _this;
                }

                //删除轨迹 index =1 代表实时轨迹 =0代表模型轨迹


                _createClass(PlotlyCtrl, [{
                    key: 'deleteTrace',
                    value: function deleteTrace(index) {
                        if (this.plotChildId != null && this.plotChildId != "undefined") {
                            console.log("plotChildId:" + this.plotChildId);
                            Plotly.deleteTraces(this.plotChildId, index);
                        }
                    }
                }, {
                    key: 'addSnapShotTrace',
                    value: function addSnapShotTrace(xyzArray) {
                        if (this.plotChildId == null || this.plotChildId == "undefined") return;
                        var data = {
                            name: '最新数据',
                            x: [xyzArray[0].toFixed(2)],
                            y: [xyzArray[1].toFixed(2)],
                            z: [xyzArray[2].toFixed(2)],
                            mode: 'markers',
                            type: 'scatter3d',
                            marker: {
                                color: 'yellow',
                                size: 3
                            }
                        };

                        Plotly.addTraces(this.plotChildId, data, 1);
                    }
                }, {
                    key: 'addModelTrace',
                    value: function addModelTrace() {
                        if (this.plotChildId == null || this.plotChildId == "undefined") return;
                        var data = {
                            name: '模型数据',
                            type: 'surface', //mesh3d、surface
                            x: this.xData,
                            y: this.yData,
                            z: this.zData, //zData 21*21, source 441
                            showscale: this.panel.showscale == 1
                        };
                        Plotly.addTraces(this.plotChildId, data, 0);
                    }
                }, {
                    key: 'getXYZSnapshotData',
                    value: function getXYZSnapshotData(xyzArr, dataList) {
                        //通过refId来确定xyz
                        for (var i = 0; i < xyzArr.length; i++) {
                            for (var j = 0; j < this.panel.targets.length; j++) {
                                var spl = this.panel.targets[j].target.split('_');
                                if (xyzArr[i] == spl[0]) {
                                    for (var z = 0; z < dataList.length; z++) {
                                        if (dataList[z].refId == this.panel.targets[j].refId) {
                                            var lastIndex = dataList[z].datapoints.length - 1;
                                            xyzArr[i] = dataList[z].datapoints[lastIndex][lastIndex];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        return xyzArr;
                    }
                }, {
                    key: 'getDataModelRname',
                    value: function getDataModelRname(dataList) {
                        var rNames = [];
                        for (var i = 1; i < dataList.length; i++) {
                            rNames.push(dataList[i].target);
                        }
                        return rNames;
                    }
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('Options', 'public/plugins/oge-plotly-3d-v2/editor.html', 2);
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        var that = this;
                        if (!dataList || dataList.length == 0 || !dataList[0] || !this.panel.targets[0] || !this.panel.targets[0].target) {
                            console.log("没数据，请检查数据源");
                            var elem3D = this.elem.find('.plotly_3D');
                            elem3D.html("");
                            this.plotChildId = null;
                            return;
                        }
                        var kksInfo = this.panel.targets[0].target.split("_")[0];
                        this.getWaveDataByTime(dataList[0], kksInfo).then(function (data) {
                            var modeData = JSON.parse(data);
                            var xyzArr = [];
                            xyzArr.push(modeData.x);
                            xyzArr.push(modeData.y);
                            xyzArr.push(modeData.z);

                            //只有当3d模型图已经存在的情况下，才会进行时间判断，模型时间与上一次时间相同，则只更新实时数据轨迹
                            if (that.plotChildId != null && that.plotChildId != "undefined") {
                                //判断模型是否与上一次相同，如果相同，则只刷新最新数据，否则重绘
                                var time = dataList[0];
                                if (that.preDate != null && that.preDate != "undefined") {
                                    if (that.preDate == time) {
                                        //删除点
                                        that.deleteTrace(1);
                                        //增加点
                                        that.addSnapShotTrace(xyzArr);
                                        return;
                                    } else {
                                        that.preDate = time;
                                    }
                                } else {
                                    that.preDate = time;
                                }
                            }

                            //x
                            modeData.x = xyzArr[0];
                            //y
                            modeData.y = xyzArr[1];
                            //z
                            modeData.z = xyzArr[2];

                            //获取别名
                            that.rName = that.getDataModelRname(dataList);

                            //处理x,y,z(x,y)轴标题
                            that.xyz = modeData.d3Sets; //x,y,z
                            var size = void 0;
                            var source = void 0;

                            // if (that.panel.xyz.length == 8) {
                            that.dataModel = 3;
                            that.tags = [modeData.d3Sets.xName, modeData.d3Sets.yName, modeData.d3Sets.zName];
                            that.tagsValues = [modeData.d3Args.xmin, modeData.d3Args.ymin, modeData.d3Args.zmin];

                            //反归一化Z轴数据
                            size = modeData.d3Args.steplength + 1;
                            source = modeData.d3modelOutput;
                            var max = modeData.d3Args.zmax;
                            var min = modeData.d3Args.zmin;
                            for (var i = 0; i < modeData.d3massOutput.length; i++) {
                                //是否显示收敛值
                                if (that.panel.isConvergence == "0") {
                                    if (modeData.d3massOutput[i] == 0) {
                                        source[i] = (max + min) / 2;
                                    } else {
                                        source[i] = max + (max - min) * (0.5 * source[i] - 0.5);
                                    }
                                } else {
                                    source[i] = max + (max - min) * (0.5 * source[i] - 0.5);
                                }
                            }
                            // } else {
                            //     this.dataModel = 2;
                            //     size = modeData.d2Args.steplength + 1;
                            //     source = modeData.d2modelOutput;
                            //     var _max = modeData.d2Args.zmax;
                            //     var _min = modeData.d2Args.zmin;
                            //     for (var _i = 0; _i < modeData.d3massOutput.length; _i++) {
                            //         if (this.panel.isConvergence == "0") {
                            //             if (modeData.d3massOutput[_i] == 0) {
                            //                 source[_i] = (_max + _min) / 2;
                            //             } else {
                            //                 source[_i] = _max + (_max - _min) * (0.5 * source[_i] - 0.5);
                            //             }
                            //         } else {
                            //             source[_i] = _max + (_max - _min) * (0.5 * source[_i] - 0.5);
                            //         }
                            //     }
                            // }

                            //处理时间
                            //this.dataTimes = this.getTimesByLongTime(data[data.length - 1]);

                            //处理成size*size数组
                            that.source = source;
                            that.zData = that.groupByData(source, size);

                            if (that.dataModel == 2) {
                                that.initXData(modeData);
                            } else {
                                that.initXYData(modeData); //处理3维数据
                            }

                            that.modeData = modeData;

                            //初始化后,避免重刷，导致图片还原
                            if (that.plotChildId != null && that.plotChildId != "undefined") {
                                that.deleteTrace(0);
                                that.addModelTrace();
                                that.deleteTrace(1);
                                that.addSnapShotTrace(xyzArr);
                                // return;//修改在专业工具中，改变点值和时间，图形数据改变，但坐标不变的问题 ---df
                            }

                            that.render();
                        }).catch(console.error);
                    }
                }, {
                    key: 'groupByData',
                    value: function groupByData(source, size) {
                        var dist = [];
                        var tempData = [];
                        for (var m = 0; m < source.length; m++) {
                            if (m != 0 && m % size == 0) {
                                dist.push(tempData);
                                tempData = [];
                            }
                            tempData.push(source[m]);
                        }
                        dist.push(tempData);
                        return dist;
                    }
                }, {
                    key: 'getTimesByLongTime',
                    value: function getTimesByLongTime(time) {
                        var myDate = new Date(time);
                        var times = this.fullTime(myDate.getFullYear());
                        times += "-" + this.fullTime(myDate.getMonth() + 1);
                        times += "-" + this.fullTime(myDate.getDate());
                        times += " " + this.fullTime(myDate.getHours());
                        times += ":" + this.fullTime(myDate.getMinutes());
                        times += ":" + this.fullTime(myDate.getSeconds());
                        return times;
                    }
                }, {
                    key: 'fullTime',
                    value: function fullTime(number) {
                        if (number < 10) {
                            return "0" + number;
                        } else {
                            return number;
                        }
                    }
                }, {
                    key: 'getTestModel',
                    value: function getTestModel() {
                        var result;
                        $.ajax({
                            type: 'GET',
                            url: this.datasource.url + '/get3DS',
                            dataType: 'json',
                            async: false,
                            success: function success(data) {
                                result = data;
                            }
                        });
                        return result;
                    }
                }, {
                    key: 'initXData',
                    value: function initXData(modeData) {
                        var xData = [];
                        var size = modeData.d2Args.xmax;
                        var length = modeData.d2modelOutput.length;
                        for (var n = 0; n < length; n++) {
                            xData.push((n + 1) / length * size);
                        }
                        this.xData = xData;
                    }
                }, {
                    key: 'initXYData',
                    value: function initXYData(modeData) {
                        var xData = [];
                        var yData = [];
                        var number = 0;
                        var size = modeData.d3Args.steplength + 1;
                        for (var n = 1; n <= size; n++) {
                            for (var m = 1; m <= size; m++) {
                                xData[number] = n;
                                yData[number] = m;
                                number++;
                            }
                        }
                        xData = this.normalization(xData, modeData.d3Args.xmax, modeData.d3Args.xmin);
                        yData = this.normalization(yData, modeData.d3Args.ymax, modeData.d3Args.ymin);

                        this.xData = this.groupByData(xData, size);
                        this.yData = this.groupByData(yData, size);
                    }
                }, {
                    key: 'normalization',
                    value: function normalization(source, max, min) {
                        //1、先对1-21数据归一化（-1~1）
                        var data_max = 0;
                        var data_min = 0;
                        for (var i = 0; i < source.length; i++) {
                            if (i == 0) {
                                data_max = source[i];
                                data_min = source[i];
                            } else {
                                if (data_max < source[i]) {
                                    data_max = source[i];
                                }
                                if (data_min > source[i]) {
                                    data_min = source[i];
                                }
                            }
                        }

                        var dist = [];
                        for (var i = 0; i < source.length; i++) {
                            dist[i] = 2 * (source[i] - data_min) / (data_max - data_min) - 1;
                        }

                        var data = [];
                        //2、对归一化数据反归一化，使用最大值，最小值
                        for (var m = 0; m < dist.length; m++) {
                            data[m] = max + (max - min) * (0.5 * dist[m] - 0.5);
                        }
                        return data;
                    }
                }, {
                    key: 'getWaveDataByTime',
                    value: function getWaveDataByTime(inputTime, kksInfo) {
                        var _this2 = this;

                        if (this.datasource == undefined) return;

                        var formData = new FormData();
                        formData.append("kksCode", kksInfo);
                        formData.append("waveTime", inputTime);

                        var options = {
                            method: 'POST',
                            data: formData,
                            url: this.datasource.url + '/wave/waveSrc'
                        };

                        var promise = new Promise(function (resolve, reject) {

                            _this2.datasource.request(options).then(function (body) {
                                resolve(body.data);
                            }, function (error) {
                                reject(error);
                            });
                        });
                        return promise;
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {}
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        pageing(scope, elem, attrs, ctrl);
                        this.ctrl = ctrl;
                        this.elem = elem;
                    }
                }]);

                return PlotlyCtrl;
            }(MetricsPanelCtrl));

            _export('PlotlyCtrl', PlotlyCtrl);

            PlotlyCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=plotly_ctrl.js.map
