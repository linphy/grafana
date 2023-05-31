import angular from 'angular';
import _ from 'lodash';

const module = angular.module('grafana.directives');

const template = `
<div class="section gf-form-group">
  <h5 class="section-heading">颜色设置</h5>
  <div class="gf-form-inline" ng-repeat="c in ctrl.colors | orderBy:c.grade">
    <div class="gf-form">
      <label class="gf-form-label width-6" style="text-align:center;">{{c.name}}</label>
      <div class="gf-form-label">
        <spectrum-picker ng-model="c.color" ng-change="ctrl.change()" ></spectrum-picker>
      </div>
      <gf-form-switch class="gf-form" label-class="width-8" label="使用原生" checked="c.useOrigin"
        tooltip="勾选此选项，则对应的报警等级使用控件原生的颜色显示"
        on-change="ctrl.change()"></gf-form-switch>
    </div>
  </div>
  <div class="gf-form">
    <span class="gf-form-label"><a ng-click="ctrl.invert()">反转颜色</a></span>
    <span class="gf-form-label"><a ng-click="ctrl.reset()">默认颜色</a></span>
  </div>
</div>
`;

export class OgeAlertColorsSelector {
  colors: any[];
  panelCtrl: any;

  /** @ngInject */
  constructor(private ogeAlertSrv) {
    const colors = _.cloneDeep(ogeAlertSrv.getAllLevels());
    const userColors = this.panelCtrl.panel.ogeAlertColors;
    if (!_.isEmpty(userColors)) {
      for (const l in userColors) {
        if (!userColors[l]) {
          continue;
        }
        colors[l].useOrigin = userColors[l].useOrigin;
        if (userColors[l].color) {
          colors[l].color = userColors[l].color;
        }
      }
    }
    this.colors = _.toArray(colors);
  }

  change() {
    this.panelCtrl.panel.ogeAlertColors = {};
    const diff = this.isDiffDefault();
    for (let i = 0; i < this.colors.length; i++) {
      this.panelCtrl.panel.ogeAlertColors[this.colors[i].code] = _.clone(this.colors[i]);
      if (!diff) {
        delete this.panelCtrl.panel.ogeAlertColors[this.colors[i].code].color;
      }
    }
    this.panelCtrl.render();
  }

  private isDiffDefault() {
    const defaultColors = this.ogeAlertSrv.getAllLevels();
    for (let i = 0; i < this.colors.length; i++) {
      if (this.colors[i].color !== defaultColors[this.colors[i].code].color) {
        return true;
      }
    }
    return false;
  }

  invert() {
    const colors = _.cloneDeep(this.colors);
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i].color = colors[this.colors.length - 1 - i].color;
    }
    this.change();
  }

  reset() {
    const defaultColors = this.ogeAlertSrv.getAllLevels();
    for (let i = 0; i < this.colors.length; i++) {
      this.colors[i].color = defaultColors[this.colors[i].code].color;
    }
    this.change();
  }
}

module.directive('ogeAlertColorsSelector', function() {
  return {
    restrict: 'E',
    template: template,
    controller: OgeAlertColorsSelector,
    bindToController: true,
    controllerAs: 'ctrl',
    transclude: true,
    scope: {
      panelCtrl: '=',
    },
  };
});
