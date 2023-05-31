import coreModule from '../../core_module';
import appEvents from 'app/core/app_events';

export class HelpCtrl {
  tabIndex: any;
  shortcuts: any;

  /** @ngInject */
  constructor() {
    this.tabIndex = 0;
    this.shortcuts = {
      Global: [
        { keys: ['g', 'h'], description: '跳转主页仪表盘' },
        { keys: ['g', 'p'], description: '跳转配置页面' },
        { keys: ['s', 'o'], description: '搜索仪表盘' },
        { keys: ['s', 's'], description: '打开标星过滤搜索' },
        { keys: ['s', 't'], description: '打开标签页搜索' },
        { keys: ['esc'], description: '退出编辑/设置页面' },
      ],
      Dashboard: [
        { keys: ['mod+s'], description: '保存仪表盘' },
        { keys: ['d', 'r'], description: '刷新所有面板' },
        { keys: ['d', 's'], description: '仪表盘设置' },
        { keys: ['d', 'v'], description: '切换 in-active / view 模式' },
        { keys: ['d', 'k'], description: '切换 kiosk 模式 (隐藏顶部导航)' },
        { keys: ['d', 'E'], description: '展开所有行' },
        { keys: ['d', 'C'], description: '折叠所有行' },
        { keys: ['d', 'a'], description: '切换自动贴合面板(实验功能)' },
        { keys: ['mod+o'], description: '切换共享 graph crosshair' },
      ],
      'Focused Panel': [
        { keys: ['e'], description: '切换面板编辑视图' },
        { keys: ['v'], description: '切换面板全屏视图' },
        { keys: ['p', 's'], description: '开放面板共享模式' },
        { keys: ['p', 'd'], description: '复制面板' },
        { keys: ['p', 'r'], description: '删除面板' },
        { keys: ['p', 'l'], description: '切换面板的说明' },
      ],
      'Time Range': [
        { keys: ['t', 'z'], description: '缩小时间范围' },
        {
          keys: ['t', '<i class="fa fa-long-arrow-left"></i>'],
          description: '将时间范围向后移动',
        },
        {
          keys: ['t', '<i class="fa fa-long-arrow-right"></i>'],
          description: '将时间范围向前移动',
        },
      ],
    };
  }

  dismiss() {
    appEvents.emit('hide-modal');
  }
}

export function helpModal() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/help/help.html',
    controller: HelpCtrl,
    bindToController: true,
    transclude: true,
    controllerAs: 'ctrl',
    scope: {},
  };
}

coreModule.directive('helpModal', helpModal);
