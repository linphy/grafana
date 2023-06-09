import angular from 'angular';
import { saveAs } from 'file-saver';
import coreModule from 'app/core/core_module';

const template = `
<div class="modal-body">
  <div class="modal-header">
    <h2 class="modal-header-title">
      <i class="fa fa-save"></i><span class="p-l-1">无法保存已配置的仪表板</span>
    </h2>

    <a class="modal-header-close" ng-click="ctrl.dismiss();">
      <i class="fa fa-remove"></i>
    </a>
  </div>

  <div class="modal-content">
    <small>
    这个仪表板不能在KAM的UI中保存，因为它是从另一个来源提供的。复制JSON或将其保存到下面的文件中。然后，您可以在相应的源中更新仪表板。
    </small>
    <div class="p-t-2">
      <div class="gf-form">
        <code-editor content="ctrl.dashboardJson" data-mode="json" data-max-lines=15></code-editor>
      </div>
      <div class="gf-form-button-row">
        <button class="btn btn-success" clipboard-button="ctrl.getJsonForClipboard()">
          <i class="fa fa-clipboard"></i>&nbsp;复制JSON到剪贴板
        </button>
        <button class="btn btn-secondary" clipboard-button="ctrl.save()">
          <i class="fa fa-save"></i>&nbsp;将JSON保存到文件
        </button>
        <a class="btn btn-link" ng-click="ctrl.dismiss();">取消</a>
      </div>
    </div>
  </div>
</div>
`;

export class SaveProvisionedDashboardModalCtrl {
  dash: any;
  dashboardJson: string;
  dismiss: () => void;

  /** @ngInject */
  constructor(dashboardSrv) {
    this.dash = dashboardSrv.getCurrent().getSaveModelClone();
    delete this.dash.id;
    this.dashboardJson = angular.toJson(this.dash, true);
  }

  save() {
    const blob = new Blob([angular.toJson(this.dash, true)], {
      type: 'application/json;charset=utf-8',
    });
    saveAs(blob, this.dash.title + '-' + new Date().getTime() + '.json');
  }

  getJsonForClipboard() {
    return this.dashboardJson;
  }
}

export function saveProvisionedDashboardModalDirective() {
  return {
    restrict: 'E',
    template: template,
    controller: SaveProvisionedDashboardModalCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: { dismiss: '&' },
  };
}

coreModule.directive('saveProvisionedDashboardModal', saveProvisionedDashboardModalDirective);
