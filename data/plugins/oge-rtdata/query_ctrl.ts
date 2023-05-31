import { QueryCtrl } from 'app/plugins/sdk';

export class GenericDatasourceQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  /** @ngInject **/
  constructor($scope, $injector, private uiSegmentSrv) {
    super($scope, $injector);

    this.target.target = this.target.target || '输入kks搜索条件';
  }

  getOptions() {
    return this.datasource.metricFindQuery(this.target).then(this.uiSegmentSrv.transformToSegments(false));
    // Options have to be transformed by uiSegmentSrv to be usable by metric-segment-model directive
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}
