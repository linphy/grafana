define(["app/plugins/sdk","lodash"], function(__WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__, __WEBPACK_EXTERNAL_MODULE_lodash__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./datasource.ts":
/*!***********************!*\
  !*** ./datasource.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GenericDatasource = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = __webpack_require__(/*! lodash */ "lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = undefined && undefined.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

var GenericDatasource = /** @class */function () {
    /** @ngInject */
    function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
        this.$q = $q;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;
        this.jsonData = instanceSettings.jsonData;
        this.sessionKey = this.getCookie('sessionKey');
        this.isJsonTarget = false;
        this.isAlertTarget = false;
    }
    // Called once per panel (graph)
    GenericDatasource.prototype.query = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var query, res, kksCodeStr, i, resn, kksCodeAlertStr, resAlert, data, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.buildQueryParameters(options);
                        if (!query || !_lodash2.default.isArray(query.targets) || query.targets.length <= 0) {
                            return [2 /*return*/, this.$q.when([])];
                        }
                        return [4 /*yield*/, this.getKksCodeStr(query.targets, 'c.kks')];
                    case 1:
                        kksCodeStr = _a.sent();
                        if (!(this.kksKeyVal && this.kksKeyVal.length > 0)) return [3 /*break*/, 6];
                        res = {
                            data: []
                        };
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < this.kksKeyVal.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getDataValue(this.kksKeyVal[i], query)];
                    case 3:
                        resn = _a.sent();
                        if (resn && resn.data && resn.data.length > 0) {
                            res.data = res.data.concat(resn.data);
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        return [3 /*break*/, 8];
                    case 6:
                        return [4 /*yield*/, this.getDataValue(kksCodeStr, query)];
                    case 7:
                        res = _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!query.kdm.isAlert) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.getKksCodeStr(query.targets, 'c.KpiAlertLatest.kpiId')];
                    case 9:
                        kksCodeAlertStr = _a.sent();
                        return [4 /*yield*/, this.getAlertVal(kksCodeAlertStr)];
                    case 10:
                        resAlert = _a.sent();
                        _a.label = 11;
                    case 11:
                        data = [];
                        if (res && res.data) {
                            _loop_1 = function _loop_1(i) {
                                var target = query.targets.filter(function (tar) {
                                    return tar.targetCode == res.data[i].kks;
                                });
                                var obj;
                                if (target.length == 0 && Object.keys(this_1.kksNamObj).length > 0) {
                                    if (this_1.isAlertTarget) {
                                        if (res.data[i] && res.data[i].data && res.data[i].data[0] && res.data[i].data[0].value == 1) {
                                            obj = {
                                                refId: i + 1,
                                                target: this_1.kksNamObj[res.data[i].kks],
                                                datapoints: []
                                            };
                                        } else {
                                            return "continue";
                                        }
                                    } else {
                                        obj = {
                                            refId: i + 1,
                                            target: this_1.kksNamObj[res.data[i].kks],
                                            datapoints: []
                                        };
                                    }
                                } else {
                                    obj = {
                                        refId: target[0].refId,
                                        target: target[0].targetName ? target[0].targetName : target[0].targetCode,
                                        datapoints: []
                                    };
                                }
                                res.data[i].data.map(function (da) {
                                    obj.datapoints.push([da.value, da.timestamp]);
                                });
                                if (query.kdm.isAlert && resAlert && resAlert.data && resAlert.data.length > 0) {
                                    var alertVal = resAlert.data.filter(function (tar) {
                                        return tar.KpiAlertLatest.kpiId == res.data[i].kks;
                                    });
                                    if (alertVal.length > 0) {
                                        obj['alarm'] = {
                                            level: alertVal[0].KpiAlertLatest.alertLevel,
                                            value: alertVal[0].KpiAlertLatest.value,
                                            time: alertVal[0].KpiAlertLatest.datetime
                                        };
                                    }
                                }
                                data.push(obj);
                            };
                            this_1 = this;
                            for (i = 0; i < res.data.length; i++) {
                                _loop_1(i);
                            }
                            data.sort(this.compare('refId'));
                        }
                        return [2 /*return*/, { data: data }];
                }
            });
        });
    };
    GenericDatasource.prototype.getKksCodeStr = function (targets, kksS) {
        return __awaiter(this, void 0, void 0, function () {
            var kksCodeStr, j, targStr, jsonArr, tarsArrStr, i, queryString, resValue, n, i, g, kksStr, i, kksStr2, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        kksCodeStr = kksS + ' = "';
                        this.kksKeyVal = [];
                        this.kksNamObj = {};
                        j = 0;
                        _a.label = 1;
                    case 1:
                        if (!(j < targets.length)) return [3 /*break*/, 5];
                        if (!(targets[j].targetCode.indexOf('json:') === 0 || targets[j].targetCode.indexOf('alert:') === 0)) return [3 /*break*/, 3];
                        if (targets[j].targetCode.indexOf('json:') === 0) {
                            this.isJsonTarget = true;
                            targStr = targets[j].targetCode.split('json:');
                        } else {
                            this.isAlertTarget = true;
                            targStr = targets[j].targetCode.split('alert:');
                        }
                        jsonArr = targStr[1].split('|');
                        tarsArrStr = '';
                        for (i = 0; i < jsonArr.length; i++) {
                            if (i == 0) {
                                tarsArrStr = "c.kks_code like '%" + jsonArr[i] + "%'";
                            } else {
                                tarsArrStr += " OR c.kks_code like '%" + jsonArr[i] + "%'";
                            }
                        }
                        queryString = "SELECT kks_code, kks_name FROM " + this.jsonData.kksOntologies + " AS c where " + tarsArrStr + " order by c.kks_code";
                        return [4 /*yield*/, this.getOneSaitDataValue(this.jsonData.kksOntologies, queryString)];
                    case 2:
                        resValue = _a.sent();
                        if (resValue && resValue.data && resValue.data.length > 0) {
                            n = resValue.data.length / 1000;
                            if (n <= 1) {
                                for (i = 0; i < resValue.data.length; i++) {
                                    this.kksNamObj[resValue.data[i].kks_code] = resValue.data[i].kks_name;
                                    if (i === 0) {
                                        kksCodeStr += resValue.data[i].kks_code + '"';
                                    } else {
                                        kksCodeStr += ' OR c.kks = "' + resValue.data[i].kks_code + '"';
                                    }
                                }
                                this.kksKeyVal.push(kksCodeStr);
                            } else {
                                for (g = 1; g <= n; g++) {
                                    kksStr = kksS + ' = "';
                                    for (i = 0; i < 1000; i++) {
                                        this.kksNamObj[resValue.data[i].kks_code] = resValue.data[i].kks_name;
                                        if (i === 0) {
                                            kksStr += resValue.data[i].kks_code + '"';
                                        } else {
                                            kksStr += ' OR c.kks = "' + resValue.data[i].kks_code + '"';
                                        }
                                    }
                                    this.kksKeyVal.push(kksStr);
                                }
                                if (resValue.data % 1000 > 0) {
                                    kksStr2 = kksS + ' = "';
                                    for (i = 0; i < resValue.data % 1000; i++) {
                                        this.kksNamObj[resValue.data[i].kks_code] = resValue.data[i].kks_name;
                                        if (j === 0 && i === 0) {
                                            kksStr2 += resValue.data[i].kks_code + '"';
                                        } else {
                                            kksStr2 += ' OR c.kks = "' + resValue.data[i].kks_code + '"';
                                        }
                                    }
                                    this.kksKeyVal.push(kksStr2);
                                }
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        if (j === 0) {
                            kksCodeStr += targets[0].targetCode + '"';
                        } else {
                            kksCodeStr += ' OR ' + kksS + ' = "' + targets[j].targetCode + '"';
                        }
                        _a.label = 4;
                    case 4:
                        j++;
                        return [3 /*break*/, 1];
                    case 5:
                        return [2 /*return*/, kksCodeStr];
                }
            });
        });
    };
    GenericDatasource.prototype.compare = function (key) {
        return function (value1, value2) {
            var val1 = value1[key];
            var val2 = value2[key];
            if (val1 == undefined || val2 == undefined) {
                return 0;
            }
            if (!Number(val1)) {
                val1 = val1.charCodeAt() - 65;
            }
            if (!Number(val2)) {
                val2 = val2.charCodeAt() - 65;
            }
            return val1 - val2;
        };
    };
    GenericDatasource.prototype.getAlertVal = function (kkses) {
        return __awaiter(this, void 0, void 0, function () {
            var str, resValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        str = 'select KpiAlertLatest.alertLevel, KpiAlertLatest.datetime, KpiAlertLatest.value, KpiAlertLatest.kpiId from KpiAlertLatest as c where ' + kkses;
                        return [4 /*yield*/, this.getOneSaitDataValue('KpiAlertLatest', str)];
                    case 1:
                        resValue = _a.sent();
                        return [2 /*return*/, resValue];
                }
            });
        });
    };
    GenericDatasource.prototype.getDataValue = function (kksCodeStr, query) {
        return __awaiter(this, void 0, void 0, function () {
            var str, startT, endT, timeStr, val, resValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        str = '';
                        if (query.kdm && query.kdm.dataType === 2) {
                            //历史
                            startT = query.range.from.valueOf();
                            endT = query.range.to.valueOf();
                            timeStr = 'AND timestamp > ' + startT + ' AND timestamp < ' + endT;
                            val = 'value';
                            if (query.kdm.isStep && query.kdm.queryPoints) {
                                val = 'interp(value, ' + Math.floor((endT - startT) / 1000 / query.kdm.queryPoints) + ')';
                            }
                            str = 'select kks, timestamp, ' + val + ' from RTDATA as c where ' + kksCodeStr + timeStr + ' group by kks';
                        } else {
                            str = 'select kks, timestamp, value from RTDATA as c where ' + kksCodeStr + ' group by kks';
                        }
                        return [4 /*yield*/, this.getOneSaitDataValue('RTData', str)];
                    case 1:
                        resValue = _a.sent();
                        return [2 /*return*/, resValue];
                }
            });
        });
    };
    GenericDatasource.prototype.getOneSaitDataValue = function (table, queryText) {
        return __awaiter(this, void 0, void 0, function () {
            var reskey, _a, resul, para, res, reskey, resul;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.sessionKey) return [3 /*break*/, 4];
                        if (!this.getCookie('sessionKey')) return [3 /*break*/, 1];
                        _a = this.getCookie('sessionKey');
                        return [3 /*break*/, 3];
                    case 1:
                        return [4 /*yield*/, this.getSessionKey()];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        reskey = _a;
                        if (!reskey) {
                            return [2 /*return*/, []];
                        }
                        resul = reskey.sessionKey ? reskey.sessionKey : reskey;
                        this.saveCookie('sessionKey', resul);
                        this.sessionKey = resul;
                        _b.label = 4;
                    case 4:
                        para = {
                            url: this.url + '/iot-broker/rest/ontology/' + table + '/post?queryType=SQL',
                            headers: { Authorization: this.sessionKey },
                            data: queryText,
                            method: 'POST'
                        };
                        return [4 /*yield*/, this.getSessionKeyDataValue(para)];
                    case 5:
                        res = _b.sent();
                        if (!(res == 'Invalid SessionKey')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getSessionKey()];
                    case 6:
                        reskey = _b.sent();
                        if (!reskey) {
                            return [2 /*return*/, []];
                        }
                        resul = reskey.sessionKey;
                        this.saveCookie('sessionKey', resul);
                        this.sessionKey = resul;
                        para = {
                            url: this.url + '/iot-broker/rest/ontology/' + table + '/post?queryType=SQL',
                            headers: { Authorization: this.sessionKey },
                            data: queryText,
                            method: 'POST'
                        };
                        return [4 /*yield*/, this.getSessionKeyDataValue(para)];
                    case 7:
                        res = _b.sent();
                        _b.label = 8;
                    case 8:
                        return [2 /*return*/, res];
                }
            });
        });
    };
    GenericDatasource.prototype.getSessionKeyDataValue = function (para) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.backendSrv.datasourceRequest(para).then(function (result) {
                    return result;
                }).catch(function (reason) {
                    console.log('获取实时值失败：' + reason.message);
                    if (reason.message && reason.message.indexOf('Invalid SessionKey') > 0) {
                        return 'Invalid SessionKey';
                    } else {
                        return '';
                    }
                })];
            });
        });
    };
    GenericDatasource.prototype.saveCookie = function (cookieName, cookieValue) {
        document.cookie = cookieName + "=" + cookieValue + ";";
    };
    GenericDatasource.prototype.getCookie = function (cookieName) {
        var cookieStr = unescape(document.cookie);
        var arr = cookieStr.split("; ");
        var cookieValue = "";
        for (var i = 0; i < arr.length; i++) {
            var temp = arr[i].split("=");
            if (temp[0] == cookieName) {
                cookieValue = temp[1];
                break;
            }
        }
        return cookieValue;
    };
    // Required
    // Used for testing datasource in datasource configuration pange
    GenericDatasource.prototype.testDatasource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.url || !this.jsonData.token || !this.jsonData.kksOntologies) {
                            return [2 /*return*/, this.$q.when({ status: 'faild', message: '请确认链接，用户名和密码都已填写', title: '连接失败' })];
                        }
                        return [4 /*yield*/, this.getSessionKey()];
                    case 1:
                        res = _a.sent();
                        if (!res) return [2 /*return*/, this.$q.when({ status: 'faild', message: '获取平台信息失败，请重新验证', title: '连接失败' })];
                        this.saveCookie('sessionKey', res.sessionKey);
                        return [2 /*return*/, this.$q.when({ status: 'success', message: 'Onesait请求连接成功', title: '连接成功' })];
                }
            });
        });
    };
    GenericDatasource.prototype.getSessionKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    token: this.jsonData.token,
                    clientPlatform: 'grafana',
                    clientPlatformId: 'grafana'
                };
                return [2 /*return*/, this.backendSrv.get(this.url + '/iot-broker/rest/client/join', params).then(function (res) {
                    return res;
                }).catch(function (err) {
                    console.log('sessionKey请求失败,失败原因' + err.statusText);
                    return '';
                })];
            });
        });
    };
    GenericDatasource.prototype.metricFindQuery = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldsName, queryString, likeString, limitCount, orderbyCount, dc, dc, resValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        likeString = " ";
                        if (options === 'jz') {
                            dc = this.templateSrv.replace('$dc');
                            if (dc === '$dc') {
                                //机组查询
                                dc = '';
                            }
                            fieldsName = " facility_f0, facility_f0_value, facility_g, facility_g_value ";
                            limitCount = 100;
                            orderbyCount = "order by c.facility_g";
                        } else if (options === 'dc') {
                            fieldsName = " manage_a1a2, manage_an, manage_an_value ";
                            limitCount = 20;
                            orderbyCount = "order by c.manage_an";
                        } else if (options === 'jz:$dc') {
                            dc = this.templateSrv.replace('$dc');
                            fieldsName = " facility_f0, facility_f0_value, facility_g, facility_g_value ";
                            likeString = " where c.kks_code like '%" + dc + "%' ";
                            limitCount = 100;
                            orderbyCount = "order by c.facility_g";
                        } else {
                            fieldsName = " kks_code, kks_name ";
                            likeString = " where c.kks_code like '%" + options.target + "%' OR c.kks_name like '%" + options.target + "%' ";
                            limitCount = 20;
                            orderbyCount = "order by c.kks_code";
                        }
                        queryString = "SELECT" + fieldsName + "FROM " + this.jsonData.kksOntologies + " AS c" + likeString + orderbyCount + " limit " + limitCount;
                        return [4 /*yield*/, this.getOneSaitDataValue(this.jsonData.kksOntologies, queryString)];
                    case 1:
                        resValue = _a.sent();
                        return [2 /*return*/, this.mapToTextValue(resValue)];
                }
            });
        });
    };
    GenericDatasource.prototype.mapToTextValue = function (result) {
        if (result && result.data && result.data.length > 0) {
            var arr = [];
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].facility_f0) {
                    //机组
                    var textVal = result.data[i].facility_f0_value;
                    var valVal = result.data[i].facility_g + '' + result.data[i].facility_f0;
                    if (result.data[i].facility_f0 == 0 && valVal == 'A0') continue;
                    var jzObj = { text: textVal, value: valVal };
                    arr.push(jzObj);
                } else if (result.data[i].manage_an) {
                    //电厂
                    var dcObj = {
                        text: result.data[i].manage_an_value,
                        value: result.data[i].manage_a1a2 + result.data[i].manage_an
                    };
                    arr.push(dcObj);
                } else {
                    var kksStr = void 0;
                    if (result.data[i].kks_name && result.data[i].kks_name !== '') {
                        //如果有名字返回
                        kksStr = result.data[i].kks_code + '_' + result.data[i].kks_name;
                    } else {
                        kksStr = result.data[i].kks_code;
                    }
                    arr.push(kksStr);
                }
            }
            result.data = arr;
        }
        //Templating
        if (result && result.data && result.data.length > 0 && _typeof(result.data[0]) === 'object') {
            return result.data.KKSInfos;
        }
        if (!result || !result.data) {
            result = {
                data: []
            };
        }
        //kks标签
        return _lodash2.default.map(result.data, function (d, i) {
            return { text: d, value: i };
        });
    };
    GenericDatasource.prototype.buildQueryParameters = function (options) {
        //remove placeholder targets
        options.targets = _lodash2.default.filter(options.targets, function (target) {
            return target.target !== '输入查询条件' && target.target !== undefined && target.target != '输入kks搜索条件';
        });
        var targetsArr = [];
        // var onesait:any = options.targets.length>0?options.targets[0].onesait:{};
        for (var i = 0; i < options.targets.length; i++) {
            if (!options.targets[i].hide) {
                options.targets[i].targetCode = this.templateSrv.replace(options.targets[i].target, options.scopedVars);
                var obj = {
                    target: options.targets[i].target,
                    targetCode: options.targets[i].targetCode,
                    targetName: options.targets[i].targetCode,
                    refId: options.targets[i].refId
                };
                if (options.targets[i].targetCode.indexOf('_') > 0) {
                    var queryTargetArr = options.targets[i].targetCode.split('_');
                    obj.targetCode = queryTargetArr[0];
                    obj.targetName = queryTargetArr[1];
                }
                targetsArr.push(obj);
            }
        }
        var targets = targetsArr;
        options.targets = targets;
        return options;
    };
    return GenericDatasource;
}();
exports.GenericDatasource = GenericDatasource;

