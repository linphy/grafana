'use strict';

System.register(['angular', 'app/core/utils/kbn', 'jquery', 'jquery.flot', 'jquery.flot.time'], function (_export, _context) {
  "use strict";

  var angular, kbn, $;
  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_jqueryFlot) {}, function (_jqueryFlotTime) {}],
    execute: function () {
      //import _ from  'lodash';
      angular.module('grafana.directives').directive('piechartLegend', function (popoverSrv, $timeout) {
        return {
          link: function link(scope, elem) {
            var $container = $('<section class="graph-legend"></section>');
            var firstRender = true;
            var ctrl = scope.ctrl;
            var panel = ctrl.panel;
            var data;
            var seriesList;
            var i;

            ctrl.events.on('render', function () {
              data = ctrl.series;
              if (data) {
                for (var i in data) {
                  data[i].color = ctrl.data[i].color;
                }
                render();
              }
            });

            function getSeriesIndexForElement(el) {
              return el.parents('[data-series-index]').data('series-index');
            }

            function toggleSeries(e) {
              var el = $(e.currentTarget);
              var index = getSeriesIndexForElement(el);
              var seriesInfo = seriesList[index];
              ctrl.toggleSeries(seriesInfo, e);
            }

            function sortLegend(e) {
              var el = $(e.currentTarget);
              var stat = el.data('stat');

              if (stat !== panel.legend.sort) {
                panel.legend.sortDesc = null;
              }

              // if already sort ascending, disable sorting
              if (panel.legend.sortDesc === false) {
                panel.legend.sort = null;
                panel.legend.sortDesc = null;
                render();
                return;
              }

              panel.legend.sortDesc = !panel.legend.sortDesc;
              panel.legend.sort = stat;
              render();
            }

            function openColorSelector(e) {
              // if we clicked inside poup container ignore click
              if ($(e.target).parents('.popover').length) {
                return;
              }

              var el = $(e.currentTarget).find('.fa-minus');
              var index = getSeriesIndexForElement(el);
              var series = seriesList[index];

              $timeout(function () {
                popoverSrv.show({
                  element: el[0],
                  position: 'bottom center',
                  template: '<gf-color-picker></gf-color-picker>',
                  openOn: 'hover',
                  model: {
                    autoClose: true,
                    series: series,
                    toggleAxis: function toggleAxis() {},
                    colorSelected: function colorSelected(color) {
                      ctrl.changeSeriesColor(series, color);
                    }
                  }
                });
              });
            }

            function render() {
              if (panel.legendType === 'On graph') {
                $container.empty();
                return;
              }

              if (firstRender) {
                elem.append($container);
                $container.on('click', '.graph-legend-icon', openColorSelector);
                $container.on('click', 'th', sortLegend);
                firstRender = false;
              }

              seriesList = data;

              $container.empty();

              var showValues = panel.legend.values || panel.legend.percentage;
              var tableLayout = (panel.legendType === 'Under graph' || panel.legendType === 'Right side') && showValues;

              $container.toggleClass('graph-legend-table', tableLayout);

              if (tableLayout) {
                var header = '<tr><th colspan="2" style="text-align:left"></th>';
                if (panel.legend.values) {
                  header += '<th class="pointer">值</th>';
                }
                if (panel.legend.percentage) {
                  header += '<th class="pointer">百分比</th>';
                }
                header += '</tr>';
                $container.append($(header));
              }

              if (panel.legend.sort) {
                seriesList = _.sortBy(seriesList, function (series) {
                  return series.stats[panel.legend.sort];
                });
                if (panel.legend.sortDesc) {
                  seriesList = seriesList.reverse();
                }
              }

              if (panel.legend.percentage) {
                var total = 0;
                for (i = 0; i < seriesList.length; i++) {
                  total += seriesList[i].stats[ctrl.panel.valueName];
                }
              }

              for (i = 0; i < seriesList.length; i++) {
                var series = seriesList[i];

                // ignore empty series
                if (panel.legend.hideEmpty && series.allIsNull) {
                  continue;
                }
                // ignore series excluded via override
                if (!series.legend) {
                  continue;
                }

                var html = '<div class="graph-legend-series';
                html += '" data-series-index="' + i + '">';
                html += '<span class="graph-legend-icon" style="float:none;">';
                html += '<i class="fa fa-minus pointer" style="color:' + series.color + '"></i>';
                html += '</span>';

                html += '<span class="graph-legend-alias" style="float:none;">';
                html += '<a>' + series.label + '</a>';
                html += '</span>';

                if (showValues && tableLayout) {
                  //var value = series.formatValue(series.stats[ctrl.panel.valueName]);
                  var value = series.stats[ctrl.panel.valueName];
                  if (panel.legend.values) {
                    html += '<div class="graph-legend-value">' + ctrl.formatValue(value) + '</div>';
                  }
                  if (total) {
                    var pvalue = (value / total * 100).toFixed(2) + '%';
                    html += '<div class="graph-legend-value">' + pvalue + '</div>';
                  }
                }

                html += '</div>';
                $container.append($(html));
              }
            }
          }
        };
      });
    }
  };
});
//# sourceMappingURL=legend.js.map
