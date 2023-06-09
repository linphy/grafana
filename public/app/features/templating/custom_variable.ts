import _ from 'lodash';
import { Variable, assignModelProperties, variableTypes } from './variable';

export class CustomVariable implements Variable {
  query: string;
  options: any;
  includeAll: boolean;
  multi: boolean;
  current: any;
  skipUrlSync: boolean;

  defaults = {
    type: 'custom',
    name: '',
    label: '',
    hide: 0,
    options: [],
    current: {},
    query: '',
    includeAll: false,
    multi: false,
    allValue: null,
    skipUrlSync: false,
  };

  /** @ngInject */
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
    //[OGE]query的text和value可以用@@隔开
    if (this.query.indexOf('@@') === -1) {
      this.options = _.map(this.query.split(/[,]+/), function(text) {
        return { text: text.trim(), value: text.trim() };
      });
    } else {
      this.options = _.map(this.query.split(/[,]+/), function(text) {
        let textTwo = text.split('@@');
        return { text: textTwo[0].trim(), value: textTwo[1].trim() };
      });
    }
    // END
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

variableTypes['custom'] = {
  name: 'Custom',
  ctor: CustomVariable,
  description: 'Define variable values manually',
  supportsMulti: true,
};
