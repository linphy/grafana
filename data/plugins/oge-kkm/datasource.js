///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash'], function(exports_1) {
    var lodash_1;
    var RESTDatasource;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            RESTDatasource = (function () {
                /** @ngInject */
                function RESTDatasource(instanceSettings, $q, backendSrv, templateSrv) {
                    this.$q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.type = instanceSettings.type;
                    this.url = instanceSettings.url;
                    this.name = instanceSettings.name;
                }
                RESTDatasource.prototype.query = function (options) {
                    var _this = this;
                    var query = this.buildQueryParameters(options);
                    if (!query || !lodash_1.default.isArray(query.targets)) {
                        return this.$q.when([]);
                    }
                    var items = lodash_1.default.filter(query.targets, function (item) {
                        return item.tagName !== undefined && item.tagName !== '';
                    });
                    if (items.length <= 0) {
                        return this.$q.when([]);
                    }
                    if (this.templateSrv.wave_kks && this.templateSrv.wave_time) {
                        var existTar = query.targets[0];
                        //只有在特定的页面才生效
                        if (existTar.tagName === this.templateSrv.page_name) {
                            //修改时间
                            var time = this.templateSrv.wave_time.replace(/-/g, '/');
                            query.range.to._d = new Date(time);
                            query.range.from._d = new Date(time);
                            //编码添加[]
                            existTar.tagName = this.templateSrv.wave_kks[0];
                        }
                    }
                    var startTime = query.range.from.valueOf();
                    var endTime = query.range.to.valueOf();
                    var promises = lodash_1.default.map(query.targets, function (target) {
                        if (target.messureType === 'kpi_data') {
                            //获取KPI数据
                            //如果是获取KPI数据
                            var request_kpiData = _this.requestKPIData(target, startTime, endTime, options);
                            var request_alert = _this.requestKPIAlert(target, startTime, endTime, options);
                            return _this.$q.all([request_kpiData, request_alert]).then(function (data) {
                                var result = { data: [] };
                                var dataItem = {
                                    target: _this.getTagName(target.tagName),
                                    refId: target.refId,
                                    datapoints: [],
                                };
                                result.data.push(dataItem);
                                var kpi_data = data[0];
                                if (kpi_data && kpi_data.data) {
                                    kpi_data = kpi_data.data;
                                }
                                if (kpi_data) {
                                    _this.getKpiDataValue(kpi_data, target, options, dataItem);
                                }
                                var kpi_alert = data[1];
                                if (kpi_alert && kpi_alert.data) {
                                    kpi_alert = kpi_alert.data;
                                }
                                if (kpi_alert) {
                                    _this.getKpiDataAlert(kpi_alert, target, options, dataItem);
                                }
                                return result;
                            });
                        }
                        else if (target.messureType === 'd3_model_timeList') {
                            //3D模型时间列表
                            var urlPath = _this.buildTagCode(target.tagName) + '/' + startTime + '/' + endTime;
                            return _this.backendSrv
                                .datasourceRequest({
                                url: _this.url + '/services/kpi_datas/d3model/times/' + urlPath,
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then(function (results) {
                                var kpi_datas = results.data.d3_model_times.time;
                                var datapoints = [], data = [];
                                if (!kpi_datas || kpi_datas.length === 0) {
                                    return { data: data };
                                }
                                for (var j = 0; j < kpi_datas.length; j++) {
                                    var temp = kpi_datas[j];
                                    var point = [];
                                    point.push(temp.datetime);
                                    datapoints.push(point);
                                }
                                data.push({
                                    target: target.tagName,
                                    datapoints: datapoints,
                                });
                                return { data: data };
                            });
                        }
                        else if (target.messureType === 'd3model_models') {
                            //最新一条3D模型数据
                            return _this.requestD3Data(target, startTime, endTime, options);
                        }
                    });
                    return this.$q.all(promises).then(function (res) {
                        return { data: lodash_1.default.flatten(lodash_1.default.map(res, 'data')) };
                    });
                };
                RESTDatasource.prototype.requestD3Data = function (target, startTime, endTime, options) {
                    var _this = this;
                    //如果是获取实时数据,则不带开始和结束时间
                    var data;
                    var url;
                    if (options.kdm && options.kdm.dataType === 1) {
                        data = {
                            _postd3model_models_last: {
                                kpi_ids: [this.buildTagCode(target.tagName)],
                            },
                        };
                        url = '/services/kpi_datas/d3model/models/last';
                    }
                    else if (options.kdm && options.kdm.dataType === 2) {
                        data = {
                            _postd3model_models_times_last: {
                                kpi_ids: [this.buildTagCode(target.tagName)],
                                start_time: startTime,
                                end_time: endTime,
                            },
                        };
                        url = '/services/kpi_datas/d3model/models/times/last';
                    }
                    return this.postRequest(url, data).then(function (results) {
                        return _this.getD3modelData(results.data.d3model_models.model, target.tagName, target.refId);
                    });
                };
                RESTDatasource.prototype.requestKPIData = function (target, startTime, endTime, options) {
                    //如果是获取实时数据,则不带开始和结束时间
                    var data;
                    var url;
                    if (options.kdm && options.kdm.dataType === 1) {
                        data = {
                            _postkpis_last: {
                                kpi_ids: [this.buildTagCode(target.tagName)],
                            },
                        };
                        url = '/services/kpi_datas/kpis/last';
                    }
                    else if (options.kdm && options.kdm.dataType === 2) {
                        data = {
                            _postkpis: {
                                kpi_ids: [this.buildTagCode(target.tagName)],
                                start_time: startTime,
                                end_time: endTime,
                            },
                        };
                        url = '/services/kpi_datas/kpis';
                    }
                    return this.postRequest(url, data);
                };
                /**
                 * 获取KPI报警数据
                 */
                RESTDatasource.prototype.requestKPIAlert = function (target, startTime, endTime, options) {
                    if (options.kdm.isAlert) {
                        //如果是获取实时数据,则不带开始和结束时间
                        var data;
                        var url;
                        if (options.kdm && options.kdm.dataType === 1) {
                            data = {
                                _postalerts_last: {
                                    kpi_ids: [this.buildTagCode(target.tagName)],
                                },
                            };
                            url = '/services/kpi_datas/alerts/last';
                        }
                        else if (options.kdm && options.kdm.dataType === 2) {
                            data = {
                                _postalerts: {
                                    kpi_ids: [this.buildTagCode(target.tagName)],
                                    start_time: startTime,
                                    end_time: endTime,
                                },
                            };
                            url = '/services/kpi_datas/alerts';
                        }
                        return this.postRequest(url, data);
                    }
                    else {
                        return Promise.resolve();
                    }
                };
                /**
                 * 测试数据源是否能够正常连接
                 */
                RESTDatasource.prototype.testDatasource = function () {
                    var data = {
                        _postkpis_info: {
                            keyword: '%%',
                        },
                    };
                    return this.postRequest('/services/kpi_datas/kpis/info', data)
                        .then(function (result) {
                        if (result.data) {
                            return { status: 'success', message: 'server connect succeed', title: '连接成功' };
                        }
                        else {
                            return { status: 'faild', message: 'server connect error，please check network', title: '连接失败' };
                        }
                    })
                        .catch(function (err) {
                        return { status: 'faild', message: 'server plugin connect error，please check network', title: '连接失败' };
                    });
                };
                RESTDatasource.prototype.metricFindQuery = function (target) {
                    var data = {
                        _postkpis_info: {
                            keyword: '%' + target.tagName + '%',
                        },
                    };
                    return this.postRequest('/services/kpi_datas/kpis/info', data).then(this.mapToTextValue);
                };
                RESTDatasource.prototype.mapToTextValue = function (result) {
                    return lodash_1.default.map(result.data.kpi_infos.info, function (d, i) {
                        return { text: d.kpi_id + '_' + d.kpi_name, value: i };
                    });
                };
                /**
                 * 执行Post请求
                 */
                RESTDatasource.prototype.postRequest = function (urlPath, data) {
                    var headers = {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    };
                    return this.backendSrv.datasourceRequest({
                        url: this.url + urlPath,
                        method: 'POST',
                        headers: headers,
                        data: data,
                    });
                };
                /**
                 * 获取KPI报警数据
                 */
                RESTDatasource.prototype.getKpiDataValue = function (rawData, target, options, dataItem) {
                    var kpi_datas = rawData.kpi_datas.kpi;
                    //如果没有获取到数据则返回空数据集
                    if (!kpi_datas || kpi_datas.length === 0) {
                        return;
                    }
                    for (var j = 0; j < kpi_datas.length; j++) {
                        var temp = kpi_datas[j];
                        var point = [];
                        point.push(temp.value);
                        point.push(temp.datetime);
                        dataItem.datapoints.push(point);
                    }
                };
                /**
                 * 获取KPI指标报警数据
                 */
                RESTDatasource.prototype.getKpiDataAlert = function (rawData, target, options, dataItem) {
                    var kpi_alerts = rawData.kpi_alerts.alert;
                    //如果没有获取到数据则返回空数据集
                    if (!kpi_alerts || kpi_alerts.length === 0) {
                        return;
                    }
                    var alarm = { level: undefined, time: undefined, value: undefined };
                    for (var j = 0; j < kpi_alerts.length; j++) {
                        var alert = kpi_alerts[j];
                        //取最后一条记录作为报警值(只有当启用了获取报警值的时候才执行获取报警的操作)
                        alarm.level = alert.alert_level;
                        alarm.time = this.formatDate(new Date(alert.datetime), 'yyyy-MM-dd hh:mm:ss');
                        alarm.value = alert.value;
                    }
                    dataItem.alarm = alarm;
                };
                /**
                 * 将Date对象转换成指定格式的字符串
                 */
                RESTDatasource.prototype.formatDate = function (date, format) {
                    var o = {
                        'M+': date.getMonth() + 1,
                        'd+': date.getDate(),
                        'h+': date.getHours(),
                        'm+': date.getMinutes(),
                        's+': date.getSeconds(),
                        'q+': Math.floor((date.getMonth() + 3) / 3),
                        S: date.getMilliseconds(),
                    };
                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
                    }
                    for (var k in o) {
                        if (new RegExp('(' + k + ')').test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                        }
                    }
                    return format;
                };
                RESTDatasource.prototype.getD3modelData = function (kpi_datas, tagName, refId) {
                    var datapoints = [], data = [];
                    tagName = this.getTagName(tagName);
                    if (!kpi_datas || kpi_datas.length === 0) {
                        data.push({
                            target: tagName,
                            refId: refId,
                            datapoints: datapoints,
                        });
                        return { data: data };
                    }
                    for (var j = 0; j < kpi_datas.length; j++) {
                        var temp = kpi_datas[j];
                        var point = [];
                        point.push(temp.x_tag);
                        point.push(temp.x_tag_name);
                        if (temp.y_tag.toString() !== '-') {
                            point.push(temp.y_tag);
                            point.push(temp.y_tag_name);
                        }
                        point.push(temp.z_tag);
                        point.push(temp.z_tag_name);
                        point.push(temp.model);
                        point.push(temp.datetime);
                        datapoints.push(point);
                    }
                    data.push({
                        target: tagName,
                        refId: refId,
                        datapoints: datapoints,
                    });
                    return { data: data };
                };
                RESTDatasource.prototype.getTagName = function (tagName) {
                    if (!tagName) {
                        return tagName;
                    }
                    var idx = tagName.lastIndexOf('_');
                    return lodash_1.default.trim(idx === -1 ? tagName : tagName.substring(idx + 1));
                };
                RESTDatasource.prototype.buildQueryParameters = function (options) {
                    var _this = this;
                    options.targets = lodash_1.default.filter(options.targets, function (target) {
                        return target.tagName !== '输入查询条件';
                    });
                    var targets = lodash_1.default.map(options.targets, function (target) {
                        return {
                            tagName: _this.templateSrv.replace(target.tagName),
                            messureType: target.messureType,
                            refId: target.refId,
                        };
                    });
                    options.targets = targets;
                    options = this.buildSourceParam(options);
                    return options;
                };
                RESTDatasource.prototype.buildSourceParam = function (options) {
                    options.url = this.url;
                    return options;
                };
                RESTDatasource.prototype.buildTimeToLong = function (time) {
                    return parseFloat(time.replace(/,/g, ''));
                };
                /**
                 * 根据配置的电厂和机组以及模板KKS替换成实际的监测量
                 */
                RESTDatasource.prototype.buildTagCode = function (tagName) {
                    var idx = tagName.indexOf('_');
                    var tag = lodash_1.default.trim(idx === -1 ? tagName : tagName.substring(0, idx));
                    var jz = this.templateSrv.replace('$jz');
                    if (jz === '$jz') {
                        return tag;
                    }
                    var dc = this.templateSrv.replace('$dc');
                    if (dc !== '$dc') {
                        tag = dc + tag.substring(5, 6) + jz + tag.substring(8);
                    }
                    return tag.toString();
                };
                return RESTDatasource;
            })();
            exports_1("RESTDatasource", RESTDatasource);
        }
    }
});
//# sourceMappingURL=datasource.js.map