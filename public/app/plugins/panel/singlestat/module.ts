import _ from 'lodash';
import $ from 'jquery';
import 'vendor/flot/jquery.flot';
import 'vendor/flot/jquery.flot.gauge';
import 'app/features/dashboard/panellinks/link_srv';

import kbn from 'app/core/utils/kbn';
import config from 'app/core/config';
import TimeSeries from 'app/core/time_series2';
import { OgeAlertMetricsPanelCtrl } from 'app/plugins/sdk';

class SingleStatCtrl extends OgeAlertMetricsPanelCtrl {
  static templateUrl = 'module.html';

  dataType = 'timeseries';
  series: any[];
  data: any;
  fontSizes: any[];
  unitFormats: any[];
  invalidGaugeRange: boolean;
  panel: any;
  events: any;

  valueNameOptions: any[] = [
    { value: 'min', text: 'Min' },
    { value: 'max', text: 'Max' },
    { value: 'avg', text: 'Average' },
    { value: 'current', text: 'Current' },
    { value: 'total', text: 'Total' },
    { value: 'name', text: 'Name' },
    { value: 'first', text: 'First' },
    { value: 'delta', text: 'Delta' },
    { value: 'diff', text: 'Difference' },
    { value: 'range', text: 'Range' },
    { value: 'last_time', text: 'Time of last point' },
  ];
  tableColumnOptions: any;

  // Set and populate defaults
  panelDefaults = {
    links: [],
    datasource: null,
    maxDataPoints: 100,
    interval: null,
    targets: [{}],
    cacheTimeout: null,
    format: 'none',
    prefix: '',
    postfix: '',
    nullText: null,
    valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
    mappingTypes: [{ name: 'value to text', value: 1 }, { name: 'range to text', value: 2 }],
    rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
    mappingType: 1,
    tipType: 1,
    tipTypes: [{ name: '静态文本', value: 1 }, { name: '动态提示', value: 2 }],
    kksTips: [],
    textTips: '',
    tipText: [],
    nullPointMode: 'connected',
    valueName: 'avg',
    prefixFontSize: '50%',
    valueFontSize: '80%',
    postfixFontSize: '50%',
    thresholds: '',
    colorBackground: false,
    colorValue: false,
    colors: ['#299c46', 'rgba(237, 129, 40, 0.89)', '#d44a3a'],
    sparkline: {
      show: false,
      full: false,
      lineColor: 'rgb(31, 120, 193)',
      fillColor: 'rgba(31, 118, 189, 0.18)',
    },
    gauge: {
      show: false,
      minValue: 0,
      maxValue: 100,
      thresholdMarkers: true,
      thresholdLabels: false,
    },
    tableColumn: '',
    alertPlayTimer: null,
  };

