'use strict';

System.register(['app/plugins/sdk', 'lodash', 'jquery'], function (_export, _context) {
    "use strict";

    var MetricsPanelCtrl, _, $, _createClass, panelDefaults, OgeAlarmCtrl;

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

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
        }, function (_lodash) {
            _ = _lodash.default;
        }, function (_jquery) {
            $ = _jquery.default;
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
                stepLength: 32,
                speed: 1,
                delay: 1,
                alarmNum: 50,
                dcCodeRules: [],
                alarmCodeRules: "",
                colors: ["rgba(50, 172, 45, 0.97)", "rgba(237, 129, 40, 0.89)", "rgba(245, 54, 54, 0.9)"],
                colorOption: [{
                    name: '禁用',
                    value: 'Null'
                }, {
                    name: '单元格',
                    value: 'cell'
                }, {
                    name: '值',
                    value: 'value'
                }, {
                    name: '行',
                    value: 'row'
                }],
                colorMode: 'cell',
                alarmValNames: ["", "", ""],
                urls: [],
                interval: null
            };

            _export('OgeAlarmCtrl', OgeAlarmCtrl = function (_MetricsPanelCtrl) {
                _inherits(OgeAlarmCtrl, _MetricsPanelCtrl);

                function OgeAlarmCtrl($scope, $injector) {
                    _classCallCheck(this, OgeAlarmCtrl);

                    var _this = _possibleConstructorReturn(this, (OgeAlarmCtrl.__proto__ || Object.getPrototypeOf(OgeAlarmCtrl)).call(this, $scope, $injector));

                    _.defaults(_this.panel, {
                        options: {}
                    });
                    _.defaults(_this.panel.options, panelDefaults);

                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('render', _this.onRender.bind(_this));
                    return _this;
                }

                _createClass(OgeAlarmCtrl, [{
                    key: 'onInitEditMode',
                    value: function onInitEditMode() {
                        this.addEditorTab('Options', 'public/plugins/oge-alarm/editor.html', 2);
                    }
                }, {
                    key: 'onDcDelete',
                    value: function onDcDelete(index) {
                        this.panel.options.dcCodeRules.splice(index, 1);
                        this.render();
                    }
                }, {
                    key: 'onDcAdd',
                    value: function onDcAdd() {
                        this.panel.options.dcCodeRules.push({ code: "", name: "" });
                        this.render();
                    }
                }, {
                    key: 'invertColorOrder',
                    value: function invertColorOrder() {
                        this.panel.options.colors.reverse();
                        this.render();
                    }
                }, {
                    key: 'onDataReceived',
                    value: function onDataReceived(dataList) {
                        this.data = [];
                        this.panel.options.urls = [];
                        if (this.panel.datasource == "-- Mixed --") {
                            for (var i = 0; i < this.panel.targets.length; i++) {
                                this.panel.options.urls.push(this.datasourceSrv.datasources[this.panel.targets[i].datasource].url);
                            }
                        } else {
                            this.panel.options.urls.push(this.datasource.url);
                        }
                        if (this.panel.options.urls.length == 0) {
                            return;
                        }
                        var that = this;
                        //查询所有数据源下报警信息
                        this.getAlarmData(this.panel.options.urls).then(function (alarmInfors) {
                            if (alarmInfors.length == 0) {
                                console.error("no data found alarm");
                                return;
                            } else {
                                //按时间进行排序取最新的alarmNum条数
                                alarmInfors.sort(function (a, b) {
                                    return new Date(b.time).getTime() - new Date(a.time).getTime();
                                });
                                if (alarmInfors.length > that.panel.options.alarmNum) {
                                    alarmInfors.splice(that.panel.options.alarmNum);
                                }
                                //查询编码名称
                                var codeMap = new Map();
                                var urls = [];
                                var _iteratorNormalCompletion = true;
                                var _didIteratorError = false;
                                var _iteratorError = undefined;

                                try {
                                    for (var _iterator = alarmInfors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                        var alarmInfor = _step.value;

                                        urls = [];
                                        if (codeMap.has(alarmInfor.url)) {
                                            urls = codeMap.get(alarmInfor.url);
                                            urls.push(alarmInfor.code);
                                            codeMap.set(alarmInfor.url, urls);
                                        } else {
                                            codeMap.set(alarmInfor.url, [alarmInfor.code]);
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return) {
                                            _iterator.return();
                                        }
                                    } finally {
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                }

                                that.getKksCodes(codeMap).then(function (KKSInfos) {
                                    codeMap.clear();
                                    if (KKSInfos && KKSInfos.length > 0) {
                                        for (var _i = 0; _i < KKSInfos.length; _i++) {
                                            if (KKSInfos[_i].kksName && KKSInfos[_i].kksName !== '') {
                                                codeMap.set(KKSInfos[_i].kksCode, KKSInfos[_i].kksName);
                                            }
                                        }
                                        var _iteratorNormalCompletion2 = true;
                                        var _didIteratorError2 = false;
                                        var _iteratorError2 = undefined;

                                        try {
                                            for (var _iterator2 = alarmInfors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                                var alarmInfor = _step2.value;

                                                if (codeMap.has(alarmInfor.code)) {
                                                    alarmInfor.name = codeMap.get(alarmInfor.code);
                                                }
                                            }
                                        } catch (err) {
                                            _didIteratorError2 = true;
                                            _iteratorError2 = err;
                                        } finally {
                                            try {
                                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                    _iterator2.return();
                                                }
                                            } finally {
                                                if (_didIteratorError2) {
                                                    throw _iteratorError2;
                                                }
                                            }
                                        }
                                    }
                                    that.data = alarmInfors;
                                    that.render();
                                });
                            }
                        });
                    }
                }, {
                    key: 'getAlarmData',
                    value: function getAlarmData(urls) {
                        var promises = [];
                        for (var i = 0; i < urls.length; i++) {
                            var getData = {
                                method: 'getNewLimitAlarm',
                                alarmNum: this.panel.options.alarmNum,
                                alarmCodeRules: this.panel.options.alarmCodeRules
                            };
                            promises[i] = this.getAjaxPromise("GET", getData, urls[i] + "/kxmData");
                        }
                        return Promise.all(promises).then(function (results) {
                            var alarmInfos = [];
                            if (results && results.length > 0) {
                                for (var _i2 = 0; _i2 < results.length; _i2++) {
                                    if (results[_i2].Alarm.length > 0) {
                                        for (var j = 0; j < results[_i2].Alarm.length; j++) {
                                            results[_i2].Alarm[j].url = urls[_i2];
                                            alarmInfos.push(results[_i2].Alarm[j]);
                                        }
                                        // alarmInfos.push(...results[i].Alarm);
                                    }
                                }
                            }
                            return alarmInfos;
                        }).catch(function (reason) {
                            console.log(reason);
                        });
                    }
                }, {
                    key: 'getKksCodes',
                    value: function getKksCodes(codeMap) {
                        var urls = codeMap.keys();
                        var promises = [];
                        var codes;
                        var queryName = "";
                        var orderby = "[('kksCode','ASC')]";
                        var params;
                        var header = { 'Content-Type': 'application/json' };
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = urls[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var url = _step3.value;

                                codes = Array.from(new Set(codeMap.get(url)));
                                if (codes.length > 1) {
                                    queryName = "['|',('kksCode','like','%" + codes[0] + "%')";
                                    for (var i = 1; i < codes.length; i++) {
                                        if (i === codes.length - 1) {
                                            queryName += ",('kksCode','like','%" + codes[i] + "%')]";
                                        } else {
                                            queryName += ",'|',('kksCode','like','%" + codes[i] + "%')";
                                        }
                                    }
                                } else {
                                    queryName = "[('kksCode','like','%" + codes[0] + "%')]";
                                }
                                params = {
                                    limit: 1000,
                                    offset: 1,
                                    fields: 'kksCode,kksName',
                                    query: queryName,
                                    orderby: orderby
                                };
                                promises.push(this.getAjaxPromise("POST", null, url + '/kksInfo?method=searchKKSInfos&' + new URLSearchParams(params).toString(), header));
                                // promises.push(this.getAjaxPromise("POST",null,url+ '/kksInfo?method=searchKKSInfos&offset=1&limit=1000&fields=kksCode&query='+queryName+'&orderby='+orderby, header));
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }

                        return Promise.all(promises).then(function (results) {
                            var codeTargets = [];
                            if (results && results.length > 0) {
                                for (var i = 0; i < results.length; i++) {
                                    if (results[i].KKSInfos && results[i].KKSInfos.length > 0) {
                                        codeTargets.push.apply(codeTargets, _toConsumableArray(results[i].KKSInfos));
                                    }
                                }
                            }
                            return codeTargets;
                        }).catch(function (reason) {
                            console.log(reason);
                        });
                    }
                }, {
                    key: 'getAjaxPromise',
                    value: function getAjaxPromise(type, getData, requestUrl, header) {
                        return $.ajax({
                            type: type,
                            url: requestUrl,
                            data: getData,
                            header: header
                        });
                    }
                }, {
                    key: 'onRender',
                    value: function onRender() {}
                }, {
                    key: 'autoScroll',
                    value: function autoScroll(ctrl, elem) {
                        var stepLength = ctrl.panel.options.stepLength;
                        var speed = ctrl.panel.options.speed * 1000;
                        var delay = ctrl.panel.options.delay * 1000;
                        var tBodyElem = elem.children[0].children[1];
                        tBodyElem.scrollTop = 0;
                        if (ctrl.panel.options.interval != null) {
                            clearInterval(ctrl.panel.options.interval);
                            ctrl.panel.options.interval = null;
                        }
                        function start(that) {
                            if (that.panel.options.interval == null) {
                                that.panel.options.interval = setInterval(scrolling, speed);
                            }
                            tBodyElem.scrollTop += stepLength;
                        }
                        function scrolling() {
                            if (tBodyElem.scrollTop + 1 >= tBodyElem.scrollHeight - tBodyElem.offsetHeight) {
                                tBodyElem.scrollTop = 0;
                                return;
                            }
                            tBodyElem.scrollTop += stepLength;
                            if (tBodyElem.scrollTop > tBodyElem.scrollHeight - tBodyElem.offsetHeight) {
                                tBodyElem.scrollTop = tBodyElem.scrollHeight - tBodyElem.offsetHeight;
                            }
                            //if (sTop === elem.scrollTop || sTop == 0 || elem.scrollTop === (elem.scrollHeight - elem.offsetHeight)) {
                            //    stepLength *= -1; // 转换方向
                            //    clearInterval(interval);
                            //    setTimeout(start, delay);
                            //}
                        }
                        if (tBodyElem.clientHeight <= tBodyElem.scrollHeight) {
                            setTimeout(start, delay, ctrl);
                        }
                    }
                }, {
                    key: 'dcNameConvert',
                    value: function dcNameConvert() {
                        if (this.data == null || this.data.length < 1) {
                            return;
                        }
                        var map = new Map();
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = this.panel.options.dcCodeRules[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var dcCodeRule = _step4.value;

                                map.set(dcCodeRule.code, dcCodeRule.name);
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }

                        var tempCode = "";
                        var tempPQ = "";
                        var tempJz = 0;
                        var dcName;
                        for (var i = 0; i < this.data.length; i++) {
                            tempCode = this.data[i].code;
                            dcName = "";
                            if (map.has(tempCode.substring(0, 5))) {
                                dcName = map.get(tempCode.substring(0, 5));
                            }
                            tempPQ = tempCode.substring(6, 7);
                            tempJz = Number(tempCode.substring(7, 8));
                            this.data[i].content = dcName + ((tempPQ === "P" ? 0 : 9) + tempJz) + "号机组" + (this.data[i].name ? this.data[i].name : "");
                        }
                    }
                }, {
                    key: 'alermValConvert',
                    value: function alermValConvert(value) {
                        var valName = "";
                        var alarmValNames = this.panel.options.alarmValNames;
                        if (alarmValNames[value - 1] != null && alarmValNames[value - 1].length > 0) {
                            valName = alarmValNames[value - 1];
                        } else {
                            valName = value;
                        }
                        return valName;
                    }
                }, {
                    key: 'link',
                    value: function link(scope, elem, attrs, ctrl) {
                        ctrl.events.on('render', function () {
                            if (_.isEmpty(ctrl.data)) return;
                            ctrl.dcNameConvert();
                            for (var i = 0; i < ctrl.data.length; i++) {
                                if (ctrl.data[i].value == 1) {
                                    ctrl.data[i].CO = ctrl.panel.options.colors[0];
                                } else if (ctrl.data[i].value == 2) {
                                    ctrl.data[i].CO = ctrl.panel.options.colors[1];
                                } else if (ctrl.data[i].value == 3) {
                                    ctrl.data[i].CO = ctrl.panel.options.colors[2];
                                }
                                ctrl.data[i].value = ctrl.alermValConvert(ctrl.data[i].value);
                            }
                            var rootElem = elem.find('.table-panel-scroll'); //表格需要处理高度
                            ctrl.autoScroll(ctrl, rootElem[0]);
                        });
                    }
                }]);

                return OgeAlarmCtrl;
            }(MetricsPanelCtrl));

            _export('OgeAlarmCtrl', OgeAlarmCtrl);

            OgeAlarmCtrl.templateUrl = 'module.html';
        }
    };
});
//# sourceMappingURL=alarm_ctrl.js.map
