///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';

export class KDMWaveQueryOptionsCtrl extends QueryCtrl{
  
  static templateUrl = 'partials/query.options.html';
  constructor($scope, $injector, private uiSegmentSrv) {
    super($scope, $injector);
  }
  
  
  
}

