import coreModule from 'app/core/core_module';
import appEvents from 'app/core/app_events';

export class MoveToFolderCtrl {
  dashboards: any;
  folder: any;
  dismiss: any;
  afterSave: any;
  isValidFolderSelection = true;

  /** @ngInject */
  constructor(private backendSrv) {}

  onFolderChange(folder) {
    this.folder = folder;
  }

  save() {
    return this.backendSrv.moveDashboards(this.dashboards, this.folder).then(result => {
      if (result.successCount > 0) {
        const header = `仪表盘${result.successCount === 1 ? '' : 's'} 已移动`;
        const msg = `${result.successCount} 仪表盘${result.successCount === 1 ? '' : 's'} 已移动到 ${
          this.folder.title
        }`;
        appEvents.emit('alert-success', [header, msg]);
      }

      if (result.totalCount === result.alreadyInFolderCount) {
        appEvents.emit('alert-error', ['Error', `仪表盘已经移动到文件夹 ${this.folder.title}`]);
      }

      this.dismiss();
      return this.afterSave();
    });
  }

  onEnterFolderCreation() {
    this.isValidFolderSelection = false;
  }

  onExitFolderCreation() {
    this.isValidFolderSelection = true;
  }
}

export function moveToFolderModal() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/features/dashboard/move_to_folder_modal/move_to_folder.html',
    controller: MoveToFolderCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      dismiss: '&',
      dashboards: '=',
      afterSave: '&',
    },
  };
}

coreModule.directive('moveToFolderModal', moveToFolderModal);
