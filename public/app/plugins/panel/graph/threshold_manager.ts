import 'vendor/flot/jquery.flot';
import $ from 'jquery';
import _ from 'lodash';
import templateSrv from 'app/features/templating/template_srv';

export class ThresholdManager {
  plot: any;
  placeholder: any;
  thresholdInfo: any;
  height: any;
  thresholds: any;
  needsCleanup: boolean;
  hasSecondYAxis: any;

  constructor(private panelCtrl) {}

  getHandleHtml(handleIndex, model, valueStr) {
    let stateClass = model.colorMode;
    if (model.colorMode === 'custom') {
      stateClass = 'critical';
    }

    return `
    <div class="alert-handle-wrapper threshold-drag alert-handle-wrapper--T${handleIndex}">
      <div class="alert-handle-line alert-handle-line--${stateClass}">
      </div>
      <div class="alert-handle" data-handle-index="${handleIndex}">
        <i class="icon-gf icon-gf-${stateClass} alert-state-${stateClass}"></i>
        <span class="alert-handle-value">${valueStr}<i class="alert-handle-grip"></i></span>
      </div>
    </div>`;
  }

  getThresholdInfoHtml(handleIndex, model, valueStr) {
    // let stateClass = model.colorMode;
    // if (model.colorMode === 'custom') {
    //   stateClass = 'critical';
    // }
    if (!model.showValue) return '';
    return `
     <div class="alert-handle-wrapper threshold-show alert-handle-wrapper--T1">
         <span class="alert-handle-value">${valueStr}</span>
     </div>`;
  }

  initDragging(evt) {
    const handleElem = $(evt.currentTarget).parents('.alert-handle-wrapper');
    const handleIndex = $(evt.currentTarget).data('handleIndex');

    let lastY = null;
    let posTop;
    const plot = this.plot;
    const panelCtrl = this.panelCtrl;
    const model = this.thresholds[handleIndex];

    function dragging(evt) {
      if (lastY === null) {
        lastY = evt.clientY;
      } else {
        const diff = evt.clientY - lastY;
        posTop = posTop + diff;
        lastY = evt.clientY;
        handleElem.css({ top: posTop + diff });
        handleElem.css('margin-right', '36px');
      }
    }

    function stopped() {
      // calculate graph level
      let graphValue = plot.c2p({ left: 0, top: posTop }).y;
      graphValue = parseInt(graphValue.toFixed(0), 10);
      model.valueTrue = graphValue;

      handleElem.off('mousemove', dragging);
      handleElem.off('mouseup', dragging);
      handleElem.off('mouseleave', dragging);

      // trigger digest and render
      panelCtrl.$scope.$apply(() => {
        panelCtrl.render();
        panelCtrl.events.emit('threshold-changed', {
          threshold: model,
          handleIndex: handleIndex,
        });
      });
    }

    lastY = null;
    posTop = handleElem.position().top;

    handleElem.on('mousemove', dragging);
    handleElem.on('mouseup', stopped);
    handleElem.on('mouseleave', stopped);
  }

  cleanUp() {
    this.placeholder.find('.threshold-drag').remove();
    this.needsCleanup = false;
  }

  renderHandle(handleIndex, defaultHandleTopPos) {
    const model = this.thresholds[handleIndex];
    const value = model.valueTrue;
    let valueStr = value;
    let handleTopPos = 0;

    // handle no value
    if (!_.isNumber(value)) {
      valueStr = '';
      handleTopPos = defaultHandleTopPos;
    } else {
      const valueCanvasPos = this.plot.p2c({ x: 0, y: value });
      handleTopPos = Math.round(Math.min(Math.max(valueCanvasPos.top, 0), this.height) - 12);
    }

    const handleElem = $(this.getHandleHtml(handleIndex, model, valueStr));
    this.placeholder.append(handleElem);

    handleElem.toggleClass('alert-handle-wrapper--no-value', valueStr === '');
    handleElem.css({ top: handleTopPos });
    handleElem.css('margin-right', '36px');
  }

  renderThresholdInfo(handleIndex, defaultHandleTopPos) {
    const model = this.thresholds[handleIndex];
    const value = model.valueTrue;
    let valueStr = value;
    let handleTopPos = 0;

    // handle no value
    if (!_.isNumber(value)) {
      valueStr = '';
      handleTopPos = defaultHandleTopPos;
    } else {
      const valueCanvasPos = this.plot.p2c({ x: 0, y: value });
      handleTopPos = Math.round(Math.min(Math.max(valueCanvasPos.top, 0), this.height) - 12);
    }

    const handleElem = $(this.getThresholdInfoHtml(handleIndex, model, valueStr));
    this.placeholder.append(handleElem);

    handleElem.toggleClass('alert-handle-wrapper--no-value', valueStr === '');
    handleElem.css({ top: handleTopPos });
    handleElem.css('margin-right', '36px');
  }