/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = __webpack_require__(/*! ./datasource */ "./datasource.ts");

var _query_ctrl = __webpack_require__(/*! ./query_ctrl */ "./query_ctrl.ts");

var _query_option = __webpack_require__(/*! ./query_option */ "./query_option.ts");

var GenericAnnotationsQueryCtrl = /** @class */function () {
    function GenericAnnotationsQueryCtrl() {}
    GenericAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    return GenericAnnotationsQueryCtrl;
}();
var OnesaitDatasourceConfigCtrl = /** @class */function () {
    function OnesaitDatasourceConfigCtrl() {}
    OnesaitDatasourceConfigCtrl.templateUrl = 'partials/config.html';
    return OnesaitDatasourceConfigCtrl;
}();
exports.Datasource = _datasource.GenericDatasource;
exports.QueryCtrl = _query_ctrl.GenericDatasourceQueryCtrl;
exports.ConfigCtrl = OnesaitDatasourceConfigCtrl;
exports.QueryOptionsCtrl = _query_option.GenericQueryOptionsCtrl;
exports.AnnotationsQueryCtrl = GenericAnnotationsQueryCtrl;

/***/ }),

/***/ "./query_ctrl.ts":
/*!***********************!*\
  !*** ./query_ctrl.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GenericDatasourceQueryCtrl = undefined;

var _sdk = __webpack_require__(/*! grafana/app/plugins/sdk */ "grafana/app/plugins/sdk");

