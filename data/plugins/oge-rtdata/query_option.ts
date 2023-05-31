import { QueryCtrl } from 'app/plugins/sdk';

export class GenericQueryOptionsCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.options.html';

  dataType: any;
  isStep: any;
  isAlert: any;
  queryPoints: any;
  dataTypeOptions: any;

  /** @ngInject **/
  constructor($scope, $injector) {
    super($scope, $injector);

    var dataTypeOptions = [{ name: '实时值', value: 1 }, { name: '历史值', value: 2 }];

    this.dataTypeOptions = dataTypeOptions;
    this.panelCtrl.panel.kdm = this.panelCtrl.panel.kdm || {};
    this.panelCtrl.panel.kdm.dataType = this.panelCtrl.panel.kdm.dataType || 1; //默认取实时值
    this.panelCtrl.panel.kdm.isStep = this.panelCtrl.panel.kdm.isStep || true; //默认插值
    this.panelCtrl.panel.kdm.isAlert = this.panelCtrl.panel.kdm.isAlert || false; //默认无告警
    this.panelCtrl.panel.kdm.queryPoints = this.panelCtrl.panel.kdm.queryPoints || 1000; //历史1000条
  }
}
