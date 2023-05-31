'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie', 'vendor/echarts/echarts.min.js'], function (_export, _context) {
	"use strict";

	var _, $, echarts;

	function link(scope, elem, attrs, ctrl) {

		var data = [{ name: '向家坝', value: 190, alarmCode: 0, kks: "EB001" }, { name: '拉拉山', value: 101.9, alarmCode: 1, kks: "EB002" }, { name: '景洪', value: 102.6, alarmCode: -1, kks: "EB003" }, { name: '青居', value: 150.6, alarmCode: 2, kks: "EB004" }, { name: '小天都', value: 150.6, alarmCode: 3, kks: "EB005" }];

		var geoCoordMap = {
			'向家坝': [104.4171, 28.6475],
			'拉拉山': [99.1244, 30.0122],
			'景洪': [100.8393, 22.0119],
			'青居': [106.1099, 30.6827],
			'小天都': [102.1785, 30.0778]
		};

		var convertData = function convertData(data) {
			var res = [];
			for (var i = 0; i < data.length; i++) {
				var geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						kks: data[i].kks,
						value: geoCoord.concat(data[i].value)
						//value: [data[i].value, 0]
					});
				}
			}
			return res;
		};

		function getAlarmData(data, alarmCode) {
			var res = [];
			for (var i = 0; i < data.length; i++) {
				if (data[i].alarmCode == alarmCode) {
					res.push(data[i]);
				}
			}
			return res;
		};

		var eoption = {
			//backgroundColor: '#141414',
			title: {
				padding: [20, 10],
				text: '水电智能运维平台',
				left: 'center',
				textStyle: {
					color: '#fff',
					fontSize: 35
				},
				show: false
			},
			tooltip: {
				trigger: 'item',
				formatter: function formatter(params, ticket, callback) {
					return '发电量：' + params.value[2] + " MW";
				}
			},
			legend: {
				orient: 'horizontal',
				y: 'bottom',
				x: 'left',
				data: ['pm2.5'],
				textStyle: {
					color: '#fff'
				}
			},
			geo: {
				map: 'china',
				label: {
					normal: {
						show: true
					},
					emphasis: {
						show: true
					}
				},
				roam: true,
				itemStyle: {
					normal: {
						areaColor: '#323c48',
						borderColor: '#111'
					},
					emphasis: {
						areaColor: '#2a333d'
					}
				}
			},
			series: [{
				name: '发电量',
				type: 'scatter',
				coordinateSystem: 'geo',
				data: convertData(getAlarmData(data, -1)),
				symbolSize: function symbolSize(val) {
					return val[0] / 10;
				},
				label: {
					normal: {
						formatter: '{b}',
						position: 'right',
						show: true
					},
					emphasis: {
						show: true
					}
				},
				itemStyle: {
					normal: {
						color: '#ddb926'
					}
				}
			}]
		};

		function registerMap() {
			$.ajax({
				type: 'GET',
				url: 'public/vendor/echarts/china.json',
				dataType: 'json',
				async: false,
				success: function success(chinaJson) {
					echarts.registerMap('china', chinaJson);
				}
			});
		}

		ctrl.events.on('render', function () {
			registerMap();

			var nameArr = ["优秀", "合格", "报警", "危险"];
			var colorArr = ["rgba(0, 255, 0, 0.7)", "rgba(0, 170, 0, 0.7)", "rgba(255, 255, 0, 0.7)", "rgba(255, 0, 0, 0.7)"];
			for (var i = 0; i <= 3; i++) {
				var effectScatter = {
					name: nameArr[i],
					type: 'effectScatter',
					coordinateSystem: 'geo',
					data: convertData(getAlarmData(data, i)),
					symbolSize: function symbolSize(val) {
						return val[0] / 10;
					},
					showEffectOn: 'render',
					rippleEffect: {
						brushType: 'stroke'
					},
					hoverAnimation: true,
					label: {
						normal: {
							formatter: '{b}',
							position: 'right',
							show: true,
							textStyle: {
								fontSize: 15
							}
						}
					},
					itemStyle: {
						normal: {
							color: colorArr[i],
							shadowBlur: 10,
							shadowColor: '#333'
						}
					},
					zlevel: 1
				};
				eoption.series.push(effectScatter);
			}
			eoption.legend.data = nameArr;

			var div = elem.find('.echarts_main');
			var myChart = echarts.init(div[0]);
			myChart.setOption(eoption);

			myChart.on('click', function (params) {
				if (params.seriesType && params.seriesType == "effectScatter") {
					console.log(params.data.kks);
					//跳转主接线图页面：可以根据机组寻找路径，然后再弹出
					window.open("http://www.baidu.com?var-kks=" + params.data.kks);
				}
			});
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
