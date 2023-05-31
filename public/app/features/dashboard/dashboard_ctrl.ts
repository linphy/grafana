// Utils
import config from 'app/core/config';
import appEvents from 'app/core/app_events';
import coreModule from 'app/core/core_module';
import { removePanel } from 'app/features/dashboard/utils/panel';

// Services
import { AnnotationsSrv } from '../annotations/annotations_srv';

// Types
import { DashboardModel } from './dashboard_model';

export class DashboardCtrl {
  dashboard: DashboardModel;
  dashboardViewState: any;
  loadedFallbackDashboard: boolean;
  editTab: number;
  backgroundUrl: any;

  /** @ngInject */
  constructor(
    private $scope,
    private keybindingSrv,
    private timeSrv,
    private variableSrv,
    private alertingSrv,
    private dashboardSrv,
    private unsavedChangesSrv,
    private dashboardViewStateSrv,
    private annotationsSrv: AnnotationsSrv,
    public playlistSrv,
    public backendSrv
  ) {
    // temp hack due to way dashboards are loaded
    // can't use controllerAs on route yet
    $scope.ctrl = this;

    // TODO: break out settings view to separate view & controller
    this.editTab = 0;

    // funcs called from React component bindings and needs this binding
    this.getPanelContainer = this.getPanelContainer.bind(this);
  }

  setupDashboard(data) {
    try {
      this.setupDashboardInternal(data);
    } catch (err) {
      this.onInitFailed(err, '仪表盘初始化失败', true);
    }
  }

  setupDashboardInternal(data) {
    const dashboard = this.dashboardSrv.create(data.dashboard, data.meta);
    this.dashboardSrv.setCurrent(dashboard);

    // init services
    this.timeSrv.init(dashboard);
    this.alertingSrv.init(dashboard, data.alerts);
    this.annotationsSrv.init(dashboard);

    // template values service needs to initialize completely before
    // the rest of the dashboard can load
    this.variableSrv
      .init(dashboard)
      // template values failes are non fatal
      .catch(this.onInitFailed.bind(this, '模板初始化失败', false))
      // continue
      .finally(() => {
        this.dashboard = dashboard;
        this.dashboard.processRepeats();
        this.dashboard.updateSubmenuVisibility();
        this.dashboard.autoFitPanels(window.innerHeight);

        this.unsavedChangesSrv.init(dashboard, this.$scope);

        // TODO refactor ViewStateSrv
        this.$scope.dashboard = dashboard;
        this.dashboardViewState = this.dashboardViewStateSrv.create(this.$scope);

        this.keybindingSrv.setupDashboardBindings(this.$scope, dashboard);
        this.setWindowTitleAndTheme();

        appEvents.emit('dashboard-initialized', dashboard);
      })
      .catch(this.onInitFailed.bind(this, '仪表盘初始化失败', true));
  }

  onInitFailed(msg, fatal, err) {
    console.log(msg, err);

    if (err.data && err.data.message) {
      err.message = err.data.message;
    } else if (!err.message) {
      err = { message: err.toString() };
    }

    this.$scope.appEvent('alert-error', [msg, err.message]);

    // protect against  recursive fallbacks
    if (fatal && !this.loadedFallbackDashboard) {
      this.loadedFallbackDashboard = true;
      this.setupDashboard({ dashboard: { title: '仪表盘初始化失败' } });
    }
  }

  templateVariableUpdated() {
    this.dashboard.processRepeats();
  }

  setWindowTitleAndTheme() {
    window.document.title = config.windowTitlePrefix + this.dashboard.title;
  }

  hiddenOrShowClick() {
    // [OGE]
    this.$scope.dashboard.showTimes = !this.$scope.dashboard.showTimes;
    appEvents.emit('toggle-kiosk-mode');
  }

  showJsonEditor(evt, options) {
    const model = {
      object: options.object,
      updateHandler: options.updateHandler,
    };

    this.$scope.appEvent('show-dash-editor', {
      src: 'public/app/partials/edit_json.html',
      model: model,
    });
  }

  getDashboard() {
    return this.dashboard;
  }

  getPanelContainer() {
    return this;
  }

  onRemovingPanel(evt, options) {
    options = options || {};
    if (!options.panelId) {
      return;
    }

    const panelInfo = this.dashboard.getPanelInfoById(options.panelId);
    removePanel(this.dashboard, panelInfo.panel, true);
  }

  onDestroy() {
    if (this.dashboard) {
      this.dashboard.destroy();
    }
  }

  init(dashboard) {
    this.$scope.onAppEvent('show-json-editor', this.showJsonEditor.bind(this));
    this.$scope.onAppEvent('template-variable-value-updated', this.templateVariableUpdated.bind(this));
    this.$scope.onAppEvent('panel-remove', this.onRemovingPanel.bind(this));
    this.$scope.$on('$destroy', this.onDestroy.bind(this));
    this.setupDashboard(dashboard);
    this.backendSrv.get(`/api/user/preferences`).then(prefs => {
      this.backgroundUrl = prefs.backgroundUrl ? 'url(public/img/' + prefs.backgroundUrl + ') no-repeat' : 'none';
    });
  }
}

coreModule.controller('DashboardCtrl', DashboardCtrl);
