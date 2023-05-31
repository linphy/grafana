import angular from 'angular';
import config from 'app/core/config';

export class ChangePasswordCtrl {
  /** @ngInject */
  constructor($scope, backendSrv, $location, navModelSrv) {
    $scope.command = {};
    $scope.authProxyEnabled = config.authProxyEnabled;
    $scope.ldapEnabled = config.ldapEnabled;
    $scope.navModel = navModelSrv.getNav('profile', 'change-password', 0);

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

    $scope.changePassword = () => {
      if (!$scope.userForm.$valid) {
        return;
      }
      if ($scope.command.oldPassword === $scope.command.newPassword) {
        $scope.appEvent('alert-warning', ['新旧密码不能相同', '']);
        return;
      }
      if ($scope.command.newPassword !== $scope.command.confirmNew) {
        $scope.appEvent('alert-warning', ['新密码不匹配', '']);
        return;
      }

      backendSrv.put('/api/user/password', $scope.command).then(() => {
        $location.path('profile');
      });
    };
  }
}

angular.module('grafana.controllers').controller('ChangePasswordCtrl', ChangePasswordCtrl);
