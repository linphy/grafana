'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasourceQueryCtrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('app/plugins/sdk');

require('./css/query-editor.css!');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericDatasourceQueryCtrl = exports.GenericDatasourceQueryCtrl = function (_QueryCtrl) {
  _inherits(GenericDatasourceQueryCtrl, _QueryCtrl);

  function GenericDatasourceQueryCtrl($scope, $injector) {
    _classCallCheck(this, GenericDatasourceQueryCtrl);

    var _this = _possibleConstructorReturn(this, (GenericDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(GenericDatasourceQueryCtrl)).call(this, $scope, $injector));

    _this.scope = $scope;
    _this.dsOption = [{ name: '智杰实时库', value: 0 }, { name: '振动波形', value: 1 }];
    _this.typeOption = [{ name: '原始数据', value: 0 }, { name: '频域数据', value: 1 }, { name: '包络谱数据', value: 2 }];
    _this.rtdbOption = [{ name: '实时值', value: 0 }, { name: '历史值', value: 1 }, { name: '历史等间隔', value: 2 }];
    _this.target.tag = _this.target.tag || '';
    _this.target.dsType = _this.target.dsType || 0;
    _this.target.waveType = _this.target.waveType || 0;
    _this.target.rtdbType = _this.target.rtdbType || 0;
    _this.target.hisCount = _this.target.hisCount || 5000;
    _this.target.hisInterval = _this.target.hisInterval || 1000;
    _this.target.script = _this.target.script || '';
    return _this;
  }

  _createClass(GenericDatasourceQueryCtrl, [{
    key: 'getOptions',
    value: function getOptions(query) {
      return this.datasource.metricFindQuery(query || '*');
    }
  }, {
    key: 'onChangeInternal',
    value: function onChangeInternal() {
      this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
  }]);

  return GenericDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map
