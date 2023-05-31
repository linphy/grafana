'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie', 'vendor/echarts/echarts.min.js'], function (_export, _context) {
	"use strict";

	var _, $, echarts;

	function link(scope, elem, attrs, ctrl) {
		var pageCount = 0;
		//table高度
		function getTableHeight() {
			var panelHeight = ctrl.height;
			if (pageCount > 1) {
				panelHeight -= 26;
			}
			return panelHeight - 31 + 'px';
		}

		function showGauge(value, unit, alarmInfo) {
			//1、判断越大越危险(默认)，还是越小越危险
			var flag = true;
			if (alarmInfo[alarmInfo.length - 1].min < alarmInfo[0].min) {
				flag = false;
			}

			var minInput = alarmInfo[0].min;
			var maxInput = alarmInfo[alarmInfo.length - 1].min * 1.2; //max特别大，不可取

			if (!flag) {
				minInput = alarmInfo[alarmInfo.length - 1].min;
				maxInput = alarmInfo[0].min * 1.2;
			}

			var maxAndLength = maxInput - minInput; //所有数据

			var colorInfo = [];
			var param = 0;
			for (var i = 0; i < alarmInfo.length; i++) {
				if (flag) {
					param += (alarmInfo[i].max - alarmInfo[i].min) / maxAndLength;
					if (i == alarmInfo.length - 1) {
						param = 1;
					}
					colorInfo.push([param, ctrl.panel.alarmColor[i]]);
				} else {
					var index = alarmInfo.length - 1 - i;
					param += (alarmInfo[index].max - alarmInfo[index].min) / maxAndLength;
					if (i == alarmInfo.length - 1) {
						param = 1;
					}
					colorInfo.push([param, ctrl.panel.alarmColor[index]]);
				}
			}

			var option = {
				tooltip: {
					formatter: "{a} <br/>{c} {b}"
				},
				series: [{
					name: '',
					min: minInput,
					max: maxInput,
					startAngle: 180,
					endAngle: 0,
					radius: '90%',
					type: 'gauge',
					length: '80%',
					axisLine: {
						lineStyle: {
							color: colorInfo
						}
					},
					axisLabel: {
						formatter: function formatter(value) {
							var values = value + "";
							if (values.indexOf('.') == -1) {
								//没有小数点
								return value;
							}
							var length = values.split(".")[1].length; //有小数点，看本来有几位
							if (length >= 2) {
								return value.toFixed(2);
							}
							return value;
						}
					},
					splitNumber: alarmInfo.length * 2,
					detail: {
						formatter: '{value}',
						offsetCenter: [0, 20] // x, y，单位px
					},
					title: {
						textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
							fontWeight: 'bolder',
							fontSize: 20,
							fontStyle: 'italic',
							color: '#fff',
							shadowColor: '#fff', //默认透明
							shadowBlur: 10
						}
					},
					pointer: { // 分隔线
						width: 5,
						length: '60%'
					},
					data: [{ value: value, name: unit }]
				}]
			};

			var obj = elem.find('.singleGraph');
			obj.css("min-height", ctrl.height + 150 + "px");
			var myChart = echarts.init(obj[0]);
			myChart.setOption(option, true);
		}

		function getTimesByLongTime(time) {
			var myDate = new Date(time);
			var times = fullTime(myDate.getFullYear());
			times += "-" + fullTime(myDate.getMonth() + 1);
			times += "-" + fullTime(myDate.getDate());
			times += " " + fullTime(myDate.getHours());
			times += ":" + fullTime(myDate.getMinutes());
			times += ":" + fullTime(myDate.getSeconds());
			return times;
		}

		function fullTime(number) {
			if (number < 10) {
				return "0" + number;
			} else {
				return number;
			}
		}

		function fixData(value, precise) {
			if (value && precise && typeof value != "string") {
				value = value.toFixed(precise);
			}
			if (value == -9999) {
				value = "-";
			}
			return value;
		}

		ctrl.events.on('render', function () {
			if (!ctrl.data) {
				return;
			}

			if ("kpi" == ctrl.panel.mode) {
				//echart画仪表盘
				if (ctrl.data.time) {
					ctrl.data.times = getTimesByLongTime(ctrl.data.time);
				}
				ctrl.data.value = fixData(ctrl.data.value, ctrl.data.precise);
				var startTimes = getTimesByLongTime(ctrl.data.time - 86400 * 1000);
				ctrl.changeTime(startTimes, ctrl.data.times);
			} else if ("kpiGauge" == ctrl.panel.mode) {
				//echart画仪表盘
				var alarmInfo = ctrl.data.alarmInfo;
				ctrl.data.kpi.value = fixData(ctrl.data.kpi.value, ctrl.data.kpi.precise);
				showGauge(ctrl.data.kpi.value, ctrl.data.kpi.unit, alarmInfo);
			} else if ("relativeInfo" == ctrl.panel.mode) {
				var rootElem = elem.find('.table-panel-scroll'); //表格需要处理高度
				for (var i = 0; i < ctrl.data.length; i++) {
					ctrl.data[i].value = fixData(ctrl.data[i].value, ctrl.data[i].precise);
				}
				pageCount = ctrl.data.length;
				rootElem.css({ 'max-height': getTableHeight() });
			} else if ("kpiWebUrl" == ctrl.panel.mode) {
				//console.log(ctrl.data);
				ctrl.data.kdmUrl = encodeURI(ctrl.datasource.kdmUrl);
				ctrl.data.pluginUrl = encodeURI(ctrl.datasource.url);
			}
		});
	}

	_export('default', link);

	return {
		setters: [function (_lodash) {
			_ = _lodash.default;
		}, function (_jquery) {
			$ = _jquery.default;
		}, function (_jqueryFlot) {}, function (_jqueryFlotPie) {}, function (_vendorEchartsEchartsMinJs) {
			echarts = _vendorEchartsEchartsMinJs.default;
		}],
		execute: function () {}
	};
});
//# sourceMappingURL=pageing.js.map
