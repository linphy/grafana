import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class OgeAlertSrv {
  ALERT_LEVEL = {
    A: { code: 'A', name: '正常', grade: 1, color: 'rgba(14, 147, 24, 0.97)' },
    B: { code: 'B', name: '警告', grade: 2, color: 'rgba(205, 126, 2, 0.89)' },
    C: { code: 'C', name: '危险', grade: 3, color: 'rgba(168, 34, 42, 0.9)' },
  };

  CODE_LEVEL_MAP = {
    '1': 'A',
    '2': 'B',
    '3': 'C',
    '4': 'C',
  };

  /** @ngInject */
  constructor() {}

  getLevel(orginCode) {
    let code = this.CODE_LEVEL_MAP[orginCode];
    if (code) {
      return this.ALERT_LEVEL[code];
    }
  }

  getLevelName(orginCode) {
    let level = this.getLevel(orginCode);
    return level ? level.name : null;
  }

  getLevelColor(orginCode, myColors?) {
    if (!_.isEmpty(myColors)) {
      let myColor = myColors[this.CODE_LEVEL_MAP[orginCode]];
      if (myColor) {
        if (myColor.useOrigin) {
          return null;
        }
        if (myColor.color) {
          return myColor.color;
        }
      }
    }
    let level = this.getLevel(orginCode);
    return level ? level.color : null;
  }

  getAllLevels() {
    return this.ALERT_LEVEL;
  }

  maxLevelOriginCode(orginCodes: any[]) {
    let _t = this;
    return _.maxBy(orginCodes, function(o) {
      let code = _t.CODE_LEVEL_MAP[o];
      return code ? _t.ALERT_LEVEL[code].grade : null;
    });
  }
}

coreModule.service('ogeAlertSrv', OgeAlertSrv);