  /** @ngInject */
  constructor($scope, $injector, private linkSrv, private $sanitize) {
    super($scope, $injector, { showCover: true });
    _.defaults(this.panel, this.panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-teardown', this.destoryData.bind(this));

    this.onSparklineColorChange = this.onSparklineColorChange.bind(this);
    this.onSparklineFillChange = this.onSparklineFillChange.bind(this);
  }

  onInitEditMode() {
    this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
    this.addEditorTab('Options', 'public/app/plugins/panel/singlestat/editor.html', 2);
    this.addEditorTab('Value Mappings', 'public/app/plugins/panel/singlestat/mappings.html', 3);
    this.addEditorTab('Config Tips', 'public/app/plugins/panel/singlestat/tips.html', 4);
    this.unitFormats = kbn.getUnitFormats();
  }

  setUnitFormat(subItem) {
    this.panel.format = subItem.value;
    this.refresh();
  }

  destoryData() {
    if (this.panel.alertPlayTimer) {
      clearInterval(this.panel.alertPlayTimer);
    }
  }

  onDataError(err) {
    this.onDataReceived([]);
  }

  onDataReceived(dataList) {
    const data: any = {
      scopedVars: _.extend({}, this.panel.scopedVars),
    };
    //处理告警
    data.alert = {};
    if (dataList !== null && dataList.length > 0 && dataList[0].alarm !== undefined) {
      data.alert = dataList[0].alarm;
    }
    if (dataList.length > 0 && dataList[0].type === 'table') {
      this.dataType = 'table';
      const tableData = dataList.map(this.tableHandler.bind(this));
      this.setTableValues(tableData, data);
    } else {
      this.dataType = 'timeseries';
      this.series = dataList.map(this.seriesHandler.bind(this));
      this.setValues(data);
    }

    this.data = data;

    this.render();
  }

  seriesHandler(seriesData) {
    const series = new TimeSeries({
      datapoints: seriesData.datapoints || [],
      alias: seriesData.target,
    });

    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    return series;
  }

  tableHandler(tableData) {
    const datapoints = [];
    const columnNames = {};

    tableData.columns.forEach((column, columnIndex) => {
      columnNames[columnIndex] = column.text;
    });

    this.tableColumnOptions = columnNames;
    if (!_.find(tableData.columns, ['text', this.panel.tableColumn])) {
      this.setTableColumnToSensibleDefault(tableData);
    }

    tableData.rows.forEach(row => {
      const datapoint = {};

      row.forEach((value, columnIndex) => {
        const key = columnNames[columnIndex];
        datapoint[key] = value;
      });

      datapoints.push(datapoint);
    });

    return datapoints;
  }

  setTableColumnToSensibleDefault(tableData) {
    if (tableData.columns.length === 1) {
      this.panel.tableColumn = tableData.columns[0].text;
    } else {
      this.panel.tableColumn = _.find(tableData.columns, col => {
        return col.type !== 'time';
      }).text;
    }
  }

  setTableValues(tableData, data) {
    if (!tableData || tableData.length === 0) {
      return;
    }

    if (tableData[0].length === 0 || tableData[0][0][this.panel.tableColumn] === undefined) {
      return;
    }

    const datapoint = tableData[0][0];
    data.value = datapoint[this.panel.tableColumn];

    if (_.isString(data.value)) {
      data.valueFormatted = _.escape(data.value);
      data.value = 0;
      data.valueRounded = 0;
    } else {
      const decimalInfo = this.getDecimalsForValue(data.value);
      const formatFunc = kbn.valueFormats[this.panel.format];
      data.valueFormatted = formatFunc(
        datapoint[this.panel.tableColumn],
        decimalInfo.decimals,
        decimalInfo.scaledDecimals
      );
      data.valueRounded = kbn.roundValue(data.value, this.panel.decimals || 0);
    }

    this.setValueMapping(data);
  }

  canModifyText() {
    return !this.panel.gauge.show;
  }

  setColoring(options) {
    if (options.background) {
      this.panel.colorValue = false;
      this.panel.colors = ['rgba(71, 212, 59, 0.4)', 'rgba(245, 150, 40, 0.73)', 'rgba(225, 40, 40, 0.59)'];
    } else {
      this.panel.colorBackground = false;
      this.panel.colors = ['rgba(50, 172, 45, 0.97)', 'rgba(237, 129, 40, 0.89)', 'rgba(245, 54, 54, 0.9)'];
    }
    this.render();
  }

  invertColorOrder() {
    const tmp = this.panel.colors[0];
    this.panel.colors[0] = this.panel.colors[2];
    this.panel.colors[2] = tmp;
    this.render();
  }

  onColorChange(panelColorIndex) {
    return color => {
      this.panel.colors[panelColorIndex] = color;
      this.render();
    };
  }

  onSparklineColorChange(newColor) {
    this.panel.sparkline.lineColor = newColor;
    this.render();
  }

  onSparklineFillChange(newColor) {
    this.panel.sparkline.fillColor = newColor;
    this.render();
  }

  getDecimalsForValue(value) {
    if (_.isNumber(this.panel.decimals)) {
      return { decimals: this.panel.decimals, scaledDecimals: null };
    }

    const delta = value / 2;
    let dec = -Math.floor(Math.log(delta) / Math.LN10);

    const magn = Math.pow(10, -dec);
    const norm = delta / magn; // norm is between 1.0 and 10.0
    let size;

    if (norm < 1.5) {
      size = 1;
    } else if (norm < 3) {
      size = 2;
      // special case for 2.5, requires an extra decimal
      if (norm > 2.25) {
        size = 2.5;
        ++dec;
      }
    } else if (norm < 7.5) {
      size = 5;
    } else {
      size = 10;
    }

    size *= magn;

    // reduce starting decimals if not needed
    if (Math.floor(value) === value) {
      dec = 0;
    }

    const result: any = {};
    result.decimals = Math.max(0, dec);
    result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

    return result;
  }

  setValues(data) {
    data.flotpairs = [];

    if (this.series.length > 1) {
      const error: any = new Error();
      error.message = 'Multiple Series Error';
      error.data =
        'Metric query returns ' +
        this.series.length +
        ' series. Single Stat Panel expects a single series.\n\nResponse:\n' +
        JSON.stringify(this.series);
      throw error;
    }

    if (this.series && this.series.length > 0) {
      const lastPoint = _.last(this.series[0].datapoints);
      const lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;

      if (this.panel.valueName === 'name') {
        data.value = 0;
        data.valueRounded = 0;
        data.valueFormatted = this.series[0].alias;
      } else if (_.isString(lastValue)) {
        data.value = 0;
        data.valueFormatted = _.escape(lastValue);
        data.valueRounded = 0;
      } else if (this.panel.valueName === 'last_time') {
        const formatFunc = kbn.valueFormats[this.panel.format];
        data.value = lastPoint[1];
        data.valueRounded = data.value;
        data.valueFormatted = formatFunc(data.value, this.dashboard.isTimezoneUtc());
      } else {
        data.value = this.series[0].stats[this.panel.valueName];
        data.flotpairs = this.series[0].flotpairs;

        const decimalInfo = this.getDecimalsForValue(data.value);
        const formatFunc = kbn.valueFormats[this.panel.format];
        data.valueFormatted = formatFunc(data.value, decimalInfo.decimals, decimalInfo.scaledDecimals);
        data.valueRounded = kbn.roundValue(data.value, decimalInfo.decimals);
      }

      if (data.alert.value !== undefined && data.alert.value != null) {
        const alertDecimalInfo = this.getDecimalsForValue(data.alert.value);
        const alertFormatFunc = kbn.valueFormats[this.panel.format];
        data.alert.value = alertFormatFunc(
          data.alert.value,
          alertDecimalInfo.decimals,
          alertDecimalInfo.scaledDecimals
        );
      }

      // Add $__name variable for using in prefix or postfix
      data.scopedVars['__name'] = { value: this.series[0].label };
    }
    this.setValueMapping(data);
  }

  //获取KDM数据
  getKDMData() {
    if (!this.panel.kdm || !this.datasource || this.datasource.type !== 'oge-kdm') {
      console.warn('此数据源仅支持kdm数据源查询');
      return;
    }
    let kksData = [];
    for (let i = 0; i < this.panel.kksTips.length; i++) {
      const kks = this.panel.kksTips[i].value;
      kksData.push(kks);
    }
    let postData;
    if (this.panel.kdm.dataType === 1) {
      //实时值
      postData = {
        method: 'getRTDataSnapshot',
        kksCodes: kksData.join(),
      };
    } else {
      //历史值 type === 2
      postData = {
        method: 'getRTDataHistory',
        kksCodes: kksData.join(),
        startTime: this.timeSrv.timeRange().from._d.getTime(),
        endTime: this.timeSrv.timeRange().to._d.getTime(),
        //resultType: 2 //点值
      };
    }

    let requestUrl = this.datasource.url + '/kdmService/rest/1.0/kksData';
    return $.ajax({
      type: 'POST',
      url: requestUrl,
      data: postData,
      dataType: 'json',
    });
  }

  ////获取KKM数据
  getKPIData() {
    if (!this.panel.kdm || !this.datasource || this.datasource.type !== 'oge-kkm') {
      console.warn('此数据源仅支持kkm数据源查询');
      return;
    }
    let kksData = [];
    for (let i = 0; i < this.panel.kksTips.length; i++) {
      const kks = this.panel.kksTips[i].value;
      kksData.push(kks);
    }
    let data;
    let url;
    if (this.panel.kdm.dataType === 1) {
      //实时值
      data = {
        _postkpis_last: {
          kpi_ids: kksData,
        },
      };
      url = '/services/kpi_datas/kpis/last';
    } else {
      //历史值 type === 2
      data = {
        _postkpis: {
          kpi_ids: kksData,
          start_time: this.timeSrv.timeRange().from._d.getTime(),
          end_time: this.timeSrv.timeRange().to._d.getTime(),
        },
      };
      url = '/services/kpi_datas/kpis';
    }
    return this.postRequest(url, data);
  }

  /**
   * 执行Post请求
   */
  postRequest(urlPath, data) {
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return this.datasource.backendSrv.datasourceRequest({
      url: this.datasource.url + urlPath,
      method: 'POST',
      headers: headers,
      data: data,
    });
  }

  setValueMapping(data) {
    // check value to text mappings if its enabled
    if (this.panel.mappingType === 1) {
      for (let i = 0; i < this.panel.valueMaps.length; i++) {
        const map = this.panel.valueMaps[i];
        // special null case
        if (map.value === 'null') {
          if (data.value === null || data.value === void 0) {
            data.valueFormatted = map.text;
            return;
          }
          continue;
        }

        // value/number to text mapping
        const value = parseFloat(map.value);
        if (value === data.valueRounded) {
          data.valueFormatted = map.text;
          return;
        }
      }
    } else if (this.panel.mappingType === 2) {
      for (let i = 0; i < this.panel.rangeMaps.length; i++) {
        const map = this.panel.rangeMaps[i];
        // special null case
        if (map.from === 'null' && map.to === 'null') {
          if (data.value === null || data.value === void 0) {
            data.valueFormatted = map.text;
            return;
          }
          continue;
        }

        // value/number to range mapping
        const from = parseFloat(map.from);
        const to = parseFloat(map.to);
        if (to >= data.valueRounded && from <= data.valueRounded) {
          data.valueFormatted = map.text;
          return;
        }
      }
    }

    if (data.value === null || data.value === void 0) {
      data.valueFormatted = 'no value';
    }
  }

  //数据分组
  groupKPIData(arr) {
    let map = {};
    let dest = [];
    for (let i = 0; i < arr.length; i++) {
      let kpiData = arr[i];
      if (!map[kpiData.kpi_id]) {
        dest.push({
          kpi_id: kpiData.kpi_id,
          data: [kpiData],
        });
        map[kpiData.kpi_id] = kpiData;
      } else {
        for (let j = 0; j < dest.length; j++) {
          let element = dest[j];
          if (element.kpi_id == kpiData.kpi_id) {
            element.data.push(kpiData);
            break;
          }
        }
      }
    }
    return dest;
  }

  //数据排序
  compare(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    };
  }

