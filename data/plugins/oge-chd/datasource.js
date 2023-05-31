'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericDatasource = exports.GenericDatasource = function () {
  function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
    _classCallCheck(this, GenericDatasource);

    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.tableName = instanceSettings.jsonData.tableName;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.headers = { 'Content-Type': 'application/json' };
  }

  _createClass(GenericDatasource, [{
    key: 'query',
    value: function query(options) {
      var query = this.buildQueryParameters(options);
      query.targets = query.targets.filter(function (t) {
        return !t.hide;
      });

      if (query.targets.length <= 0) {
        return this.q.when({ data: [] });
      }

      if (this.templateSrv.getAdhocFilters) {
        query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
      } else {
        query.adhocFilters = [];
      }

      if (query.targets[0].dsType == 1) {
        return this.queryWave(query.targets);
      }

      var startTime = query.range.from.valueOf();
      var endTime = query.range.to.valueOf();
      return this.queryRT(query.targets, startTime, endTime);
    }
  }, {
    key: 'queryWave',
    value: function queryWave(targets) {
      var type = targets[0].waveType;
      return this.doRequest({
        url: this.url + '/wave/data/' + type,
        data: targets[0].tag,
        method: 'POST'
      }).then(function (res) {
        var axis = res.data;
        if (res.status !== 200 || !axis || !axis.x || !axis.y) {
          return { data: [] };
        }
        var datapoints = [];
        axis.x.forEach(function (item, index) {
          datapoints.push([axis.y[index], item]);
        });
        var data = {
          target: targets[0].tag,
          datapoints: datapoints
        };
        return { 'data': [data] };
      });
    }
  }, {
    key: 'queryRT',
    value: function queryRT(targets, start, end) {
      var _this = this;

      var tags = [];
      var nameMap = {};
      var scirptMap = {};
      targets.forEach(function (target) {
        var index = target.tag.indexOf("-");
        var tag = target.tag;
        if (index != -1) {
          if (tag.indexOf(":") != -1) {
            tag = target.tag.substr(0, index);
          } else {
            tag = _this.tableName + "." + target.tag.substr(0, index);
          }
          nameMap[tag] = target.tag.substr(index + 1, target.tag.length);
        }
        if (target.script) {
          scirptMap[tag] = target.script;
        }
        tags.push(tag);
      });

      var rtdbType = targets[0].rtdbType;
      var hisCount = targets[0].hisCount;
      var hisInterval = targets[0].hisInterval;
      var url;
      if (rtdbType == 1) {
        url = this.url + '/rtdb/history/' + tags.join(",") + "/" + hisCount + "/" + start + "/" + end;
      } else if (rtdbType == 2) {
        url = this.url + '/rtdb/historyInterval/' + +"/" + hisCount + "/" + hisInterval + "/" + start;
      }

      if (rtdbType == 0) {
        return this.doRequest({
          url: this.url + '/rtdb/snapshot',
          data: tags.join(","),
          method: 'POST'
        }).then(function (res) {
          return _this.mapToResult(tags, res.data, nameMap, scirptMap);
        });
      } else {
        return this.doRequest({
          url: url,
          method: 'GET'
        }).then(function (res) {
          return _this.mapToResult(tags, res.data, nameMap, scirptMap);
        });
      }
    }
  }, {
    key: 'mapToResult',
    value: function mapToResult(tags, data, nameMap, scirptMap) {
      var indexMap = {};
      data.forEach(function (item) {
        var datapoints = [];
        var script = scirptMap[item.code];
        item.datas.forEach(function (data) {
          var value = data.value;
          if (script) {
            script = "(function getTrueValue(){ " + script.replace(/\$value/g, value) + "})";
            value = eval(script)();
          }
          datapoints.push([value, data.time]);
        });
        var rData = { target: item.code, datapoints: datapoints };
        if (nameMap[item.code]) {
          rData.target = nameMap[item.code];
        }
        indexMap[item.code] = rData;
      });

      var result = [];
      //返回数据根据传入的tag排序
      tags.forEach(function (code) {
        if (indexMap[code]) {
          result.push(indexMap[code]);
        }
      });
      return { data: result };
    }
  }, {
    key: 'testDatasource',
    value: function testDatasource() {
      return this.doRequest({
        url: this.url + '/status',
        method: 'GET'
      }).then(function (response) {
        if (response.status === 200) {
          return { status: "success", message: "数据源连接成功", title: "Success" };
        }
      });
    }
  }, {
    key: 'annotationQuery',
    value: function annotationQuery(options) {
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

      return this.doRequest({
        url: this.url + '/annotations',
        method: 'POST',
        data: annotationQuery
      }).then(function (result) {
        return result.data;
      });
    }
  }, {
    key: 'metricFindQuery',
    value: function metricFindQuery(query) {
      var target = this.templateSrv.replace(query, null, 'regex');

      return this.doRequest({
        url: this.url + '/rtdb/search/' + target,
        method: 'GET'
      }).then(this.mapToTextValue);
    }
  }, {
    key: 'mapToTextValue',
    value: function mapToTextValue(result) {
      return _lodash2.default.map(result.data, function (d, i) {
        if (d && d.text && d.value) {
          return { text: d.text, value: d.value };
        } else if (_lodash2.default.isObject(d)) {
          return { text: d, value: i };
        }
        return { text: d, value: d };
      });
    }
  }, {
    key: 'doRequest',
    value: function doRequest(options) {
      options.withCredentials = this.withCredentials;
      options.headers = this.headers;

      return this.backendSrv.datasourceRequest(options);
    }
  }, {
    key: 'buildQueryParameters',
    value: function buildQueryParameters(options) {
      var _this2 = this;

      //remove placeholder targets
      options.targets = _lodash2.default.filter(options.targets, function (target) {
        return target.target !== 'select metric';
      });

      var targets = _lodash2.default.map(options.targets, function (target) {
        return {
          tag: _this2.templateSrv.replace(target.tag, options.scopedVars, 'regex'),
          refId: target.refId,
          hide: target.hide,
          dsType: target.dsType || 0,
          waveType: target.waveType || 0,
          rtdbType: target.rtdbType || 0,
          hisCount: target.hisCount || 0,
          hisInterval: target.hisInterval || 0,
          script: target.script
        };
      });

      options.targets = targets;

      return options;
    }
  }, {
    key: 'getTagKeys',
    value: function getTagKeys(options) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.doRequest({
          url: _this3.url + '/tag-keys',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }, {
    key: 'getTagValues',
    value: function getTagValues(options) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.doRequest({
          url: _this4.url + '/tag-values',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }]);

  return GenericDatasource;
}();
//# sourceMappingURL=datasource.js.map
