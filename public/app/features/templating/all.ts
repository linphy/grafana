import './editor_ctrl';
import coreModule from 'app/core/core_module';

import templateSrv from './template_srv';
import templateChange from './templateChange'; //[OGE]
import { VariableSrv } from './variable_srv';
import { IntervalVariable } from './interval_variable';
import { QueryVariable } from './query_variable';
import { DatasourceVariable } from './datasource_variable';
import { CustomVariable } from './custom_variable';
import { ConstantVariable } from './constant_variable';
import { AdhocVariable } from './adhoc_variable';
import { TextBoxVariable } from './TextBoxVariable';
import { LinkVariable } from './link_variable'; //[OGE]
import { JsonVariable } from './json_variable'; //[OGE]

coreModule.factory('templateSrv', () => {
  return templateSrv;
});

//[OGE]
coreModule.factory('templateChange', () => {
  return templateChange;
});

//[OGE]
//[OGE]
//[OGE]
export {
  VariableSrv,
  IntervalVariable,
  QueryVariable,
  DatasourceVariable,
  CustomVariable,
  LinkVariable,
  JsonVariable,
  ConstantVariable,
  AdhocVariable,
  TextBoxVariable,
};
