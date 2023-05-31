///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import { QueryCtrl } from 'app/plugins/sdk';

export class GenericDatasourceQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  dataType: any;
  isStep: any;
  isAlert: any;
  queryPoints: any;
  dataTypeOptions: any;
  pointOrWave: any;
  dataSource: any;

  /** @ngInject **/
  constructor($scope, $injector, private uiSegmentSrv) {
    super($scope, $injector);

    this.target.target = this.target.target || '输入kks搜索条件';
    this.pointOrWave = [{ name: '点值', value: 1 }, { name: '波形', value: 2 }];
    this.dataTypeOptions = [{ name: '实时值', value: 1 }, { name: '历史值', value: 2 }];
    this.target.kdm = this.target.kdm || {};
    this.target.kdm.pointOrWave = this.target.kdm.pointOrWave || 1; //默认点值
    this.target.kdm.dataType = this.target.kdm.dataType || 1; //默认取实时值
    this.target.kdm.isStep = this.target.kdm.isStep || false; //默认插值
    this.target.kdm.isAlert = this.target.kdm.isAlert || false; //默认无告警
    this.target.kdm.queryPoints = this.target.kdm.queryPoints || 0; //历史1000条

    var targets = this.panel.targets;
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].refId === 'A') {
        this.target.kdm.pointOrWave = targets[i].kdm.pointOrWave;
        break;
      }
    }

    var dataSource = [
      { name: '波形频谱', value: 1 },
      { name: '气隙', value: 2 },
      { name: '空间轴线', value: 3 }
    ];

    this.dataSource = dataSource;
    this.target.dataSource = this.target.dataSource || 1;
  }

  getOptions() {
    return this.datasource.metricFindQuery(this.target).then(this.uiSegmentSrv.transformToSegments(false));
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }

  changePW() {
    var pwVal = this.target.kdm.pointOrWave;

    var targets = this.panel.targets;
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].refId !== 'A') {
        targets[i].kdm.pointOrWave = pwVal;
      }
    }
  }
}