  showThresholdValue(plot) {
    this.placeholder.find('.threshold-show').remove();
    this.height = plot.height();
    // if (this.thresholds.length > 0) {
    //   this.renderThresholdInfo(0, 10);
    // }
    // if (this.thresholds.length > 1) {
    //   this.renderThresholdInfo(1, this.height - 30);
    // }
    for (let i = 0; i < this.thresholds.length; i++) {
      this.renderThresholdInfo(i, this.height - 10 - 20 * i);
    }
  }

  shouldDrawHandles() {
    return !this.hasSecondYAxis && this.panelCtrl.editingThresholds && this.panelCtrl.panel.thresholds.length > 0;
  }

  prepare(elem, data) {
    this.hasSecondYAxis = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].yaxis > 1) {
        this.hasSecondYAxis = true;
        break;
      }
    }

    if (this.shouldDrawHandles()) {
      const thresholdMargin = this.panelCtrl.panel.thresholds.length > 1 ? '220px' : '110px';
      elem.css('margin-right', thresholdMargin);
    } else if (this.needsCleanup) {
      elem.css('margin-right', '0');
    }
  }

  draw(plot) {
    this.thresholds = this.panelCtrl.panel.thresholds;
    this.plot = plot;
    this.placeholder = plot.getPlaceholder();

    if (this.needsCleanup) {
      this.cleanUp();
    }

    this.showThresholdValue(plot);

    if (!this.shouldDrawHandles()) {
      return;
    }

    this.height = plot.height();

    if (this.thresholds.length > 0) {
      this.renderHandle(0, 10);
    }
    if (this.thresholds.length > 1) {
      this.renderHandle(1, this.height - 30);
    }

    this.placeholder.off('mousedown', '.alert-handle');
    this.placeholder.on('mousedown', '.alert-handle', this.initDragging.bind(this));
    this.needsCleanup = true;
  }

  addFlotOptions(options, panel) {
    if (!panel.thresholds || panel.thresholds.length === 0) {
      return;
    }

    let gtLimit = Infinity;
    let ltLimit = -Infinity;
    let i, threshold, other;

    for (i = 0; i < panel.thresholds.length; i++) {
      threshold = panel.thresholds[i];
      let val = JSON.parse(JSON.stringify(threshold.value));
      if (threshold.value !== 0 && !threshold.value) {
        continue;
      }
      threshold.valueTrue = Number(threshold.value);
      if (isNaN(threshold.value)) {
        threshold.valueTrue = templateSrv.replace(val);
        if (!_.isNumber(threshold.valueTrue - 0)) {
          continue;
        } else {
          threshold.valueTrue = threshold.valueTrue - 0;
        }
      }

      let limit;
      switch (threshold.op) {
        case 'gt': {
          limit = gtLimit;
          // if next threshold is less then op and greater value, then use that as limit
          if (panel.thresholds.length > i + 1) {
            other = panel.thresholds[i + 1];
            if (other.valueTrue > threshold.valueTrue) {
              limit = other.valueTrue;
              ltLimit = limit;
            }
          }
          break;
        }
        case 'lt': {
          limit = ltLimit;
          // if next threshold is less then op and greater value, then use that as limit
          if (panel.thresholds.length > i + 1) {
            other = panel.thresholds[i + 1];
            if (other.valueTrue < threshold.valueTrue) {
              limit = other.valueTrue;
              gtLimit = limit;
            }
          }
          break;
        }
      }

      let fillColor, lineColor;
      switch (threshold.colorMode) {
        case 'critical': {
          fillColor = 'rgba(234, 112, 112, 0.12)';
          lineColor = 'rgba(237, 46, 24, 0.60)';
          break;
        }
        case 'warning': {
          fillColor = 'rgba(235, 138, 14, 0.12)';
          lineColor = 'rgba(247, 149, 32, 0.60)';
          break;
        }
        case 'ok': {
          fillColor = 'rgba(11, 237, 50, 0.090)';
          lineColor = 'rgba(6,163,69, 0.60)';
          break;
        }
        case 'custom': {
          fillColor = threshold.fillColor;
          lineColor = threshold.lineColor;
          break;
        }
      }

      // fill
      if (threshold.fill) {
        if (threshold.yaxis === 'right' && this.hasSecondYAxis) {
          options.grid.markings.push({
            y2axis: { from: threshold.valueTrue, to: limit },
            color: fillColor,
          });
        } else {
          options.grid.markings.push({
            yaxis: { from: threshold.valueTrue, to: limit },
            color: fillColor,
          });
        }
      }
      if (threshold.line) {
        if (threshold.yaxis === 'right' && this.hasSecondYAxis) {
          options.grid.markings.push({
            y2axis: { from: threshold.valueTrue, to: threshold.valueTrue },
            color: lineColor,
          });
        } else {
          options.grid.markings.push({
            yaxis: { from: threshold.valueTrue, to: threshold.valueTrue },
            color: lineColor,
          });
        }
      }
    }
  }
}
