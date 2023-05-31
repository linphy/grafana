import angular from 'angular';
import _ from 'lodash';
import { iconMap } from './editor';
import * as fileExport from 'app/core/utils/file_export';

function dashLinksContainer() {
  return {
    scope: {
      links: '=',
      dashboard: '=',
    },
    restrict: 'E',
    controller: 'DashLinksContainerCtrl',
    template: '<dash-link ng-repeat="link in generatedLinks" link="link"></dash-link>',
    link: () => {},
  };
}

/** @ngInject */
function dashLink($compile, $sanitize, linkSrv) {
  return {
    restrict: 'E',
    link: (scope, elem) => {
      const link = scope.link;
      const dashboard = scope.dashboard;

      let template =
        '<div class="gf-form">' +
        '<a class="pointer gf-form-label" data-placement="bottom"' +
        (link.asDropdown ? ' ng-click="fillDropdown(link)" data-toggle="dropdown"' : '') +
        (link.asExport ? ' ng-click="exportTable(dashboard)"' : '') +
        '>' +
        '<i></i> <span></span></a>';

      if (link.asDropdown) {
        template +=
          '<ul class="dropdown-menu" role="menu">' +
          '<li ng-repeat="dash in link.searchHits">' +
          '<a href="{{dash.url}}" target="{{dash.target}}">{{dash.title}}</a>' +
          '</li>' +
          '</ul>';
      }

      template += '</div>';

      elem.html(template);
      $compile(elem.contents())(scope);

      function update() {
        const linkInfo = linkSrv.getAnchorInfo(link);

        const anchor = elem.find('a');
        const span = elem.find('span');
        span.text(linkInfo.title);

        if (!link.asDropdown && !link.asExport) {
          anchor.attr('href', linkInfo.href+ (link.iskioskTv?(linkInfo.href && linkInfo.href.indexOf('?')>0?'&kiosk=tv':'?kiosk=tv'):''));
          sanitizeAnchor();
        }
        anchor.attr('data-placement', 'bottom');
        // tooltip
        anchor.tooltip({
          title: $sanitize(scope.link.tooltip),
          html: true,
          container: 'body',
        });

        elem.find('a').css('color', link.color);
        elem.find('a').css('background-color', link.bgcolor);
      }

      function sanitizeAnchor() {
        const anchor = elem.find('a');
        const anchorSanitized = $sanitize(anchor.parent().html());
        anchor.parent().html(anchorSanitized);
      }

      elem.find('i').attr('class', 'fa fa-fw ' + scope.link.icon);
      elem.find('a').attr('target', scope.link.target);

      // fix for menus on the far right
      if (link.asDropdown && scope.$last) {
        elem.find('.dropdown-menu').addClass('pull-right');
      }

      update();
      dashboard.events.on('refresh', update, scope);
    },
  };
}

export class DashLinksContainerCtrl {
  /** @ngInject */
  constructor($scope, $rootScope, $q, backendSrv, dashboardSrv, linkSrv) {
    const currentDashId = dashboardSrv.getCurrent().id;

    function buildLinks(linkDef) {
      if (linkDef.type === 'dashboards') {
        if (!linkDef.tags) {
          console.log('Dashboard link missing tag');
          return $q.when([]);
        }

        if (linkDef.asDropdown) {
          return $q.when([
            {
              title: linkDef.title,
              tags: linkDef.tags,
              keepTime: linkDef.keepTime,
              includeVars: linkDef.includeVars,
              target: linkDef.targetBlank ? '_blank' : '_self',
              icon: 'fa fa-bars',
              asDropdown: true,
              iskioskTv: linkDef.iskioskTv?true:false,
              color: linkDef.color,
              bgcolor: linkDef.bgcolor,
            },
          ]);
        }

        return $scope.searchDashboards(linkDef, 7);
      }

      if (linkDef.type === 'link') {
        return $q.when([
          {
            url: linkDef.url,
            title: linkDef.title,
            icon: iconMap[linkDef.icon],
            tooltip: linkDef.tooltip,
            target: linkDef.targetBlank ? '_blank' : '_self',
            keepTime: linkDef.keepTime,
            includeVars: linkDef.includeVars,
            iskioskTv: linkDef.iskioskTv?true:false,
            color: linkDef.color,
            bgcolor: linkDef.bgcolor,
          },
        ]);
      }

      if (linkDef.type === 'Export CSV') {
        return $q.when([
          {
            title: linkDef.title,
            icon: iconMap[linkDef.icon],
            tooltip: linkDef.tooltip,
            color: linkDef.color,
            target: linkDef.targetBlank ? '_blank' : '_self',
            bgcolor: linkDef.bgcolor,
            iskioskTv: linkDef.iskioskTv?true:false,
            asExport: true,
          },
        ]);
      }

      return $q.when([]);
    }

    function updateDashLinks() {
      const promises = _.map($scope.links, buildLinks);

      $q.all(promises).then(results => {
        $scope.generatedLinks = _.flatten(results);
      });
    }

    $scope.searchDashboards = (link, limit) => {
      return backendSrv.search({ tag: link.tags, limit: limit }).then(results => {
        return _.reduce(
          results,
          (memo, dash) => {
            // do not add current dashboard
            if (dash.id !== currentDashId) {
              memo.push({
                title: dash.title,
                url: dash.url,
                target: link.target === '_self' ? '' : link.target,
                icon: 'fa fa-th-large',
                keepTime: link.keepTime,
                iskioskTv: link.iskioskTv?true:false,
                includeVars: link.includeVars,
                color: link.color,
                bgcolor: link.bgcolor,
              });
            }
            return memo;
          },
          []
        );
      });
    };

    $scope.fillDropdown = link => {
      $scope.searchDashboards(link, 100).then(results => {
        _.each(results, hit => {
          hit.url = linkSrv.getLinkUrl(hit);
          if(link.iskioskTv && hit.url){
            hit.url = hit.url + (hit.url.indexOf('?')>0?"&kiosk=tv":"?kiosk=tv");
          }
        });
        link.searchHits = results;
      });
    };

    $scope.exportTable = dashboard => {
      dashboard.panels
        .forEach(element => {
          if (element.type !== 'table') {
            return;
          }
          const data = [];
          element.events.emit('get-data', data);
          let ptitle = linkSrv.templateSrv.replace(element.title, linkSrv.templateSrv.variables);
          fileExport.exportTableDataToCsvByName(ptitle, data[0]);
        })
        .bind(this);
    };

    updateDashLinks();
    $rootScope.onAppEvent('dash-links-updated', updateDashLinks, $scope);
  }
}

angular.module('grafana.directives').directive('dashLinksContainer', dashLinksContainer);
angular.module('grafana.directives').directive('dashLink', dashLink);
angular.module('grafana.directives').controller('DashLinksContainerCtrl', DashLinksContainerCtrl);
