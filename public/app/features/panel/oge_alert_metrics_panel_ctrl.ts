import _ from 'lodash';
import { MetricsPanelCtrl } from './metrics_panel_ctrl';

class OgeAlertMetricsPanelCtrl extends MetricsPanelCtrl {
  $q: any;
  ogeAlertSrv: any;
  ogeAlertColorValue: boolean;
  ogeAlertColorBackground: boolean;
  ogeAlertColorRow: boolean;
  ogeAlertConfig = {
    withAlertTab: true,
    showCover: false,
  };

  constructor($scope, $injector, alertConfig?, metricsOptionSettings?) {
    super($scope, $injector, metricsOptionSettings);
    this.$q = $injector.get('$q');
    this.ogeAlertSrv = $injector.get('ogeAlertSrv');

    const panelDefaults = {
      ogeAlertEnabled: true,
      ogeAlertColorType: 'V',
    };
    _.defaults(this.panel, panelDefaults);
    this.ogeAlertConfig = _.extend(this.ogeAlertConfig, alertConfig);

    this.setOgeAlertColorType2Show();

    if (this.ogeAlertConfig.withAlertTab !== false) {
      this.events.on('init-edit-mode', this.onOgeAlertInitMetricsPanelEditMode.bind(this));
    }
  }

  private onOgeAlertInitMetricsPanelEditMode() {
    this.addEditorTab('Alert Config', 'public/app/partials/oge_alert.html');
  }

  getAlertLevelColor(originCode) {
    return this.ogeAlertSrv.getLevelColor(originCode, this.panel.ogeAlertColors);
  }

  getAlertLevelName(originCode) {
    return this.ogeAlertSrv.getLevelName(originCode);
  }

  getCoverValue(alert, value) {
    if (this.panel.ogeAlertEnabled) {
      if (this.panel.ogeAlertNameCoverValue) {
        return this.getAlertLevelName(alert.level);
      } else if (this.panel.ogeAlertValueCoverValue) {
        return alert.value;
      }
    }
    return value;
  }

  selectCoverValue(isAlertNameCoverValue) {
    if (isAlertNameCoverValue) {
      this.panel.ogeAlertValueCoverValue = false;
    } else {
      this.panel.ogeAlertNameCoverValue = false;
    }
    this.render();
  }

  getCoverTime(alert, time) {
    if (this.panel.ogeAlertEnabled && this.panel.ogeAlertNameCoverValue) {
      return alert.time;
    }
    return time;
  }

  changeOgeAlertColorType(type) {
    this.panel.ogeAlertColorType = type;
    this.setOgeAlertColorType2Show();
    this.render();
  }

  maxAlertLevelOriginCode(originCode: any[]) {
    return this.ogeAlertSrv.maxLevelOriginCode(originCode);
  }

  private setOgeAlertColorType2Show() {
    this.ogeAlertColorValue = false;
    this.ogeAlertColorBackground = false;
    this.ogeAlertColorRow = false;
    switch (this.panel.ogeAlertColorType) {
      case 'V':
        this.ogeAlertColorValue = true;
        break;
      case 'B':
        this.ogeAlertColorBackground = true;
        break;
      case 'R':
        this.ogeAlertColorRow = true;
        break;
    }
  }
}

export { OgeAlertMetricsPanelCtrl };
