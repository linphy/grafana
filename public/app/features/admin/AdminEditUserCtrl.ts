import _ from 'lodash';

export default class AdminEditUserCtrl {
  /** @ngInject */
  constructor($scope, $routeParams, backendSrv, $location, navModelSrv) {
    $scope.user = {};
    $scope.newOrg = { name: '', role: 'Editor' };
    $scope.permissions = {};
    $scope.navModel = navModelSrv.getNav('cfg', 'admin', 'global-users', 1);

    $scope.init = () => {
      if ($routeParams.id) {
        $scope.getUser($routeParams.id);
        $scope.getUserOrgs($routeParams.id);
      }
    };

    $scope.getUser = id => {
      backendSrv.get('/api/users/' + id).then(user => {
        $scope.user = user;
        $scope.user_id = id;
        $scope.permissions.isGrafanaAdmin = user.isGrafanaAdmin;
      });
    };

    $scope.setPassword = () => {
      if (!$scope.passwordForm.$valid) {
        return;
      }

      const payload = { password: $scope.password };
      backendSrv.put('/api/admin/users/' + $scope.user_id + '/password', payload).then(() => {
        $location.path('/admin/users');
      });
    };

    $scope.updatePermissions = () => {
      const payload = $scope.permissions;

      backendSrv.put('/api/admin/users/' + $scope.user_id + '/permissions', payload).then(() => {
        $location.path('/admin/users');
      });
    };

    $scope.emailPattern = (function() {
      var regexp = /^([a-z0-9]*[-_.]?[a-z0-9]+)+@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/;
      return {
        test: function(value) {
          return regexp.test(value);
        },
      };
    })();

    $scope.passwordPattern = (function() {
      //是否包含字母
      function isIncludeLiter(strData) {
        if (!strData) {
          return false;
        }
        var reg = /[a-z]/;
        if (!reg.test(strData)) {
          return false;
        }
        return true;
      }
      function isIncludeUpperLiter(strData) {
        if (!strData) {
          return false;
        }
        var reg = /[A-Z]/;
        if (!reg.test(strData)) {
          return false;
        }
        return true;
      }
      //是否包含数字
      function isIncludeNumber(strData) {
        if (!strData) {
          return false;
        }
        var reg = /[0-9]/;
        if (!reg.test(strData)) {
          return false;
        }
        return true;
      }
      //是否包含特殊字符
      function isIncludeSChar(strData) {
        if (strData == '') {
          return false;
        }
        // 全部特殊字符
        var reg = new RegExp("[`~!@#$^&*%()_+=|{}':;',\\-\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        return reg.test(strData);
      }
      return {
        test: function(value) {
          if (value.indexOf(' ') > -1) {
            return false;
          }
          let num = 0;
          let lowercase = isIncludeLiter(value);
          if (lowercase) {
            num++;
          }
          let uppercase = isIncludeUpperLiter(value);
          if (uppercase) {
            num++;
          }
          let haveNumber = isIncludeNumber(value);
          if (haveNumber) {
            num++;
          }
          let haveChar = isIncludeSChar(value);
          if (haveChar) {
            num++;
          }
          return num > 2;
        },
      };
    })();

    $scope.create = () => {
      if (!$scope.userForm.$valid) {
        return;
      }

      backendSrv.post('/api/admin/users', $scope.user).then(() => {
        $location.path('/admin/users');
      });
    };

    $scope.getUserOrgs = id => {
      backendSrv.get('/api/users/' + id + '/orgs').then(orgs => {
        $scope.orgs = orgs;
      });
    };

    $scope.update = () => {
      if (!$scope.userForm.$valid) {
        return;
      }

      backendSrv.put('/api/users/' + $scope.user_id, $scope.user).then(() => {
        $location.path('/admin/users');
      });
    };

    $scope.updateOrgUser = orgUser => {
      backendSrv.patch('/api/orgs/' + orgUser.orgId + '/users/' + $scope.user_id, orgUser).then(() => {});
    };

    $scope.removeOrgUser = orgUser => {
      backendSrv.delete('/api/orgs/' + orgUser.orgId + '/users/' + $scope.user_id).then(() => {
        $scope.getUser($scope.user_id);
        $scope.getUserOrgs($scope.user_id);
      });
    };

    $scope.orgsSearchCache = [];

    $scope.searchOrgs = (queryStr, callback) => {
      if ($scope.orgsSearchCache.length > 0) {
        callback(_.map($scope.orgsSearchCache, 'name'));
        return;
      }

      backendSrv.get('/api/orgs', { query: '' }).then(result => {
        $scope.orgsSearchCache = result;
        callback(_.map(result, 'name'));
      });
    };

    $scope.addOrgUser = () => {
      if (!$scope.addOrgForm.$valid) {
        return;
      }

      const orgInfo = _.find($scope.orgsSearchCache, {
        name: $scope.newOrg.name,
      });
      if (!orgInfo) {
        return;
      }

      $scope.newOrg.loginOrEmail = $scope.user.login;

      backendSrv.post('/api/orgs/' + orgInfo.id + '/users/', $scope.newOrg).then(() => {
        $scope.getUser($scope.user_id);
        $scope.getUserOrgs($scope.user_id);
      });
    };

    $scope.init();
  }
}
