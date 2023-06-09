import _ from 'lodash';
import config from 'app/core/config';
import locationUtil from 'app/core/utils/location_util';

export class DashboardImportCtrl {
  navModel: any;
  step: number;
  jsonText: string;
  parseError: string;
  nameExists: boolean;
  uidExists: boolean;
  dash: any;
  inputs: any[];
  inputsValid: boolean;
  gnetUrl: string;
  gnetError: string;
  gnetInfo: any;
  titleTouched: boolean;
  hasNameValidationError: boolean;
  nameValidationError: any;
  hasUidValidationError: boolean;
  uidValidationError: any;
  autoGenerateUid: boolean;
  autoGenerateUidValue: string;
  folderId: number;
  initialFolderTitle: string;
  isValidFolderSelection: boolean;

  /** @ngInject */
  constructor(private backendSrv, private validationSrv, navModelSrv, private $location, $routeParams) {
    this.navModel = navModelSrv.getNav('create', 'import');

    this.step = 1;
    this.nameExists = false;
    this.uidExists = false;
    this.autoGenerateUid = true;
    this.autoGenerateUidValue = 'auto-generated';
    this.folderId = $routeParams.folderId ? Number($routeParams.folderId) || 0 : null;
    this.initialFolderTitle = '选择一个文件夹';

    // check gnetId in url
    if ($routeParams.gnetId) {
      this.gnetUrl = $routeParams.gnetId;
      this.checkGnetDashboard();
    }
  }

  onUpload(dash) {
    this.dash = dash;
    this.dash.id = null;
    this.step = 2;
    this.inputs = [];

    if (this.dash.__inputs) {
      for (const input of this.dash.__inputs) {
        const inputModel = {
          name: input.name,
          label: input.label,
          info: input.description,
          value: input.value,
          type: input.type,
          pluginId: input.pluginId,
          options: [],
        };

        if (input.type === 'datasource') {
          this.setDatasourceOptions(input, inputModel);
        } else if (!inputModel.info) {
          inputModel.info = '指定一个字符串常量';
        }

        this.inputs.push(inputModel);
      }
    }

    this.inputsValid = this.inputs.length === 0;
    this.titleChanged();
    this.uidChanged(true);
  }

  setDatasourceOptions(input, inputModel) {
    const sources = _.filter(config.datasources, val => {
      return val.type === input.pluginId;
    });

    if (sources.length === 0) {
      inputModel.info = '无 ' + input.pluginName + ' 类型的数据源发现';
    } else if (!inputModel.info) {
      inputModel.info = '选择一个 ' + input.pluginName + ' 数据源';
    }

    inputModel.options = sources.map(val => {
      return { text: val.name, value: val.name };
    });
  }

  inputValueChanged() {
    this.inputsValid = true;
    for (const input of this.inputs) {
      if (!input.value) {
        this.inputsValid = false;
      }
    }
  }

  titleChanged() {
    this.titleTouched = true;
    this.nameExists = false;

    this.validationSrv
      .validateNewDashboardName(this.folderId, this.dash.title)
      .then(() => {
        this.nameExists = false;
        this.hasNameValidationError = false;
      })
      .catch(err => {
        if (err.type === 'EXISTING') {
          this.nameExists = true;
        }

        this.hasNameValidationError = true;
        this.nameValidationError = err.message;
      });
  }

  uidChanged(initial) {
    this.uidExists = false;
    this.hasUidValidationError = false;

    if (initial === true && this.dash.uid) {
      this.autoGenerateUidValue = 'value set';
    }

    this.backendSrv
      .getDashboardByUid(this.dash.uid)
      .then(res => {
        this.uidExists = true;
        this.hasUidValidationError = true;
        this.uidValidationError = `在文件夹'${res.meta.folderTitle}'中，已经有相同uid的仪表盘 '${res.dashboard.title}'`;
      })
      .catch(err => {
        err.isHandled = true;
      });
  }

  onFolderChange(folder) {
    this.folderId = folder.id;
    this.titleChanged();
  }

  onEnterFolderCreation() {
    this.inputsValid = false;
  }

  onExitFolderCreation() {
    this.inputValueChanged();
  }

  isValid() {
    return this.inputsValid && this.folderId !== null;
  }

  saveDashboard() {
    const inputs = this.inputs.map(input => {
      return {
        name: input.name,
        type: input.type,
        pluginId: input.pluginId,
        value: input.value,
      };
    });

    return this.backendSrv
      .post('api/dashboards/import', {
        dashboard: this.dash,
        overwrite: true,
        inputs: inputs,
        folderId: this.folderId,
      })
      .then(res => {
        const dashUrl = locationUtil.stripBaseFromUrl(res.importedUrl);
        this.$location.url(dashUrl);
      });
  }

  loadJsonText() {
    try {
      this.parseError = '';
      const dash = JSON.parse(this.jsonText);
      this.onUpload(dash);
    } catch (err) {
      console.log(err);
      this.parseError = err.message;
      return;
    }
  }

  checkGnetDashboard() {
    this.gnetError = '';

    const match = /(^\d+$)|dashboards\/(\d+)/.exec(this.gnetUrl);
    let dashboardId;

    if (match && match[1]) {
      dashboardId = match[1];
    } else if (match && match[2]) {
      dashboardId = match[2];
    } else {
      this.gnetError = '无法发现仪表盘';
    }

    return this.backendSrv
      .get('api/gnet/dashboards/' + dashboardId)
      .then(res => {
        this.gnetInfo = res;
        // store reference to grafana.com
        res.json.gnetId = res.id;
        this.onUpload(res.json);
      })
      .catch(err => {
        err.isHandled = true;
        this.gnetError = err.data.message || err;
      });
  }

  back() {
    this.gnetUrl = '';
    this.step = 1;
    this.gnetError = '';
    this.gnetInfo = '';
  }
}
