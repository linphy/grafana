'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie', 'vendor/echarts/echarts.min.js', 'vendor/plotly/plotly-latest.min.js'], function (_export, _context) {
	"use strict";

	var _, $, echarts, Plotly;

	function link(scope, elem, attrs, ctrl) {
		var layout = {
			margin: {
				t: 0,
				b: 0,
				l: 30,
				r: 0
			},
			plot_bgcolor: "rgb(31,29,29)",
			paper_bgcolor: "rgb(31,29,29)",
			font: {
				color: "#FFFFFF"
			},
			showlegend: true,
			legend: { "orientation": "h" }
		};

		var pageCount = 0;
		//table高度
		function getTableHeight() {
			var panelHeight = ctrl.height;
			if (pageCount > 1) {
				panelHeight -= 26;
			}
			return panelHeight - 31 + 'px';
		}

		function showGauge(value, unit) {
			var option = {
				tooltip: {
					formatter: "{a} <br/>{b} : {c}%"
				},
				series: [{
					name: '',
					min: 0,
					max: 400,
					startAngle: 180,
					endAngle: 0,
					type: 'gauge',
					axisLine: { // 坐标轴线
						lineStyle: { // 属性lineStyle控制线条样式
							color: [[0.25, ctrl.panel.alarmColor[0]], [0.5, ctrl.panel.alarmColor[1]], [0.75, ctrl.panel.alarmColor[2]], [1, ctrl.panel.alarmColor[3]]]
						}
					},
					splitNumber: 8,
					detail: { formatter: '{value}' },
					data: [{ value: value, name: unit }]
				}]
			};

			var obj = elem.find('.singleGraph');
			obj.css("min-height", ctrl.height + 150 + "px");
			var myChart = echarts.init(obj[0]);
			myChart.setOption(option, true);
		}

		function showRelativeTrend(kksInput, group) {
			var dataJson;
			$.ajax({
				type: 'GET',
				url: ctrl.datasource.url + "/das/getRelativeTrendData",
				dataType: 'json',
				async: false,
				data: { "kksCode": kksInput, "group": group },
				success: function success(result) {
					dataJson = result;
				}
			});
			Plotly.newPlot('plotly_relative' + group, dataJson, layout);
		}

		function showAlarmPie(kksInput) {
			var dataJson;
			$.ajax({
				type: 'GET',
				url: ctrl.datasource.url + "/das/getAlaremPieData",
				dataType: 'json',
				async: false,
				data: { "kksCode": kksInput },
				success: function success(result) {
					dataJson = result;
				}
			});
			var valueObj = [];
			for (var i = 0; i < dataJson.name.length; i++) {
				valueObj.push({ value: dataJson.value[i], name: dataJson.name[i] });
			}
			var option = {
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					x: 'left',
					data: dataJson.name,
					textStyle: {
						color: "white"
					}
				},
				series: [{
					name: '告警比例',
					type: 'pie',
					radius: ['50%', '70%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '30',
								fontWeight: 'bold'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: valueObj
				}]
			};
			var obj = elem.find('.alarmPie');
			var myChart = echarts.init(obj[0]);
			myChart.setOption(option, true);
		}

		function showKpiTrend(kksInput) {
			var dataJson;
			$.ajax({
				type: 'GET',
				url: ctrl.datasource.url + "/das/getKpiTrendData",
				dataType: 'json',
				async: false,
				data: { "kksCode": kksInput },
				success: function success(result) {
					dataJson = result;
				}
			});
			layout.showlegend = false;
			Plotly.newPlot('plotly_kpiTrend', [dataJson], layout);
		}

		ctrl.events.on('render', function () {
			var kksInput = "";
			if (ctrl.templateSrv.variables && ctrl.templateSrv.variables.length > 0) {
				kksInput = ctrl.templateSrv.variables[0].current.value;
			} else {
				console.warn("请设置模板参数kks，否则无法根据kks获取指标量");
				return;
			}

			if (!ctrl.datasource || !ctrl.datasource.url) {
				return;
			}

			//如果需要另外获取数据，直接走后台
			if ("relativeTrend1" == ctrl.panel.mode) {
				showRelativeTrend(kksInput, 1);
				return;
			} else if ("relativeTrend2" == ctrl.panel.mode) {
				showRelativeTrend(kksInput, 2);
				return;
			} else if ("alarmPie" == ctrl.panel.mode) {
				showAlarmPie(kksInput);
				return;
			} else if ("kpiTrend" == ctrl.panel.mode) {
				showKpiTrend(kksInput);
				return;
			}

			var dataJson;
			$.ajax({
				type: 'GET',
				url: ctrl.datasource.url + "/das/getDasJson",
				dataType: 'json',
				async: false,
				data: { "kksCode": kksInput },
				success: function success(result) {
					//console.info(result);
					dataJson = result;
				}
			});
			ctrl.panel.dataJson = dataJson;

			if ("kpi" == ctrl.panel.mode) {
				//echart画仪表盘
				var myDate = new Date(dataJson.kpi.time);
				var times = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
				ctrl.panel.dataJson.kpi.times = times;
			} else if ("kpiGauge" == ctrl.panel.mode) {
				//echart画仪表盘
				showGauge(dataJson.kpi.value, dataJson.kpi.unit);
			} else if ("relativeInfo1" == ctrl.panel.mode || "relativeInfo2" == ctrl.panel.mode) {
				//处理两个group的数据
				var relativeInfos = ctrl.panel.dataJson.relativeInfo;
				var relativeInfo1 = [];
				var relativeInfo2 = [];
				for (var i = 0; i < relativeInfos.length; i++) {
					if (relativeInfos[i].group == 1) {
						relativeInfo1.push(relativeInfos[i]);
					} else {
						relativeInfo2.push(relativeInfos[i]);
					}
				}

				ctrl.panel.dataJson.relativeInfo = relativeInfo1;
				if ("relativeInfo2" == ctrl.panel.mode) {
					ctrl.panel.dataJson.relativeInfo = relativeInfo2;
				}
				var rootElem = elem.find('.table-panel-scroll'); //表格需要处理高度
				pageCount = ctrl.panel.dataJson.relativeInfo;
				rootElem.css({ 'max-height': getTableHeight() });
			} else {
				//暂不处理
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
		}, function (_vendorPlotlyPlotlyLatestMinJs) {
			Plotly = _vendorPlotlyPlotlyLatestMinJs.default;
		}],
		execute: function () {}
	};
});
//# sourceMappingURL=pageing.js.map
