///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import { QueryCtrl } from 'app/plugins/sdk';


export class KDMWaveDatasourceQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  dataSource: any;
  
  constructor($scope, $injector, private uiSegmentSrv) {
    super($scope, $injector);

    this.target.target = this.target.target || '输入kks搜索条件';

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
}


