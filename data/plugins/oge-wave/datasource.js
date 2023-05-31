System.register(['lodash'], function(exports_1) {
    var lodash_1;
    var KDMWaveDatasource;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            KDMWaveDatasource = (function () {
                function KDMWaveDatasource(instanceSettings, $q, backendSrv, templateSrv, templateChange) {
                    this.$q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.templateChange = templateChange;
                    this.tokenName = 'XSRF-TOKEN';
                    this.type = instanceSettings.type;
                    this.url = instanceSettings.url;
                    this.name = instanceSettings.name;
                    this.kdmUrl = instanceSettings.jsonData.kdmUrl;
                    this.linkUser = instanceSettings.jsonData.linkUser;
                    this.linkPassword = instanceSettings.jsonData.linkPassword;
                }
                // Called once per panel (graph)
                KDMWaveDatasource.prototype.query = function (options) {
                    var _this = this;
                    var query = this.buildQueryParameters(options);
                    if (query.targets.length <= 0) {
                        return this.$q.when([]);
                    }
                    //波形数据源: kks选择替换
                    if (this.templateSrv.wave_kks && this.templateSrv.wave_kks.length > 0 && this.templateSrv.wave_time) {
                        var existTar = query.targets[0];
                        //只有在特定的页面才生效
                        if (existTar.target == this.templateSrv.page_name) {
                            //修改时间
                            var time = this.templateSrv.wave_time.replace(/-/g, "/");
                            query.range.to._d = new Date(time);
                            query.range.from._d = new Date(time);
                            query.targets = [];
                            var selectTargets = this.templateSrv.wave_kks;
                            for (var j = 0; j < selectTargets.length; j++) {
                                var targetObj = {
                                    dataSource: existTar.dataSource,
                                    target: selectTargets[j]
                                };
                                query.targets.push(targetObj); //每次query.targets都是空的，不需要考虑是否重复
                            }
                        }
                        else {
                            return this.$q.when([]);
                        }
                    }
                    else if (query.targets[0].target === 'custom') {
                        return this.$q.when([]);
                    }
                    else if (query.targets[0].target === '__zhou-xian-fen-xi' || query.targets[0].target === '__pin-pu-fen-xi' || query.targets[0].target === '__qi-xi-fen-xi') {
                        return this.$q.when([]);
                    }
                    //更换机组号
                    this.templateChange.changeTargets(query.targets);
                    options = {
                        url: this.buildRequestUrl('/query'),
                        data: query,
                        method: 'POST',
                        headers: {}
                    };
                    options.headers['Content-Type'] = 'application/json;charset=UTF-8';
                    return this.getLoginStatus().then(function (data) {
                        return _this.request(options);
                    }).catch(function (error) {
                        return _this.relogin(error, options);
                    });
                };
                // Required
                // Used for testing datasource in datasource configuration pange
                KDMWaveDatasource.prototype.testDatasource = function () {
                    var _this = this;
                    //验证kdm插件、kdm server是否连接成功
                    var postData = new Object();
                    postData = this.buildSourceParam(postData);
                    var deferred = this.$q.defer();
                    this.getLoginStatus().then(function (data) {
                        var options = {
                            url: _this.buildRequestUrl('/checkServer'),
                            method: 'POST',
                            data: postData,
                            headers: {}
                        };
                        options.headers['Content-Type'] = 'application/json;charset=UTF-8';
                        _this.request(options).then(function (result) {
                            if (result.data.toString() === 'true') {
                                deferred.resolve({
                                    status: "success",
                                    message: "web plugin and kdm server connect succeed",
                                    title: "连接成功"
                                });
                            }
                            else if (result.data.toString() === 'false') {
                                deferred.resolve({
                                    status: "faild",
                                    message: "kdm server connect error，please check network",
                                    title: "连接失败"
                                });
                            }
                        }).catch(function (error) {
                            _this.relogin(error, options).then(function (data) {
                                deferred.resolve({
                                    status: "success",
                                    message: "web plugin and kdm server connect succeed",
                                    title: "连接成功"
                                });
                            }, function (error) {
                                deferred.resolve({
                                    status: "faild",
                                    message: "kdm plugin connect error，please check network",
                                    title: "连接失败"
                                });
                            });
                        });
                    }, function (error) {
                        deferred.resolve({
                            status: "faild",
                            message: "kdm plugin connect error，please check network",
                            title: "登录失败"
                        });
                    });
                    return deferred.promise;
                };
                KDMWaveDatasource.prototype.annotationQuery = function (options) {
                    var _this = this;
                    console.log("自定义数据源annotationQuery");
                    console.log(options);
                    var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
                    var annotationQuery = {
                        range: options.range,
                        annotation: {
                            name: options.annotation.name,
                            datasource: options.annotation.datasource,
                            enable: options.annotation.enable,
                            iconColor: options.annotation.iconColor,
                            query: query
                        },
                        rangeRaw: options.rangeRaw
                    };
                    options = {
                        url: this.buildRequestUrl('/annotations'),
                        method: 'POST',
                        data: annotationQuery,
                        headers: {}
                    };
                    options.headers['Content-Type'] = 'application/json;charset=UTF-8';
                    return this.request(options).then(function (result) {
                        return result.data;
                    }).catch(function (error) {
                        return _this.relogin(error, options);
                    });
                };
                // Optional
                // Required for templating
                KDMWaveDatasource.prototype.metricFindQuery = function (options) {
                    var _this = this;
                    if (options === "jz") {
                        var dc = this.templateSrv.replace("$dc");
                        if (dc === "$dc") {
                            dc = "";
                        }
                        options = {
                            target: dc,
                            dataType: -2,
                            kdmUrl: this.kdmUrl
                        };
                    }
                    else if (options === "dc") {
                        options = {
                            target: "",
                            dataType: -1,
                            kdmUrl: this.kdmUrl
                        };
                    }
                    else {
                        options = this.buildSourceParam(options);
                    }
                    return this.getLoginStatus().then(function (data) {
                        var options1 = {
                            url: _this.buildRequestUrl('/search'),
                            data: options,
                            method: 'POST',
                            headers: {}
                        };
                        options1.headers['Content-Type'] = 'application/json;charset=UTF-8';
                        return _this.request(options1).then(_this.mapToTextValue, function (error) {
                            return _this.relogin(error, options1).then(_this.mapToTextValue);
                        });
                    });
                };
                KDMWaveDatasource.prototype.mapToTextValue = function (result) {
                    if (result.data && result.data.length > 0 && typeof (result.data[0]) === "object") {
                        return result.data;
                    }
                    else
                        return lodash_1.default.map(result.data, function (d, i) {
                            return {
                                text: d,
                                value: i
                            };
                        });
                };
                KDMWaveDatasource.prototype.buildQueryParameters = function (options) {
                    var _this = this;
                    //remove placeholder targets
                    options.targets = lodash_1.default.filter(options.targets, function (target) {
                        return target.target !== '输入查询条件';
                    });
                    var targets = lodash_1.default.map(options.targets, function (target) {
                        return {
                            target: _this.templateSrv.replace(target.target),
                            refId: target.refId,
                            dataSource: target.dataSource,
                            jsonType: target.jsonType,
                            dataType: target.dataType,
                        };
                    });
                    options.targets = targets;
                    options = this.buildSourceParam(options);
                    return options;
                };
                /**
                 *
                 */
                KDMWaveDatasource.prototype.getLoginStatus = function () {
                    var _this = this;
                    var deferred = this.$q.defer();
                    //如果输入了link的帐号和密码表示请求的是link地址
                    if (this.linkUser && this.linkPassword && !this.getCookie(this.tokenName)) {
                        this.getKDMLinkDefaultToken().then(function (data) {
                            deferred.resolve(data);
                        }).catch(function (error) {
                            _this.loginRequest().then(function (data) {
                                deferred.resolve(true);
                            }, function (error) {
                                deferred.reject(false);
                            });
                        });
                    }
                    else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                };
                /**
                 *
                 *经测试在link退出登录后,Cookie不会被删除,还是能够正确的获取到,所以当在请求后,如果返回的是401错误,需要再次执行登录以及发送相应的请求
                 */
                KDMWaveDatasource.prototype.relogin = function (error, re) {
                    var _this = this;
                    var deferred = this.$q.defer();
                    if (error.status === 401) {
                        this.loginRequest().then(function (data) {
                            _this.request(re).then(function (data) {
                                deferred.resolve(true);
                            }, function (error) {
                                deferred.reject(false);
                            });
                        });
                    }
                    else
                        deferred.reject(false);
                    return deferred.promise;
                };
                /**
                 *
                 */
                KDMWaveDatasource.prototype.loginRequest = function () {
                    var _this = this;
                    var deferred = this.$q.defer();
                    this.getKDMLinkDefaultToken().then(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        console.info("没有获取到Link登录的信息,重新执行登录验证");
                        var options = {
                            url: _this.url + '/rest/v2/login',
                            method: 'POST',
                            data: {
                                username: _this.linkUser,
                                password: _this.linkPassword
                            },
                            headers: {}
                        };
                        _this.request(options).then(function (data) {
                            deferred.resolve(data);
                        }, function (error) {
                            deferred.reject(error);
                        });
                    });
                    return deferred.promise;
                };
                KDMWaveDatasource.prototype.request = function (rawOptions) {
                    if (!rawOptions.headers) {
                        rawOptions.headers = {};
                        rawOptions.headers['Accept'] = 'application/json;charset=UTF-8';
                        rawOptions.headers['Content-Type'] = undefined;
                    }
                    if (this.linkUser && this.linkPassword) {
                        rawOptions.withCredentials = true;
                        rawOptions.headers['X-XSRF-TOKEN'] = this.getCookie(this.tokenName);
                    }
                    return this.backendSrv.datasourceRequest(rawOptions);
                };
                KDMWaveDatasource.prototype.buildRequestUrl = function (relativePath) {
                    if (this.linkUser && this.linkPassword) {
                        return this.url + '/rest/v1/data-points/wave' + relativePath;
                    }
                    else
                        return this.url + "/wave" + relativePath;
                };
                //如果是link请求需要将url设置成link要求的格式
                //需要判断是否存在登录后的cookie,如果存在则不执行登录,
                //如果存在cookie但是请求仍然失败,则需要自动执行登录操作,然后再执行请求操作
                KDMWaveDatasource.prototype.getCookie = function (c_name) {
                    if (document.cookie.length > 0) {
                        var c_start = document.cookie.indexOf(c_name + "=");
                        if (c_start != -1) {
                            c_start = c_start + c_name.length + 1;
                            var c_end = document.cookie.indexOf(";", c_start);
                            if (c_end == -1)
                                c_end = document.cookie.length;
                            return decodeURI(document.cookie.substring(c_start, c_end)); //unescape取消
                        }
                    }
                    return "";
                };
                KDMWaveDatasource.prototype.getKDMLinkDefaultToken = function () {
                    return this.backendSrv.datasourceRequest({
                        url: this.url + '/rest/v1/users',
                        method: 'GET',
                        withCredentials: true
                    });
                };
                KDMWaveDatasource.prototype.buildSourceParam = function (options) {
                    options.kdmUrl = this.kdmUrl;
                    return options;
                };
                return KDMWaveDatasource;
            })();
            exports_1("default", KDMWaveDatasource);
        }
    }
});
//# sourceMappingURL=datasource.js.map