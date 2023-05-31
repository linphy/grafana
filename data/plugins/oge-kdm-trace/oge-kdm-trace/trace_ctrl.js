'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', './css/trace.css!', 'app/core/time_series', 'vendor/echarts/echarts.min.js', 'jquery', './trace_drawer.js'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, moment, _, TimeSeries, echarts, $, TraceDrawer, _createClass, panelDefaults, TraceCtrl;

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
        }, function (_cssTraceCss) {}, function (_appCoreTime_series) {
            TimeSeries = _appCoreTime_series.default;
        }, function (_vendorEchartsEchartsMinJs) {
            echarts = _vendorEchartsEchartsMinJs.default;
        }, function (_jquery) {
            $ = _jquery.default;
        }, function (_trace_drawerJs) {
            TraceDrawer = _trace_drawerJs.default;
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
                kksStart: "EB001HP1", //KKS索引（枕头坝）
                useCacheData: true, //默认使用缓存，使用数据插件返回的数据
                style: {
                    pointIndex: 0, //每周点索引
                    weekIndex: 0, //第几周数据索引
                    circleR: 45 //半径
                }
            };

            _export('TraceCtrl', TraceCtrl = function (_MetricsPanelCtrl) {
                _inherits(TraceCtrl, _MetricsPanelCtrl);

                function TraceCtrl($scope, $injector, $rootScope, templateSrv, templateChange) {
                    _classCallCheck(this, TraceCtrl);

                    var _this = _possibleConstructorReturn(this, (TraceCtrl.__proto__ || Object.getPrototypeOf(TraceCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;
                    _this.templateChange = templateChange;
                    _.defaults(_this.panel, panelDefaults);

                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));

                    _this.panel.useCacheData = true;
                    return _this;
                }

                _createClass(TraceCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {}
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        this.panel.kksStart = this.panel.targets[0].target;

                        //1、模板替换
                        this.panel.kksStart = this.templateChange.changeStart(this.panel.kksStart);

                        //2、根据kks规则，改变kksStart，主要是再次请求
                        if (this.templateSrv.wave_kks && this.templateSrv.page_name == this.dashboard.meta.slug) {
                            this.panel.kksStart = this.templateSrv.wave_kks[0].substring(0, 8);
                        }

                        if (dataList == null || dataList.data == "error" || dataList.length == 0) {
                            console.info("没有查询到有效数据");
                            return;
                        }
                        this.traceCacheData = dataList;
                        this.panel.useCacheData = true;
                        this.render();
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {}
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        var _this2 = this;

                        ctrl.events.on('render', function () {
                            var obj = elem.find('.data-panel');
                            obj.html("");
                            if (ctrl.traceCacheData) {
                                _this2.doDraw(ctrl, obj);
                            }
                        });
                    }
                }, {
                    key: 'getWaveData',
                    value: function getWaveData(dataType) {
                        var _this3 = this;

                        var time;
                        if (this.traceCacheData && this.traceCacheData.waveTime) {
                            time = this.traceCacheData.waveTime;
                        }
                        if (!this.datasource && !time) return undefined;

                        var formData = new FormData();
                        var targets = [];
                        if (this.panel.targets && this.panel.targets.length > 1) {
                            for (var i = 0; i < this.panel.targets.length; i++) {
                                var item = this.panel.targets[i];
                                targets.push(item.target);
                            }
                        }
                        formData.append("kksStart", targets.length == 0 ? this.panel.kksStart : targets.join(","));
                        formData.append("waveTime", time);
                        formData.append("cycleType", dataType);
                        formData.append("kdmUrl", this.datasource.kdmUrl);
                        var options = {
                            method: 'POST',
                            data: formData
                        };

                        //如果连接的数据源地址为KDM Link地址
                        if (this.datasource.linkUser && this.datasource.linkPassword) {
                            options.url = this.datasource.url + '/rest/v1/data-points/wave/getSpace';
                            options.headers = {
                                'Content-Type': undefined
                            };
                        } else options.url = this.datasource.url + '/wave/getSpace';

                        var promise = new Promise(function (resolve, reject) {

                            _this3.datasource.getLoginStatus().then(function (data) {

                                _this3.datasource.request(options).then(function (body) {
                                    resolve(body.data);
                                }, function (error) {
                                    _this3.datasource.relogin(error, options).then(function (data) {
                                        return resolve(data.body);
                                    }, function (error) {
                                        return reject(error);
                                    });
                                });
                            });
                        });
                        return promise;
                    }
                }, {
                    key: 'changeStyle',
                    value: function changeStyle(index) {
                        if (index == 4) {
                            this.panel.style.circleR = this.panel.style.circleR + 5; //
                        } else if (index == 5) {
                            this.panel.style.circleR = this.panel.style.circleR - 5; //缩小
                            if (this.panel.style.circleR <= 5) {
                                this.panel.style.circleR = 5; //最小
                            }
                        }
                        this.panel.useCacheData = true;
                        this.render();
                    }
                }, {
                    key: 'doDraw',
                    value: function doDraw(ctrl, obj) {
                        //1、处理边缘样式 ： 每周点索引
                        if (ctrl.panel.style.pointIndex == -1) {
                            ctrl.panel.style.pointIndex = 255; //数据长度固定256
                        }
                        if (ctrl.panel.style.pointIndex == 256) {
                            ctrl.panel.style.pointIndex = 0; //数据长度固定256
                        }

                        //2、处理边缘样式 ： 周索引
                        var cirlNumber = ctrl.traceCacheData.length;
                        if (ctrl.panel.style.weekIndex == -1) {
                            ctrl.panel.style.weekIndex = cirlNumber - 1;
                        }
                        if (ctrl.panel.style.weekIndex == cirlNumber) {
                            ctrl.panel.style.weekIndex = 0;
                        }

                        //3、绘图
                        ctrl.traceCacheData.drawStyle = ctrl.panel.style;

                        var trace = new TraceDrawer();
                        trace.init(obj[0], ctrl.height);

                        trace.draw(ctrl.traceCacheData, ctrl.traceCacheData.drawStyle, obj[0]);
                        // ctrl.panel.useCacheData = false;
                    }
                }]);

                return TraceCtrl;
            }(MetricsPanelCtrl));

            _export('TraceCtrl', TraceCtrl);

            TraceCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=trace_ctrl.js.map
