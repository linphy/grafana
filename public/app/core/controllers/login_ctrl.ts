import _ from 'lodash';
import coreModule from '../core_module';
import config from 'app/core/config';
import $ from 'jquery';

export class LoginCtrl {
  /** @ngInject */
  constructor($scope, backendSrv, contextSrv, $location) {
    $scope.formModel = {
      user: '',
      email: '',
      password: '',
      verifyId: '',
      verifyValue: '',
    };
    $scope.identificationNumberPic = '1234';
    $scope.command = {};
    $scope.result = '';
    $scope.loggingIn = false;

    contextSrv.sidemenu = false;

    $scope.oauth = config.oauth;
    $scope.oauthEnabled = _.keys(config.oauth).length > 0;
    $scope.ldapEnabled = config.ldapEnabled;
    $scope.authProxyEnabled = config.authProxyEnabled;

    $scope.disableLoginForm = config.disableLoginForm;
    $scope.disableUserSignUp = config.disableUserSignUp;
    $scope.loginHint = config.loginHint;
    $scope.verificationCode = config.verificationCode;

    $scope.loginMode = true;
    $scope.submitBtnText = '登录';

    $scope.init = () => {
      $scope.$watch('loginMode', $scope.loginModeChanged);

      if (config.loginError) {
        $scope.appEvent('alert-warning', ['登录失败', config.loginError]);
      }
    };

    $scope.submit = () => {
      if ($scope.loginMode) {
        $scope.login();
      } else {
        $scope.signUp();
      }
    };

    $scope.changeView = () => {
      const loginView = document.querySelector('#login-view');
      const changePasswordView = document.querySelector('#change-password-view');

      loginView.className += ' add';
      setTimeout(() => {
        loginView.className += ' hidden';
      }, 250);
      setTimeout(() => {
        changePasswordView.classList.remove('hidden');
      }, 251);
      setTimeout(() => {
        changePasswordView.classList.remove('remove');
      }, 301);

      setTimeout(() => {
        document.getElementById('newPassword').focus();
      }, 400);
    };

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
      if (!$scope.passwordForm.$valid) {
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
        $scope.toGrafana();
      });
    };

    $scope.skip = () => {
      $scope.toGrafana();
    };

    $scope.loginModeChanged = newValue => {
      $scope.submitBtnText = newValue ? '登录' : '注册';
    };

    $scope.signUp = () => {
      if (!$scope.loginForm.$valid) {
        return;
      }

      backendSrv.post('/api/user/signup', $scope.formModel).then(result => {
        if (result.status === 'SignUpCreated') {
          $location.path('/signup').search({ email: $scope.formModel.email });
        } else {
          window.location.href = config.appSubUrl + '/';
        }
      });
    };

    $scope.login = () => {
      delete $scope.loginError;

      if (!$scope.loginForm.$valid) {
        return;
      }
      $scope.loggingIn = true;

      backendSrv
        .post('/login', $scope.formModel)
        .then(result => {
          $scope.result = result;
          if (!$scope.result.helpFlag) {
            $scope.changeView();
            return;
          }
          if ($scope.formModel.password !== 'admin' || $scope.ldapEnabled || $scope.authProxyEnabled) {
            $scope.toGrafana();
            return;
          } else {
            $scope.changeView();
            $scope.refreshIdentificationNumberPic();
            $scope.formModel.verifyValue = '';
          }
        })
        .catch(() => {
          $scope.loggingIn = false;
          $scope.refreshIdentificationNumberPic();
          $scope.formModel.verifyValue = '';
        });
    };

    $scope.toGrafana = () => {
      const params = $location.search();

      if (params.redirect && params.redirect[0] === '/') {
        window.location.href = config.appSubUrl + params.redirect;
      } else if ($scope.result.redirectUrl) {
        window.location.href = $scope.result.redirectUrl;
      } else {
        window.location.href = config.appSubUrl + '/';
      }
    };

    $scope.refreshIdentificationNumberPic = () => {
      backendSrv
        .get('/api/getCaptcha')
        .then(result => {
          if (result && result.captchaId && result.data) {
            $scope.formModel.verifyId = result.captchaId;
            $('#identificationNumberPic').attr('src', result.data);
          }
        })
        .catch(() => {
          $scope.loggingIn = false;
        });
    };
    if ($scope.verificationCode) {
      $scope.refreshIdentificationNumberPic();
    }
    $scope.init();
  }
}

coreModule.controller('LoginCtrl', LoginCtrl);
