import _ from 'lodash';
import { Variable, assignModelProperties, variableTypes } from './variable';

export class JsonVariable implements Variable {
  query: string;
  options: any;
  includeAll: boolean;
  multi: boolean;
  unfold: boolean;
  current: any;

  defaults = {
    type: 'json',
    name: '',
    label: '',
    hide: 0,
    options: [],
    current: {},
    query: '',
    includeAll: false,
    multi: false,
    unfold: false,
    allValue: null,
  };

  /** @ngInject **/
  constructor(private model, private variableSrv) {
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
    // extract options in comma separated string
    this.options = _.map(JSON.parse(this.query), function(item) {
      return { text: item.text.trim(), value: item.value };
    });

    if (this.includeAll) {
      this.addAllOption();
    }

    return this.variableSrv.validateVariableSelectionState(this);
  }

  addAllOption() {
    this.options.unshift({ text: 'All', value: '$__all' });
  }

  dependsOn(variable) {
    return false;
  }

  setValueFromUrl(urlValue) {
    return this.variableSrv.setOptionFromUrl(this, urlValue);
  }

  getValueForUrl() {
    if (this.current.text === 'All') {
      return 'All';
    }
    return this.current.value;
  }
}

variableTypes['json'] = {
  name: 'Json',
  ctor: JsonVariable,
  description: 'Define variable values manually',
  supportsMulti: true,
};
