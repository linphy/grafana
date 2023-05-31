import angular from 'angular';
import _ from 'lodash';

export class SubmenuCtrl {
  annotations: any;
  variables: any;
  dashboard: any;

  /** @ngInject */
  constructor(private variableSrv, private templateSrv, private $location) {
    this.annotations = this.dashboard.templating.list;
    this.variables = this.variableSrv.variables;
    this.templateSrv = templateSrv; // [OGE]
  }

  annotationStateChanged() {
    this.dashboard.startRefresh();
  }
  // [OGE]
  getValuesForTag(variable, tagKey) {
    return this.variableSrv.getValuesForTag(variable, tagKey);
  }

  regDCandJZ(description) {
    let jz = this.templateSrv.replaceWithText('$jz');
    let dc = this.templateSrv.replaceWithText('$dc');
    if (jz !== '$jz') {
      description = description.replace('${jz}', jz);
    }
    if (dc !== '$dc') {
      description = description.replace('${dc}', dc);
    }
    if (this.templateSrv.variables && this.templateSrv.variables.length > 0 && this.templateSrv.variables[0].current) {
      for (let i = 0; i < this.templateSrv.variables.length; i++) {
        if (description.indexOf('@name') === -1) {
          let str = '[[' + this.templateSrv.variables[i].name + ']]';
          let value = this.templateSrv.variables[i].current.value;
          if (this.templateSrv.variables[i].name && value) {
            description = description.replace(str, value);
          }
        } else {
          let strOne = '[[' + this.templateSrv.variables[i].name + '@name]]';
          let valueOne = this.templateSrv.variables[i].current.text;
          if (this.templateSrv.variables[i].name && valueOne) {
            description = description.replace(strOne, valueOne);
          }
        }
      }
    }
    let bgTitleElem = document.getElementById('a-spacial-class-sd');
    bgTitleElem.style.backgroundColor = this.dashboard.bgColor;
    return description;
  }
  // 结束
  variableUpdated(variable) {
    this.variableSrv.variableUpdated(variable, true);
  }

  openEditView(editview) {
    const search = _.extend(this.$location.search(), { editview: editview });
    this.$location.search(search);
  }
}

export function submenuDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/features/dashboard/submenu/submenu.html',
    controller: SubmenuCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      dashboard: '=',
    },
  };
}

angular.module('grafana.directives').directive('dashboardSubmenu', submenuDirective);
