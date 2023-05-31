///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';

export class RESTDatasourceQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  messureType: any;
  tagName: string;
  inputMomodel: any;
  modernBrowsers: any;
  outputBrowsers: any;

  /** @ngInject **/
  constructor($scope, $injector, private uiSegmentSrv) {
    super($scope, $injector);

    this.modernBrowsers = [];
    this.outputBrowsers = [];

    var messureType = [
      { name: '三维-模型-时间列表', value: 'd3_model_timeList' },
      { name: '三维-模型', value: 'd3model_models' },
      { name: '指标值', value: 'kpi_data' },
      { name: '指标值-Json', value: 'kpi_json_data' },
    ];

    this.messureType = messureType;

    this.target.tagName = this.target.tagName;
    this.target.target = this.target.tagName;
    this.target.messureType = this.target.messureType || 'kpi_data';
  }

  getOptions() {
    return this.datasource.metricFindQuery(this.target).then(this.uiSegmentSrv.transformToSegments(false));
  }

  getCategory() {
    return this.datasource.metricFindQuery(this.target).then(data => {
      this.inputMomodel = data;
    });
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}
