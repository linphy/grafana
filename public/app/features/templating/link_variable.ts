import _ from 'lodash';
import { Variable, assignModelProperties, variableTypes } from './variable';

export class LinkVariable implements Variable {
  query: string;
  options: any;
  current: any;
  links: any;

  defaults = {
    type: 'link',
    name: '',
    label: '',
    hide: 0,
    options: [],
    current: {},
    links: [],
    query: '',
  };

  /** @ngInject **/
  constructor(private model, private variableSrv, private linkSrv) {
    assignModelProperties(this, model, this.defaults);
  }

  setValue(option) {
    return this.variableSrv.setOptionAsCurrent(this, option);
  }

  getSaveModel() {
    assignModelProperties(this.model, this, this.defaults);
    return this.model;
  }

  updateOptions() {
    let that = this;
    this.options = _.map(that.links, function(link) {
      let theTemplates = that.variableSrv.templateSrv.variables;
      let linkInfo = that.linkSrv.getPanelLinkAnchorInfo(link, theTemplates);
      // let urlstr = '"url":"'+linkInfo.href+'",'+'"target":"'+ linkInfo.target+'"';
      that.query = link.title + linkInfo.href + '';
      return { text: link.title.trim(), value: linkInfo.href.trim(), target: linkInfo.target.trim() };
    });

    return this.variableSrv.validateVariableSelectionState(this);
  }

  dependsOn(variable) {
    return false;
  }

  setValueFromUrl(urlValue) {
    return this.variableSrv.setOptionFromUrl(this, urlValue);
  }

  getValueForUrl() {
    return this.current.value;
  }
}

variableTypes['link'] = {
  name: 'Link',
  ctor: LinkVariable,
  description: 'Define variable link manually',
};
