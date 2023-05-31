'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', './css/space.css!', 'app/core/time_series', 'vendor/echarts/echarts.min.js', 'jquery', './space_drawer.js'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, moment, _, TimeSeries, echarts, $, SpaceDrawer, _createClass, panelDefaults, SpaceCtrl;

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
        }, function (_cssSpaceCss) {}, function (_appCoreTime_series) {
            TimeSeries = _appCoreTime_series.default;
        }, function (_vendorEchartsEchartsMinJs) {
            echarts = _vendorEchartsEchartsMinJs.default;
        }, function (_jquery) {
            $ = _jquery.default;
        }, function (_space_drawerJs) {
            SpaceDrawer = _space_drawerJs.default;
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
                    circleR: 45, //半径
                    angelIndex: -29, //旋转角度
                    dataType: 0, //0：单周轨迹，1： 双周， 2： 1倍频轨迹
                    barringType: 0 //0 不盘车 1上导盘车 2下导盘车
                }
            };

            _export('SpaceCtrl', SpaceCtrl = function (_MetricsPanelCtrl) {
                _inherits(SpaceCtrl, _MetricsPanelCtrl);

                function SpaceCtrl($scope, $injector, $rootScope, templateSrv, templateChange) {
                    _classCallCheck(this, SpaceCtrl);

                    var _this = _possibleConstructorReturn(this, (SpaceCtrl.__proto__ || Object.getPrototypeOf(SpaceCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;
                    _this.templateChange = templateChange;
                    _.defaults(_this.panel, panelDefaults);

                    //控制右边显示面板信息,用于用户选择盘车，不盘车的操作
                    _this.basicPanel = true;
                    _this.sdTitle = true;
                    _this.xdTitle = true;
                    _this.waterTitle = true;
                    _this.sdAmplitude = false;
                    _this.xdAmplitude = false;
                    _this.waterdAmplitude = false;

                    _this.amplitude = {
                        "sdmin": 0,
                        "sdmax": 0,
                        "xdmin": 0,
                        "xdmax": 0,
                        "watermin": 0,
                        "watermax": 0
                    };

                    var options = [{
                        "name": "显示",
                        value: true
                    }, {
                        "name": "隐藏",
                        value: false
                    }];
                    _this.panel.options = options;

                    var dataTypeOptions = [{
                        "name": "单周轨迹",
                        value: 0
                    }, {
                        "name": "多周轨迹",
                        value: 1
                    }, {
                        "name": "1倍频轨迹",
                        value: 2
                    }];
                    _this.panel.dataTypeOptions = dataTypeOptions;
                    _this.panel.barringTypeOptions = ["不盘车", "上导盘", "下导盘"];

                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));

                    _this.panel.useCacheData = true;
                    return _this;
                }

                _createClass(SpaceCtrl, [{
                    key: 'pancheTypeChange',
                    value: function pancheTypeChange(barringType) {
                        if (this.panel.style.barringType == 0) //不盘车
                            {
                                this.basicPanel = true;
                                this.sdTitle = true;
                                this.xdTitle = true;
                                this.waterTitle = true;
                                this.sdAmplitude = false;
                                this.xdAmplitude = false;
                                this.wahterAmplitude = false;
                            } else if (this.panel.style.barringType == 1) {
                            this.amplitude.xdmin = this.spaceCacheData.amplitude[0];
                            this.amplitude.xdmax = this.spaceCacheData.amplitude[1];
                            this.amplitude.watermin = this.spaceCacheData.amplitude[2];
                            this.amplitude.watermax = this.spaceCacheData.amplitude[3];
                            this.basicPanel = false;
                            this.sdTitle = false;
                            this.sdAmplitude = false;

                            this.xdTitle = true;
                            this.xdAmplitude = true;
                            this.waterTitle = true;
                            this.wahterAmplitude = true;
                        } else {
                            this.amplitude.sdmin = this.spaceCacheData.amplitude[4];
                            this.amplitude.sdmax = this.spaceCacheData.amplitude[5];
                            this.amplitude.watermin = this.spaceCacheData.amplitude[6];
                            this.amplitude.watermax = this.spaceCacheData.amplitude[7];
                            this.basicPanel = false;

                            this.sdTitle = true;
                            this.sdAmplitude = true;
                            this.xdTitle = false;
                            this.xdAmplitude = false;
                            this.waterTitle = true;
                            this.wahterAmplitude = true;
                        }
                        this.render();
                    }
                }, {
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('Options', 'public/plugins/oge-kdm-space/editor.html', 2);
                    }
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
                        this.spaceCacheData = dataList;
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
                            var textDiv = elem.find('.text-panel');
                            textDiv.html("");

                            if (!ctrl.panel.useCacheData || !ctrl.spaceCacheData) {
                                var promise = ctrl.getWaveData(ctrl.panel.style.weekIndex);
                                promise.then(function (data) {
                                    ctrl.spaceCacheData = data;
                                    if (data) _this2.doDraw(ctrl, obj);
                                });
                            } else if (ctrl.spaceCacheData) _this2.doDraw(ctrl, obj);
                        });
                    }
                }, {
                    key: 'getWaveData',
                    value: function getWaveData(dataType) {
                        var _this3 = this;

                        var time;
                        if (this.spaceCacheData && this.spaceCacheData.waveTime) {
                            time = this.spaceCacheData.waveTime;
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
                    key: 'getTimesByLongTime',
                    value: function getTimesByLongTime(myDate) {
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
                    key: 'changeStyle',
                    value: function changeStyle(index) {
                        if (index == 0) {
                            this.panel.style.pointIndex++; //上一点
                        } else if (index == 1) {
                            this.panel.style.pointIndex--; //下一点
                        } else if (index == 2) {
                            this.panel.style.weekIndex++; //上一周
                        } else if (index == 3) {
                            this.panel.style.weekIndex--; //下一周
                        } else if (index == 4) {
                            this.panel.style.circleR = this.panel.style.circleR + 5; //
                        } else if (index == 5) {
                            this.panel.style.circleR = this.panel.style.circleR - 5; //缩小
                            if (this.panel.style.circleR <= 5) {
                                this.panel.style.circleR = 5; //最小
                            }
                        } else if (index == 6) {
                            this.panel.style.angelIndex++; //左旋转
                        } else if (index == 7) {
                            this.panel.style.angelIndex--; //右旋转
                        }

                        if (index == 2 || index == 3) {
                            this.panel.useCacheData = false;
                        } else {
                            this.panel.useCacheData = true;
                        }
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
                        var cirlNumber = ctrl.spaceCacheData.length;
                        if (ctrl.panel.style.weekIndex == -1) {
                            ctrl.panel.style.weekIndex = cirlNumber - 1;
                        }
                        if (ctrl.panel.style.weekIndex == cirlNumber) {
                            ctrl.panel.style.weekIndex = 0;
                        }

                        //3、绘图
                        ctrl.spaceCacheData.drawStyle = ctrl.panel.style;

                        var space = new SpaceDrawer();
                        space.init(obj[0], ctrl.height);

                        if (ctrl.panel.style.barringType == 0) //不盘车
                            {
                                space.draw(ctrl.spaceCacheData, ctrl.spaceCacheData.drawStyle, -1, 1, 2);
                            } else if (ctrl.panel.style.barringType == 1) //上导
                            {
                                space.draw(ctrl.spaceCacheData, ctrl.spaceCacheData.drawStyle, 0, 1, 2);
                            } else if (ctrl.panel.style.barringType == 2) //下导
                            {
                                space.draw(ctrl.spaceCacheData, ctrl.spaceCacheData.drawStyle, 1, 0, 2);
                            }
                        ctrl.panel.useCacheData = false;
                    }
                }]);

                return SpaceCtrl;
            }(MetricsPanelCtrl));

            _export('SpaceCtrl', SpaceCtrl);

            SpaceCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=space_ctrl.js.map
