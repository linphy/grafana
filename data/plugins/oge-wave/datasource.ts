///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';

export default class KDMWaveDatasource {
  type: string;
  url: string;
  name: string;
  kdmUrl: string;
  linkUser: string;
  linkPassword: string;
  tokenName:string = 'XSRF-TOKEN';

  constructor(instanceSettings, private $q, private backendSrv, private templateSrv, private templateChange) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.kdmUrl = instanceSettings.jsonData.kdmUrl;
    this.linkUser = instanceSettings.jsonData.linkUser;
    this.linkPassword = instanceSettings.jsonData.linkPassword;
  }

  // Called once per panel (graph)
  query(options: any) {
    var query = this.buildQueryParameters(options);

    if (query.targets.length <= 0) {
      return this.$q.when([]);
    }

    //波形数据源: kks选择替换
    if (this.templateSrv.wave_kks && this.templateSrv.wave_kks.length > 0 && this.templateSrv.wave_time) {

      var existTar = query.targets[0];
      //只有在特定的页面才生效
      if (existTar.target == this.templateSrv.page_name) {
        //修改时间
        var time = this.templateSrv.wave_time.replace(/-/g, "/");
        query.range.to._d = new Date(time);
        query.range.from._d = new Date(time);

        query.targets = [];
        var selectTargets = this.templateSrv.wave_kks;
        for (var j = 0; j < selectTargets.length; j++) {
          var targetObj = {
            dataSource: existTar.dataSource,
            target: selectTargets[j]
          };
          query.targets.push(targetObj); //每次query.targets都是空的，不需要考虑是否重复
        }

      } else {
        return this.$q.when([]);
      }
    } else if (query.targets[0].target === 'custom') {
      return this.$q.when([]);
    } else if (query.targets[0].target === '__zhou-xian-fen-xi' || query.targets[0].target === '__pin-pu-fen-xi' || query.targets[0].target === '__qi-xi-fen-xi') {
      return this.$q.when([]);
    }

    //更换机组号
    this.templateChange.changeTargets(query.targets);

    options = {
      url: this.buildRequestUrl('/query'),
      data: query,
      method: 'POST',
      headers: {}
    };
    options.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return this.getLoginStatus().then(data => {
      return this.request(options)
    }).catch(error => {
      return this.relogin(error, options)
    })
  }

  // Required
  // Used for testing datasource in datasource configuration pange
  testDatasource() {
    //验证kdm插件、kdm server是否连接成功
    var postData = new Object();
    postData = this.buildSourceParam(postData);

    var deferred = this.$q.defer();
    this.getLoginStatus().then((data) => {
      var options = {
        url: this.buildRequestUrl('/checkServer'),
        method: 'POST',
        data: postData,
        headers: {}
      };
      options.headers['Content-Type'] = 'application/json;charset=UTF-8';

      this.request(options).then(result => {
        if (result.data.toString() === 'true') {
          deferred.resolve({
            status: "success",
            message: "web plugin and kdm server connect succeed",
            title: "连接成功"
          });
        } else if (result.data.toString() === 'false') {
          deferred.resolve({
            status: "faild",
            message: "kdm server connect error，please check network",
            title: "连接失败"
          });
        }
      }).catch(error => {

        this.relogin(error, options).then(data => {

          deferred.resolve({
            status: "success",
            message: "web plugin and kdm server connect succeed",
            title: "连接成功"
          });

        }, error => {

          deferred.resolve({
            status: "faild",
            message: "kdm plugin connect error，please check network",
            title: "连接失败"
          });

        });

      });
    }, error => {
      deferred.resolve({
        status: "faild",
        message: "kdm plugin connect error，please check network",
        title: "登录失败"
      });
    });
    return deferred.promise;

  }

  annotationQuery(options) {
    console.log("自定义数据源annotationQuery");
    console.log(options);
    var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
    var annotationQuery = {
      range: options.range,
      annotation: {
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
        query: query
      },
      rangeRaw: options.rangeRaw
    };

    options = {
      url: this.buildRequestUrl('/annotations'),
      method: 'POST',
      data: annotationQuery,
      headers: {}
    };
    options.headers['Content-Type'] = 'application/json;charset=UTF-8';

    return this.request(options).then(result => {
      return result.data;
    }).catch(error => {
      return this.relogin(error, options);
    });
  }

  // Optional
  // Required for templating
  metricFindQuery(options) {
    if (options === "jz") {
      var dc = this.templateSrv.replace("$dc");
      if (dc === "$dc") { //机组查询
        dc = "";
      }
      options = {
        target: dc,
        dataType: -2,
        kdmUrl: this.kdmUrl
      };
    } else if (options === "dc") {
      options = {
        target: "",
        dataType: -1,
        kdmUrl: this.kdmUrl
      };
    } else {
      options = this.buildSourceParam(options);
    }

    return this.getLoginStatus().then((data) => {

      var options1 = {
        url: this.buildRequestUrl('/search'),
        data: options,
        method: 'POST',
        headers: {}
      };
      options1.headers['Content-Type'] = 'application/json;charset=UTF-8';

      return this.request(options1).then(this.mapToTextValue, error => {
        return this.relogin(error, options1).then(this.mapToTextValue);
      });
    });

  }

  mapToTextValue(result) {
    if (result.data && result.data.length > 0 && typeof (result.data[0]) === "object") {
      return result.data;
    } else
      return _.map(result.data, (d, i) => {
        return {
          text: d,
          value: i
        };
      });
  }

  buildQueryParameters(options) {
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== '输入查询条件';
    });

    var targets = _.map(options.targets, target => {
      return {
        target: this.templateSrv.replace(target.target),
        refId: target.refId,
        dataSource: target.dataSource, //数据来源
        jsonType: target.jsonType, //数据来源细类
        dataType: target.dataType, //取数方式：实时、历史
      };
    });

    options.targets = targets;
    options = this.buildSourceParam(options);
    return options;
  }

  /**
   * 
   */
  getLoginStatus() {

    let deferred = this.$q.defer();
    //如果输入了link的帐号和密码表示请求的是link地址
    if (this.linkUser && this.linkPassword && !this.getCookie(this.tokenName)) {

      this.getKDMLinkDefaultToken().then(data => {
        deferred.resolve(data);
      }).catch(error => {

        this.loginRequest().then(data => {
          deferred.resolve(true);
        }, error => {
          deferred.reject(false)
        });

      });

    } else { //正常请求
      deferred.resolve(true);
    }
    return deferred.promise;
  }



  /**
   * 
   *经测试在link退出登录后,Cookie不会被删除,还是能够正确的获取到,所以当在请求后,如果返回的是401错误,需要再次执行登录以及发送相应的请求
   */
  relogin(error, re) {

    var deferred = this.$q.defer();
    if (error.status === 401) {
      this.loginRequest().then(data => {

        this.request(re).then(data => {
          deferred.resolve(true)
        }, error => {
          deferred.reject(false);
        });

      });
    } else
      deferred.reject(false);
    return deferred.promise;
  }



  /**
   * 
   */
  loginRequest() {

    var deferred = this.$q.defer();
    this.getKDMLinkDefaultToken().then(data => {
      deferred.resolve(data);
    }).catch(error => {

      console.info("没有获取到Link登录的信息,重新执行登录验证")
      var options = {
        url: this.url + '/rest/v2/login',
        method: 'POST',
        data: {
          username: this.linkUser,
          password: this.linkPassword
        },
        headers: {}
      };
      this.request(options).then(data => {
        deferred.resolve(data);
      }, error => {
        deferred.reject(error);
      });
    });

    return deferred.promise;
  }

  request(rawOptions) {


    if (!rawOptions.headers) {
      rawOptions.headers = {};
      rawOptions.headers['Accept'] = 'application/json;charset=UTF-8';
      rawOptions.headers['Content-Type'] = undefined;
    }


    if (this.linkUser && this.linkPassword) {
      rawOptions.withCredentials = true;
      rawOptions.headers['X-XSRF-TOKEN'] = this.getCookie(this.tokenName)
    }


    return this.backendSrv.datasourceRequest(rawOptions)
  }



  buildRequestUrl(relativePath) {
    if (this.linkUser && this.linkPassword) {
      return this.url + '/rest/v1/data-points/wave' + relativePath;
    } else
      return this.url + "/wave" + relativePath;
  }


  //如果是link请求需要将url设置成link要求的格式
  //需要判断是否存在登录后的cookie,如果存在则不执行登录,
  //如果存在cookie但是请求仍然失败,则需要自动执行登录操作,然后再执行请求操作
  getCookie(c_name) {
    if (document.cookie.length > 0) {
      var c_start = document.cookie.indexOf(c_name + "=")
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        var c_end = document.cookie.indexOf(";", c_start)
        if (c_end == -1) c_end = document.cookie.length
        return decodeURI(document.cookie.substring(c_start, c_end)); //unescape取消
      }
    }
    return ""
  }

  getKDMLinkDefaultToken() {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/rest/v1/users',
      method: 'GET',
      withCredentials: true
    });
  }

  buildSourceParam(options) {
    options.kdmUrl = this.kdmUrl;
    return options;
  }
}