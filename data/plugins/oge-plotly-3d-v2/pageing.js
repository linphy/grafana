'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie', 'vendor/plotly/plotly-latest.min.js'], function (_export, _context) {
	"use strict";

	var _, $, Plotly;

	function link(scope, elem, attrs, ctrl) {
		ctrl.events.on('render', function () {
			//ctrl.source = updateData();

			if (ctrl.zData.length == 0) {
				return;
			}

			if (ctrl.dataModel == 2) {
				draw2D();
			} else {
				draw3D();
				drawRightCut();
			}
		});

		function draw2D() {
			var elem3D = elem.find('.plotly_3D');
			elem3D.html("");
			var width = elem3D[0].offsetWidth;

			var plotCanvas = $("<div id='plotly_2D_child' height='" + ctrl.height + "'></div>");
			elem3D.html(plotCanvas);

			var data = [{
				x: ctrl.xData,
				y: ctrl.source,
				mode: 'lines+markers',
				type: 'scatter'
			}];

			var layout = {
				xaxis: {
					title: ctrl.xyz.xName
				},
				yaxis: {
					title: ctrl.xyz.yName
				},
				autosize: false,
				width: width,
				height: ctrl.height,
				plot_bgcolor: "rgb(31,29,29)",
				paper_bgcolor: "rgb(31,29,29)",
				font: {
					color: "#FFFFFF"
				},
				margin: {
					l: 35,
					r: 35,
					b: 35,
					t: 35 //20
				}
			};
			Plotly.newPlot('plotly_2D_child', data, layout);
		}

		function drawRightCut() {

			if (ctrl.panel.showCut == 1) {
				var ids = initRight();
				drawRight(0, ids[0]);
				drawRight(1, ids[1]);
			}
		}

		function initRight() {
			var ids = [];
			//切面
			var elem3D = elem.find('.plotly_3D_detail');
			elem3D.html("");

			if (!ctrl.panel.showCut == 1) {
				return;
			}

			var tempHeight = (ctrl.height - 50) / 2; //3个显示高度
			for (var i = 0; i < 2; i++) {
				ids[i] = "plotly_" + getRandomId();
				var html = "<div id='" + ids[i] + "' style='width:360px; height:" + tempHeight + "px;'></div>";
				html += "<div style='display:table-row;'>";
				html += ctrl.tags[i] + " = <span style='color:red'>" + ctrl.tagsValues[i] + "</span>";
				html += "</div>";
				elem3D.append(html);
			}
			return ids;
		}

		function drawRight(rightIndex, divId) {
			var tempXData = [];
			var tempYData = [];

			var layout = {
				margin: {
					t: 15,
					b: 50,
					l: 55,
					r: 15
				},
				xaxis: {
					title: 'x-axis title'
				},
				yaxis: {
					title: 'y-axis title'
				},
				plot_bgcolor: "rgb(31,29,29)",
				paper_bgcolor: "rgb(31,29,29)",
				font: {
					color: "#FFFFFF"
				},
				showlegend: false
			};

			var args = ctrl.modeData.d3Args;
			var length = args.steplength;
			if (rightIndex == 0) {
				//水头
				var step = (args.xmax - args.xmin) / length;
				var index = (ctrl.tagsValues[0] - args.xmin) / step;
				index = parseInt(index + "");

				tempXData = ctrl.yData[index];
				tempYData = ctrl.zData[index];
				layout.xaxis.title = ctrl.tags[1];
				layout.yaxis.title = ctrl.tags[2];
			} else if (rightIndex == 1) {
				var step = (args.ymax - args.ymin) / length;
				var index = (ctrl.tagsValues[1] - args.ymin) / step;
				index = parseInt(index + "");

				for (var i = 0; i < ctrl.xData.length; i++) {
					tempXData.push(ctrl.xData[i][index]);
				}
				tempYData = ctrl.zData[index];
				layout.xaxis.title = ctrl.tags[0];
				layout.yaxis.title = ctrl.tags[2];
			}

			var data = {
				x: tempXData,
				y: tempYData,
				mode: 'lines+markers',
				type: 'scatter'
			};
			Plotly.newPlot(divId, [data], layout);
		}

		function getRandomId() {
			var ids = "";
			for (var i = 0; i < 6; i++) {
				ids += Math.floor(Math.random() * 10);
			}
			return ids;
		}

		function draw3D() {
			var elemDiv = elem.find('.plotly_div');
			var width = elemDiv[0].offsetWidth;
			if (ctrl.panel.showCut == 1) {
				width = width - 370;
			}

			var elem3D = elem.find('.plotly_3D');
			elem3D.html("");
			elem3D.css("width", width + "px");

			var plotChildId = "plotly_3D_child_" + getRandomId();
			ctrl.plotChildId = plotChildId;
			var plotCanvas = $("<div id='" + plotChildId + "' height='" + ctrl.height + "'></div>");
			elem3D.html(plotCanvas);
			var data;
			var boolOne = isNaN(ctrl.modeData.x) || isNaN(ctrl.modeData.y) || isNaN(ctrl.modeData.z);
			if (ctrl.modeData.x === undefined || ctrl.modeData.y === undefined || ctrl.modeData.z === undefined || boolOne) {
				var data = [{
					name: '模型数据',
					type: 'surface', //mesh3d、surface
					x: ctrl.xData,
					y: ctrl.yData,
					z: ctrl.zData, //zData 21*21, source 441
					showscale: ctrl.panel.showscale == 1
				}];
			} else {
				data = [{
					name: '模型数据',
					type: 'surface', //mesh3d、surface
					x: ctrl.xData,
					y: ctrl.yData,
					z: ctrl.zData, //zData 21*21, source 441
					showscale: ctrl.panel.showscale == 1
				}, {
					name: '最新数据',
					x: [ctrl.modeData.x.toFixed(2)],
					y: [ctrl.modeData.y.toFixed(2)],
					z: [ctrl.modeData.z.toFixed(2)],
					mode: 'markers',
					type: 'scatter3d',
					marker: {
						color: 'yellow',
						size: 3
					}
				}];
			}

			var layout = {
				scene: {
					xaxis: {
						title: ctrl.tags[0]
					},
					yaxis: {
						title: ctrl.tags[1]
					},
					zaxis: {
						title: ctrl.tags[2]
					},
					aspectmode: "cube"
				},
				autosize: false,
				width: width,
				height: ctrl.height,
				plot_bgcolor: "rgb(31,29,29)",
				paper_bgcolor: "rgb(31,29,29)",
				font: {
					color: "#FFFFFF"
				},
				margin: {
					l: 25,
					r: 25,
					b: 25,
					t: 35 //20
				}
			};
			Plotly.newPlot(plotChildId, data, layout);

			//鼠标事件
			var myPlot = plotCanvas[0];
			myPlot.on('plotly_click', function (data) {
				for (var i = 0; i < data.points.length; i++) {
					ctrl.tagsValues = [data.points[i].x, data.points[i].y, data.points[i].z];
				}

				if (data.points.length > 0) {
					drawRightCut();
				}
			});
		}
	}

	_export('default', link);

	return {
		setters: [function (_lodash) {
			_ = _lodash.default;
		}, function (_jquery) {
			$ = _jquery.default;
		}, function (_jqueryFlot) {}, function (_jqueryFlotPie) {}, function (_vendorPlotlyPlotlyLatestMinJs) {
			Plotly = _vendorPlotlyPlotlyLatestMinJs.default;
		}],
		execute: function () {}
	};
});
//# sourceMappingURL=pageing.js.map