  removeKKSTip(tip) {
    const index = _.indexOf(this.panel.kksTips, tip);
    this.panel.kksTips.splice(index, 1);
    this.render();
  }

  addKKSTip() {
    this.panel.kksTips.push({ value: '', alias: '' });
  }

  removeTextTip() {
    // const index = _.indexOf(this.panel.textTips, tip);
    // this.panel.textTips.splice(index, 1);
    delete this.panel.textTips;
    this.panel.tipText = [];
    this.render();
  }

  removeValueMap(map) {
    const index = _.indexOf(this.panel.valueMaps, map);
    this.panel.valueMaps.splice(index, 1);
    this.render();
  }

  addValueMap() {
    this.panel.valueMaps.push({ value: '', op: '=', text: '' });
  }

  removeRangeMap(rangeMap) {
    const index = _.indexOf(this.panel.rangeMaps, rangeMap);
    this.panel.rangeMaps.splice(index, 1);
    this.render();
  }

  addRangeMap() {
    this.panel.rangeMaps.push({ from: '', to: '', text: '' });
  }

  link(scope, elem, attrs, ctrl) {
    const $location = this.$location;
    const linkSrv = this.linkSrv;
    const $timeout = this.$timeout;
    const $sanitize = this.$sanitize;
    const panel = ctrl.panel;
    const templateSrv = this.templateSrv;
    let data, linkInfo;
    let kksTipsInfo;
    const $panelContainer = elem.find('.panel-container');
    elem = elem.find('.singlestat-panel');

    function applyColoringThresholds(valueString) {
      const color = ctrl.getOgeColorForValue(data, data.value);
      //const color = getColorForValue(data, data.value);
      if (color) {
        return '<span style="color:' + color + '">' + valueString + '</span>';
      }

      return valueString;
    }

    function getSpan(className, fontSize, applyColoring, value) {
      value = $sanitize(templateSrv.replace(value, data.scopedVars));
      value = applyColoring ? applyColoringThresholds(value) : value;
      return '<span class="' + className + '" style="font-size:' + fontSize + '">' + value + '</span>';
    }

    function getBigValueHtml() {
      let body = '<div class="singlestat-panel-value-container" style="font-size:1.5rem;">'; // [OGE]

      if (panel.prefix) {
        body += getSpan('singlestat-panel-prefix', panel.prefixFontSize, panel.colorPrefix, panel.prefix);
      }

      // add by yh
      if (panel.ogeAlertEnabled && panel.ogeAlertNameCoverValue) {
        body += getSpan('singlestat-panel-value', panel.valueFontSize, panel.colorValue, data.alert.level + '');
      } else if (panel.ogeAlertEnabled && panel.ogeAlertValueCoverValue) {
        body += getSpan('singlestat-panel-value', panel.valueFontSize, panel.colorValue, data.alert.value);
      } else {
        body += getSpan('singlestat-panel-value', panel.valueFontSize, panel.colorValue, data.valueFormatted);
      }

      if (panel.postfix) {
        body += getSpan('singlestat-panel-postfix', panel.postfixFontSize, panel.colorPostfix, panel.postfix);
      }

      body += '</div>';

      return body;
    }

    function getValueText() {
      let result = panel.prefix ? templateSrv.replace(panel.prefix, data.scopedVars) : '';
      result += data.valueFormatted;
      result += panel.postfix ? templateSrv.replace(panel.postfix, data.scopedVars) : '';

      return result;
    }

    function addGauge() {
      const width = elem.width();
      const height = elem.height();
      // Allow to use a bit more space for wide gauges
      const dimension = Math.min(width, height * 1.3);

      ctrl.invalidGaugeRange = false;
      if (panel.gauge.minValue > panel.gauge.maxValue) {
        ctrl.invalidGaugeRange = true;
        return;
      }

      const plotCanvas = $('<div></div>');
      const plotCss = {
        top: '10px',
        margin: 'auto',
        position: 'relative',
        height: height * 0.9 + 'px',
        width: dimension + 'px',
      };

      plotCanvas.css(plotCss);

      const thresholds = [];
      for (let i = 0; i < data.thresholds.length; i++) {
        thresholds.push({
          value: data.thresholds[i],
          color: data.colorMap[i],
        });
      }
      thresholds.push({
        value: panel.gauge.maxValue,
        color: data.colorMap[data.colorMap.length - 1],
      });

      const bgColor = config.bootData.user.lightTheme ? 'rgb(230,230,230)' : 'rgb(38,38,38)';

      const fontScale = parseInt(panel.valueFontSize, 10) / 100;
      const fontSize = Math.min(dimension / 5, 100) * fontScale;
      // Reduce gauge width if threshold labels enabled
      const gaugeWidthReduceRatio = panel.gauge.thresholdLabels ? 1.5 : 1;
      const gaugeWidth = Math.min(dimension / 6, 60) / gaugeWidthReduceRatio;
      const thresholdMarkersWidth = gaugeWidth / 5;
      const thresholdLabelFontSize = fontSize / 2.5;

      const options = {
        series: {
          gauges: {
            gauge: {
              min: panel.gauge.minValue,
              max: panel.gauge.maxValue,
              background: { color: bgColor },
              border: { color: null },
              shadow: { show: false },
              width: gaugeWidth,
            },
            frame: { show: false },
            label: { show: false },
            layout: { margin: 0, thresholdWidth: 0 },
            cell: { border: { width: 0 } },
            threshold: {
              values: thresholds,
              label: {
                show: panel.gauge.thresholdLabels,
                margin: thresholdMarkersWidth + 1,
                font: { size: thresholdLabelFontSize },
              },
              show: panel.gauge.thresholdMarkers,
              width: thresholdMarkersWidth,
            },
            value: {
              color:
                (panel.ogeAlertEnabled && panel.ogeAlertColorType === 'V') ||
                (!panel.ogeAlertEnabled && panel.colorValue)
                  ? ctrl.getOgeColorForValue(data, data.valueRounded)
                  : null,
              formatter: () => {
                return getValueText();
              },
              font: {
                size: fontSize,
                family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              },
            },
            show: true,
          },
        },
      };

      elem.append(plotCanvas);

      const plotSeries = {
        data: [[0, data.value]],
      };

      $.plot(plotCanvas, [plotSeries], options);
    }

    function addSparkline() {
      const width = elem.width() + 20;
      if (width < 30) {
        // element has not gotten it's width yet
        // delay sparkline render
        setTimeout(addSparkline, 30);
        return;
      }

      const height = ctrl.height;
      const plotCanvas = $('<div></div>');
      const plotCss: any = {};
      plotCss.position = 'absolute';

      if (panel.sparkline.full) {
        plotCss.bottom = '5px';
        plotCss.left = '-5px';
        plotCss.width = width - 10 + 'px';
        const dynamicHeightMargin = height <= 100 ? 5 : Math.round(height / 100) * 15 + 5;
        plotCss.height = height - dynamicHeightMargin + 'px';
      } else {
        plotCss.bottom = '0px';
        plotCss.left = '-5px';
        plotCss.width = width - 10 + 'px';
        plotCss.height = Math.floor(height * 0.25) + 'px';
      }

      plotCanvas.css(plotCss);

      const options = {
        legend: { show: false },
        series: {
          lines: {
            show: true,
            fill: 1,
            zero: false,
            lineWidth: 1,
            fillColor: panel.sparkline.fillColor,
          },
        },
        yaxes: { show: false },
        xaxis: {
          show: false,
          mode: 'time',
          min: ctrl.range.from.valueOf(),
          max: ctrl.range.to.valueOf(),
        },
        grid: { hoverable: false, show: false },
      };

      elem.append(plotCanvas);

      const plotSeries = {
        data: data.flotpairs,
        color: panel.sparkline.lineColor,
      };

      $.plot(plotCanvas, [plotSeries], options);
    }

    function render() {
      if (!ctrl.data) {
        return;
      }
      data = ctrl.data;

      //add by yh
      if (panel.ogeAlertEnabled) {
        if (panel.ogeAlertColorType === 'B') {
          panel.colorBackground = true;
          panel.colorValue = false;
        } else if (panel.ogeAlertColorType === 'V') {
          panel.colorBackground = false;
          panel.colorValue = true;
        }
      }

      // get thresholds
      data.thresholds = panel.thresholds.split(',').map(strVale => {
        return Number(strVale.trim());
      });
      data.colorMap = panel.colors;
      const body = panel.gauge.show ? '' : getBigValueHtml();

      if (panel.colorBackground && !isNaN(data.value)) {
        const color = ctrl.getOgeColorForValue(data, data.value);
        if (color) {
          $panelContainer.css('background-color', color);
          if (scope.fullscreen) {
            elem.css('background-color', color);
          } else {
            elem.css('background-color', '');
          }
        }
      } else {
        $panelContainer.css('background-color', '');
        elem.css('background-color', '');
      }

      elem.html(body);

      if (panel.sparkline.show) {
        addSparkline();
      }

      if (panel.gauge.show) {
        addGauge();
      }

      elem.toggleClass('pointer', panel.links.length > 0);

      if (panel.links.length > 0) {
        linkInfo = linkSrv.getPanelLinkAnchorInfo(panel.links[0], data.scopedVars);
      } else {
        linkInfo = null;
      }

      if (panel.kksTips.length > 0) {
        kksTipsInfo = panel.kksTips;
      } else {
        kksTipsInfo = null;
      }

      if (panel.alertPlayTimer) {
        clearInterval(panel.alertPlayTimer);
      }
      if (panel.ogeAlertSound && data.alert.level === 3) {
        /*
        *控件打开后2秒执行一次，然后再根据条件再循环执行
        *解决chrome浏览器点击才能播放的设置：chrome://flags/#autoplay-policy =》 点击default，选择 Setting No user gesture is required =》 重启chrome
        */
        let audio = $panelContainer.find('.audio-obj');
        setTimeout(() => {
          playAlertLevelSound(audio);
        }, 2000);
        if (panel.timeInterval > 0) {
          setTimeout(() => {
            panel.alertPlayTimer = beginPlayAlert(audio);
          }, panel.timeInterval + 2000);
        }
      }
    }

    function beginPlayAlert(audio) {
      return setInterval(() => {
        playAlertLevelSound(audio);
      }, panel.timeInterval);
    }

    function playAlertLevelSound(audio) {
      if (audio && audio.get(0).paused) {
        audio
          .get(0)
          .play()
          .catch(function() {
            console.warn('paly warn, 请联系管理员设置chrome浏览器');
          });
      }
    }

    function hookupDrilldownLinkTooltip() {
      // drilldown link tooltip
      const drilldownTooltip = $('<div id="tooltip" class="">hello</div>"');

      //let tipText = [];

      elem.mouseleave(() => {
        ctrl.panel.tipText = [];
        $timeout(() => {
          drilldownTooltip.detach();
        });
      });

      elem.click(evt => {
        if (!linkInfo) {
          return;
        }

        // ignore title clicks in title
        if ($(evt).parents('.panel-header').length > 0) {
          return;
        }

        if (linkInfo.target === '_blank') {
          window.open(linkInfo.href, '_blank');
          return;
        }

        if (linkInfo.href.indexOf('http') === 0) {
          window.location.href = linkInfo.href;
        } else {
          $timeout(() => {
            $location.url(linkInfo.href);
          });
        }

        drilldownTooltip.detach();
      });

      elem.mouseenter(function(e) {
        ctrl.panel.tipText = [];
        //静态文本提示
        if (ctrl.panel.tipType === 1) {
          if (ctrl.panel.textTips === '' || ctrl.panel.textTips === undefined) {
            ctrl.panel.tipText = [];
          } else {
            const textItem = ctrl.panel.textTips;
            ctrl.panel.tipText.push(textItem);
          }
        } else if (ctrl.panel.tipType === 2) {
          //动态KKS提示
          //获取kdm数据
          if (ctrl.datasource.type === 'oge-kdm') {
            let promise = ctrl.getKDMData();
            if (!promise) {
              return;
            }
            promise
              .then(result => {
                if (result.BasicResponse.succeeded === 1) {
                  let kksValue;
                  for (let i = 0; i < kksTipsInfo.length; i++) {
                    //所有kks在数据源中都不存在，返回RTDataSets为空
                    if (result.RTDataSets.length === 0) {
                      kksValue = '--';
                      const textItem = kksTipsInfo[i].alias + ':' + kksValue;
                      ctrl.panel.tipText.push(textItem);
                    } else {
                      for (let j = 0; j < result.RTDataSets.length; j++) {
                        if (kksTipsInfo[i].value === result.RTDataSets[j].kksCode) {
                          //获取实时值，RTDataValues.length = 1；如果无值，则不返回RTDataValues
                          //获取历史值 ---目前获取最后一条，即使无值，仍返回RTDataValues，长度为0
                          //无值
                          if (!result.RTDataSets[j].RTDataValues || result.RTDataSets[j].RTDataValues.length === 0) {
                            kksValue = '--';
                          }
                          //历史值
                          if (result.RTDataSets[j].RTDataValues && result.RTDataSets[j].RTDataValues.length > 1) {
                            const dataSetLen = result.RTDataSets[j].RTDataValues.length;
                            kksValue = result.RTDataSets[j].RTDataValues[dataSetLen - 1].Value;
                          }
                          //实时值
                          if (result.RTDataSets[j].RTDataValues && result.RTDataSets[j].RTDataValues.length === 1) {
                            kksValue = result.RTDataSets[j].RTDataValues[0].Value;
                          }
                        } else {
                          //kks不存在
                          kksValue = '--';
                        }
                        const textItem = kksTipsInfo[i].alias + ':' + kksValue;
                        ctrl.panel.tipText.push(textItem);
                      }
                    }
                  }
                }
              })
              .catch(function(error) {
                console.log(error);
              });
            //获取kkm数据
          } else if (ctrl.datasource.type === 'oge-kkm') {
            let promise = ctrl.getKPIData();
            if (!promise) {
              return;
            }
            promise
              .then(result => {
                let kksValue;
                for (let i = 0; i < kksTipsInfo.length; i++) {
                  //获取实时值
                  if (result.config.data._postkpis_last) {
                    //全部无值
                    if (!result.data.kpi_datas.kpi) {
                      kksValue = '--';
                    } else {
                      // 有值
                      for (let j = 0; j < result.data.kpi_datas.kpi.length; j++) {
                        const kpiData = result.data.kpi_datas.kpi[j];
                        if (kksTipsInfo[i].value === kpiData.kpi_id) {
                          kksValue = kpiData.value;
                          break;
                        } else {
                          kksValue = '--';
                        }
                      }
                    }
                    //获取历史值
                  } else {
                    //全部无值
                    if (!result.data.kpi_datas.kpi) {
                      kksValue = '--';
                    } else {
                      //有值
                      for (let j = 0; j < result.data.kpi_datas.kpi.length; j++) {
                        //历史接口返回数据无序，需数据分组
                        const kpiArr = result.data.kpi_datas.kpi;
                        let groupData = ctrl.groupKPIData(kpiArr);
                        for (let k = 0; k < groupData.length; k++) {
                          const kpiDataBefore = groupData[k];
                          //根据时间字段排序
                          const kpiData = kpiDataBefore.data.sort(ctrl.compare('datetime'));
                          if (kksTipsInfo[i].value === groupData[k].kpi_id) {
                            let kpiDtaLen = kpiData.length;
                            kksValue = kpiData[kpiDtaLen - 1].value;
                            break;
                          } else {
                            kksValue = '--';
                          }
                        }
                      }
                    }
                  }
                  const textItem = kksTipsInfo[i].alias + ':' + kksValue;
                  ctrl.panel.tipText.push(textItem);
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        }
      });

      elem.mousemove(function(e) {
        if (ctrl.panel.tipText.length > 0) {
          drilldownTooltip.text(ctrl.panel.tipText.join());
          drilldownTooltip.place_tt(e.pageX, e.pageY - 50);
        }
      });
    }

    hookupDrilldownLinkTooltip();

    this.events.on('render', () => {
      render();
      ctrl.renderingCompleted();
    });
  }

  getOgeColorForValue(data, value) {
    return this.panel.ogeAlertEnabled ? this.getAlertLevelColor(this.data.alert.level) : getColorForValue(data, value);
  }
}

function getColorForValue(data, value) {
  if (!_.isFinite(value)) {
    return null;
  }

  for (let i = data.thresholds.length; i > 0; i--) {
    if (value >= data.thresholds[i - 1]) {
      return data.colorMap[i];
    }
  }

  return _.first(data.colorMap);
}

export { SingleStatCtrl, SingleStatCtrl as PanelCtrl, getColorForValue };
