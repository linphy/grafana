import angular from 'angular';
import _ from 'lodash';

class MixedDatasource {
  /** @ngInject */
  constructor(private $q, private datasourceSrv) {}

  query(options) {
    const tempTargets = angular.copy(options.targets);
    if (options.targets.length > 1) {
      //按照refId升序
      tempTargets.sort((a,b)=>{
        if(a.refId<b.refId) {
          return -1;
        }
        return 1;
      });
      var tempTarget = tempTargets[0];
      var kdm = null;
      const that = this;
      if (tempTarget.refId === "A") {
        return this.datasourceSrv.get(tempTarget.datasource).then(ds => {
          if (ds.type === "oge-kdm") {
            kdm = tempTarget.kdm;
            for (let i = 1; i < tempTargets.length; i++) {
              tempTarget = tempTargets[i];
              if (tempTarget.kdm) {
                tempTarget.kdm = kdm;
              }
            }
          }
          return that.queryTargets(options,tempTargets);
        });
      }
    }
    return this.queryTargets(options,tempTargets);
  }

  queryTargets(options,targets) {
    const sets = _.groupBy(targets, 'datasource');
    const promises = _.map(sets, targets => {
      const dsName = targets[0].datasource;
      if (dsName === '-- Mixed --') {
        return this.$q([]);
      }

      return this.datasourceSrv.get(dsName).then(ds => {
        const opt = angular.copy(options);
        opt.targets = targets;
        return ds.query(opt);
      });
    });

    return this.$q.all(promises).then(results => {
      return { data: _.flatten(_.map(results, 'data')) };
    });
  }
}

export { MixedDatasource, MixedDatasource as Datasource };