///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var GenericDatasourceQueryCtrl = /** @class */function (_super) {
    __extends(GenericDatasourceQueryCtrl, _super);
    /** @ngInject **/
    function GenericDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.uiSegmentSrv = uiSegmentSrv;
        _this.target.target = _this.target.target || '输入kks搜索条件';
        _this.dataTypeOptions = [{ name: '实时值', value: 1 }, { name: '历史值', value: 2 }];
        return _this;
    }
    GenericDatasourceQueryCtrl.prototype.getOptions = function () {
        return this.datasource.metricFindQuery(this.target).then(this.uiSegmentSrv.transformToSegments(false));
    };
    GenericDatasourceQueryCtrl.prototype.onChangeInternal = function () {
        this.panelCtrl.refresh();
    };
    GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    return GenericDatasourceQueryCtrl;
}(_sdk.QueryCtrl);
exports.GenericDatasourceQueryCtrl = GenericDatasourceQueryCtrl;

/***/ }),

/***/ "./query_option.ts":
/*!*************************!*\
  !*** ./query_option.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GenericQueryOptionsCtrl = undefined;

var _sdk = __webpack_require__(/*! grafana/app/plugins/sdk */ "grafana/app/plugins/sdk");

var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

var GenericQueryOptionsCtrl = /** @class */function (_super) {
    __extends(GenericQueryOptionsCtrl, _super);
    /** @ngInject **/
    function GenericQueryOptionsCtrl($scope, $injector) {
        var _this = _super.call(this, $scope, $injector) || this;
        var dataTypeOptions = [{ name: '实时值', value: 1 }, { name: '历史值', value: 2 }];
        _this.dataTypeOptions = dataTypeOptions;
        _this.panelCtrl.panel.kdm = _this.panelCtrl.panel.kdm || {};
        _this.panelCtrl.panel.kdm.dataType = _this.panelCtrl.panel.kdm.dataType || 1; //默认取实时值
        _this.panelCtrl.panel.kdm.isAlert = _this.panelCtrl.panel.kdm.isAlert || false; //默认无告警
        _this.panelCtrl.panel.kdm.isStep = _this.panelCtrl.panel.kdm.isStep || false;
        _this.panelCtrl.panel.kdm.queryPoints = _this.panelCtrl.panel.kdm.queryPoints || 1000;
        return _this;
    }
    GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
    return GenericQueryOptionsCtrl;
}(_sdk.QueryCtrl);
exports.GenericQueryOptionsCtrl = GenericQueryOptionsCtrl;

/***/ }),

/***/ "grafana/app/plugins/sdk":
/*!**********************************!*\
  !*** external "app/plugins/sdk" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ })

/******/ })});;
//# sourceMappingURL=module.js.map