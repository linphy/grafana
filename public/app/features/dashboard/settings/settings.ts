import { coreModule, appEvents, contextSrv } from 'app/core/core';
import { DashboardModel } from '../dashboard_model';
import $ from 'jquery';
import _ from 'lodash';
import angular from 'angular';
import config from 'app/core/config';

export class SettingsCtrl {
  dashboard: DashboardModel;
  isOpen: boolean;
  viewId: string;
  json: string;
  alertCount: number;
  canSaveAs: boolean;
  canSave: boolean;
  canDelete: boolean;
  sections: any[];
  hasUnsavedFolderChange: boolean;

  /** @ngInject */
  constructor(
    private $scope,
    private $route,
    private $location,
    private $rootScope,
    private backendSrv,
    private dashboardSrv
  ) {
    // temp hack for annotations and variables editors
    // that rely on inherited scope
    $scope.dashboard = this.dashboard;

    this.$scope.$on('$destroy', () => {
      this.dashboard.updateSubmenuVisibility();
      setTimeout(() => {
        this.$rootScope.appEvent('dash-scroll', { restore: true });
        this.dashboard.startRefresh();
      });
    });

    this.canSaveAs = this.dashboard.meta.canEdit && contextSrv.hasEditPermissionInFolders;
    this.canSave = this.dashboard.meta.canSave;
    this.canDelete = this.dashboard.meta.canSave;

    this.buildSectionList();
    this.onRouteUpdated();

    this.$rootScope.onAppEvent('$routeUpdate', this.onRouteUpdated.bind(this), $scope);
    this.$rootScope.appEvent('dash-scroll', { animate: false, pos: 0 });
    this.$rootScope.onAppEvent('dashboard-saved', this.onPostSave.bind(this), $scope);
  }

  buildSectionList() {
    this.sections = [];

    if (this.dashboard.meta.canEdit) {
      this.sections.push({
        title: '默认',
        id: 'settings',
        icon: 'gicon gicon-preferences',
      });
      this.sections.push({
        title: '注释',
        id: 'annotations',
        icon: 'gicon gicon-annotation',
      });
      this.sections.push({
        title: '变量',
        id: 'templating',
        icon: 'gicon gicon-variable',
      });
      this.sections.push({
        title: '链接',
        id: 'links',
        icon: 'gicon gicon-link',
      });
    }

    if (this.dashboard.id && this.dashboard.meta.canSave) {
      this.sections.push({
        title: '版本',
        id: 'versions',
        icon: 'fa fa-fw fa-history',
      });
    }

    if (this.dashboard.id && this.dashboard.meta.canAdmin) {
      this.sections.push({
        title: '权限',
        id: 'permissions',
        icon: 'fa fa-fw fa-lock',
      });
    }

    if (this.dashboard.meta.canMakeEditable) {
      this.sections.push({
        title: '默认',
        icon: 'gicon gicon-preferences',
        id: 'make_editable',
      });
    }

    this.sections.push({
      title: 'JSON模型',
      id: 'dashboard_json',
      icon: 'gicon gicon-json',
    });

    const params = this.$location.search();
    const url = this.$location.path();

    for (const section of this.sections) {
      const sectionParams = _.defaults({ editview: section.id }, params);
      section.url = config.appSubUrl + url + '?' + $.param(sectionParams);
    }
  }

  onRouteUpdated() {
    this.viewId = this.$location.search().editview;

    if (this.viewId) {
      this.json = angular.toJson(this.dashboard.getSaveModelClone(), true);
    }

    if (this.viewId === 'settings' && this.dashboard.meta.canMakeEditable) {
      this.viewId = 'make_editable';
    }

    const currentSection = _.find(this.sections, { id: this.viewId });
    if (!currentSection) {
      this.sections.unshift({
        title: '未发现',
        id: '404',
        icon: 'fa fa-fw fa-warning',
      });
      this.viewId = '404';
    }
  }

  openSaveAsModal() {
    this.dashboardSrv.showSaveAsModal();
  }

  saveDashboard() {
    this.dashboardSrv.saveDashboard();
  }

  saveDashboardJson() {
    this.dashboardSrv.saveJSONDashboard(this.json).then(() => {
      this.$route.reload();
    });
  }

  onPostSave() {
    this.hasUnsavedFolderChange = false;
  }

  hideSettings() {
    const urlParams = this.$location.search();
    delete urlParams.editview;
    setTimeout(() => {
      this.$rootScope.$apply(() => {
        this.$location.search(urlParams);
      });
    });
  }

  makeEditable() {
    this.dashboard.editable = true;
    this.dashboard.meta.canMakeEditable = false;
    this.dashboard.meta.canEdit = true;
    this.dashboard.meta.canSave = true;
    this.canDelete = true;
    this.viewId = 'settings';
    this.buildSectionList();

    const currentSection = _.find(this.sections, { id: this.viewId });
    this.$location.url(currentSection.url);
  }

  deleteDashboard() {
    let confirmText = '';
    let text2 = this.dashboard.title;

    const alerts = _.sumBy(this.dashboard.panels, panel => {
      return panel.alert ? 1 : 0;
    });

    if (alerts > 0) {
      confirmText = '删除';
      text2 = `这个仪表盘包含 ${alerts} 报警. 删除这个仪表盘，报警信息也将被删除。`;
    }

    appEvents.emit('confirm-modal', {
      title: '删除',
      text: '你想删除这个仪表盘?',
      text2: text2,
      icon: 'fa-trash',
      confirmText: confirmText,
      yesText: '删除',
      onConfirm: () => {
        this.dashboard.meta.canSave = false;
        this.deleteDashboardConfirmed();
      },
    });
  }

  deleteDashboardConfirmed() {
    this.backendSrv.deleteDashboard(this.dashboard.uid).then(() => {
      appEvents.emit('alert-success', ['删除仪表盘', this.dashboard.title + ' 将被删除。']);
      this.$location.url('/');
    });
  }

  onFolderChange(folder) {
    this.dashboard.meta.folderId = folder.id;
    this.dashboard.meta.folderTitle = folder.title;
    this.hasUnsavedFolderChange = true;
  }

  getFolder() {
    return {
      id: this.dashboard.meta.folderId,
      title: this.dashboard.meta.folderTitle,
      url: this.dashboard.meta.folderUrl,
    };
  }
}

export function dashboardSettings() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/features/dashboard/settings/settings.html',
    controller: SettingsCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    transclude: true,
    scope: { dashboard: '=' },
  };
}

coreModule.directive('dashboardSettings', dashboardSettings);
