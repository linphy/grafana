import _ from 'lodash';
import moment from 'moment';

import { RawTimeRange } from 'app/types/series';

import * as dateMath from './datemath';

const spans = {
  s: { display: '秒' },
  m: { display: '分' },
  h: { display: '小时' },
  d: { display: '天' },
  w: { display: '周' },
  M: { display: '月' },
  y: { display: '年' },
};

const rangeOptions = [
  { from: 'now/d', to: 'now/d', display: '今天', section: 2 },
  { from: 'now/d', to: 'now', display: '今天到目前', section: 2 },
  { from: 'now/w', to: 'now/w', display: '本周', section: 2 },
  { from: 'now/w', to: 'now', display: '本周到目前', section: 2 },
  { from: 'now/M', to: 'now/M', display: '本月', section: 2 },
  { from: 'now/M', to: 'now', display: '本月到目前', section: 2 },
  { from: 'now/y', to: 'now/y', display: '今年', section: 2 },
  { from: 'now/y', to: 'now', display: '今年到目前', section: 2 },

  { from: 'now-1d/d', to: 'now-1d/d', display: '昨天', section: 1 },
  {
    from: 'now-2d/d',
    to: 'now-2d/d',
    display: '前天',
    section: 1,
  },
  {
    from: 'now-7d/d',
    to: 'now-7d/d',
    display: '上周的今天',
    section: 1,
  },
  { from: 'now-1w/w', to: 'now-1w/w', display: '上周', section: 1 },
  { from: 'now-1M/M', to: 'now-1M/M', display: '上月', section: 1 },
  /* [OGE]
  { from: 'now-1y/y', to: 'now-1y/y', display: 'Previous year', section: 1 },
  */

  { from: 'now-5m', to: 'now', display: '过去5分钟', section: 3 },
  { from: 'now-15m', to: 'now', display: '过去15分钟', section: 3 },
  { from: 'now-30m', to: 'now', display: '过去30分钟', section: 3 },
  { from: 'now-1h', to: 'now', display: '过去1小时', section: 3 },
  { from: 'now-3h', to: 'now', display: '过去3小时', section: 3 },
  { from: 'now-6h', to: 'now', display: '过去6小时', section: 3 },
  { from: 'now-12h', to: 'now', display: '过去12小时', section: 3 },
  { from: 'now-24h', to: 'now', display: '过去24小时', section: 3 },

  { from: 'now-2d', to: 'now', display: '过去2天', section: 0 },
  { from: 'now-7d', to: 'now', display: '过去7天', section: 0 },
  { from: 'now-30d', to: 'now', display: '过去30天', section: 0 },
  /* [OGE]
  { from: 'now-90d', to: 'now', display: 'Last 90 days', section: 0 },
  { from: 'now-6M', to: 'now', display: 'Last 6 months', section: 0 },
  { from: 'now-1y', to: 'now', display: 'Last 1 year', section: 0 },
  { from: 'now-2y', to: 'now', display: 'Last 2 years', section: 0 },
  { from: 'now-5y', to: 'now', display: 'Last 5 years', section: 0 },
  */
];

const absoluteFormat = 'YYYY-MM-DD HH:mm:ss';

const rangeIndex = {};
_.each(rangeOptions, frame => {
  rangeIndex[frame.from + ' 至 ' + frame.to] = frame;
});

export function getRelativeTimesList(timepickerSettings, currentDisplay) {
  const groups = _.groupBy(rangeOptions, (option: any) => {
    option.active = option.display === currentDisplay;
    return option.section;
  });

  // _.each(timepickerSettings.time_options, (duration: string) => {
  //   let info = describeTextRange(duration);
  //   if (info.section) {
  //     groups[info.section].push(info);
  //   }
  // });

  return groups;
}

function formatDate(date) {
  return date.format(absoluteFormat);
}

// handles expressions like
// 5m
// 5m 至 now/d
// now/d 至 now
// now/d
// if no 至 <expr> then 至 now is assumed
export function describeTextRange(expr: any) {
  const isLast = expr.indexOf('+') !== 0;
  if (expr.indexOf('now') === -1) {
    expr = (isLast ? 'now-' : 'now') + expr;
  }

  let opt = rangeIndex[expr + ' 至 now'];
  if (opt) {
    return opt;
  }

  if (isLast) {
    opt = { from: expr, to: 'now' };
  } else {
    opt = { from: 'now', to: expr };
  }

  const parts = /^now([-+])(\d+)(\w)/.exec(expr);
  if (parts) {
    const unit = parts[3];
    const amount = parseInt(parts[2], 10);
    const span = spans[unit];
    if (span) {
      opt.display = isLast ? '过去' : '未来';
      opt.display += amount + '' + span.display; // 中文单位不需要空格
      opt.section = span.section;
      /* 单位的复数形式， 中文不需要
      if (amount > 1) {
        opt.display += 's';
      }
      */
    }
  } else {
    opt.display = opt.from + ' 至 ' + opt.to;
    opt.invalid = true;
  }

  return opt;
}

export function describeTimeRange(range: RawTimeRange): string {
  const option = rangeIndex[range.from.toString() + ' 至 ' + range.to.toString()];
  if (option) {
    return option.display;
  }

  if (moment.isMoment(range.from) && moment.isMoment(range.to)) {
    return formatDate(range.from) + ' 至 ' + formatDate(range.to);
  }

  if (moment.isMoment(range.from)) {
    const toMoment = dateMath.parse(range.to, true);
    return formatDate(range.from) + ' 至 ' + toMoment.fromNow();
  }

  if (moment.isMoment(range.to)) {
    const from = dateMath.parse(range.from, false);
    return from.fromNow() + ' 至 ' + formatDate(range.to);
  }

  if (range.to.toString() === 'now') {
    const res = describeTextRange(range.from);
    return res.display;
  }

  return range.from.toString() + ' 至 ' + range.to.toString();
}
