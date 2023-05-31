import React, { PureComponent } from 'react';

import { Label } from 'app/core/components/Label/Label';
import SimplePicker from 'app/core/components/Picker/SimplePicker';
import { getBackendSrv, BackendSrv } from 'app/core/services/backend_srv';

import { DashboardSearchHit } from 'app/types';

export interface Props {
  resourceUri: string;
}

export interface State {
  homeDashboardId: number;
  theme: string;
  timezone: string;
  backgroundUrl: string;
  dashboards: DashboardSearchHit[];
}

const themes = [{ value: '', text: '默认' }, { value: 'dark', text: '暗' }, { value: 'light', text: '亮' }];

const timezones = [
  { value: '', text: '默认' },
  { value: 'browser', text: '本地浏览器时间' },
  { value: 'utc', text: 'UTC' },
];

export class SharedPreferences extends PureComponent<Props, State> {
  backendSrv: BackendSrv = getBackendSrv();
  constructor(props) {
    super(props);

    this.state = {
      homeDashboardId: 0,
      theme: '',
      timezone: '',
      backgroundUrl: '',
      dashboards: [],
    };
  }

  async componentDidMount() {
    const prefs = await this.backendSrv.get(`/api/${this.props.resourceUri}/preferences`);
    const dashboards = await this.backendSrv.search({ starred: true });

    if (prefs.homeDashboardId > 0 && !dashboards.find(d => d.id === prefs.homeDashboardId)) {
      const missing = await this.backendSrv.search({ dashboardIds: [prefs.homeDashboardId] });
      if (missing && missing.length > 0) {
        dashboards.push(missing[0]);
      }
    }

    this.setState({
      homeDashboardId: prefs.homeDashboardId,
      theme: prefs.theme,
      timezone: prefs.timezone,
      backgroundUrl: prefs.backgroundUrl,
      dashboards: [{ id: 0, title: '默认', tags: [], type: '', uid: '', uri: '', url: '' }, ...dashboards],
    });
  }

  onSubmitForm = async event => {
    event.preventDefault();

    const { homeDashboardId, theme, timezone, backgroundUrl } = this.state;

    await this.backendSrv.put(`/api/${this.props.resourceUri}/preferences`, {
      homeDashboardId,
      theme,
      timezone,
      backgroundUrl,
    });
    window.location.reload();
  };

  onThemeChanged = (theme: string) => {
    this.setState({ theme });
  };

  onTimeZoneChanged = (timezone: string) => {
    this.setState({ timezone });
  };

  onHomeDashboardChanged = (dashboardId: number) => {
    this.setState({ homeDashboardId: dashboardId });
  };

  onHomeBgUrlChanged = url => {
    this.setState({ backgroundUrl: url });
  };

  render() {
    const { theme, timezone, homeDashboardId, backgroundUrl, dashboards } = this.state;

    return (
      <form className="section gf-form-group" onSubmit={this.onSubmitForm}>
        <h3 className="page-heading">偏好</h3>
        <div className="gf-form">
          <span className="gf-form-label width-11">UI主题</span>
          <SimplePicker
            value={themes.find(item => item.value === theme)}
            options={themes}
            getOptionValue={i => i.value}
            getOptionLabel={i => i.text}
            onSelected={theme => this.onThemeChanged(theme.value)}
            width={20}
          />
        </div>
        <div className="gf-form">
          <Label width={11} tooltip="找不到你想要的仪表盘?先用星号标记它，然后它会出现在这个选择框中。">
            主页仪表盘
          </Label>
          <SimplePicker
            value={dashboards.find(dashboard => dashboard.id === homeDashboardId)}
            getOptionValue={i => i.id}
            getOptionLabel={i => i.title}
            onSelected={(dashboard: DashboardSearchHit) => this.onHomeDashboardChanged(dashboard.id)}
            options={dashboards}
            placeholder="选择默认仪表盘"
            width={20}
          />
        </div>
        <div className="gf-form">
          <label className="gf-form-label width-11">时区</label>
          <SimplePicker
            value={timezones.find(item => item.value === timezone)}
            getOptionValue={i => i.value}
            getOptionLabel={i => i.text}
            onSelected={timezone => this.onTimeZoneChanged(timezone.value)}
            options={timezones}
            width={20}
          />
        </div>
        <div className="gf-form" style={{ display: this.props.resourceUri == 'user' ? 'block' : 'none' }}>
          <Label
            width={11}
            tooltip="请先将背景图片放置public/img目录下，输入框中填写图片名称及格式即可,例如 grafana_icon.svg"
          >
            更改背景图片
          </Label>
          <input
            className="gf-form-input width-20"
            type="text"
            value={backgroundUrl}
            onChange={event => {
              this.onHomeBgUrlChanged(event.target.value);
            }}
            style={{
              display: 'inline-block',
              position: 'absolute',
              top: '0',
              right: '0',
            }}
          />
        </div>
        <div className="gf-form-button-row">
          <button type="submit" className="btn btn-success">
            保存
          </button>
        </div>
      </form>
    );
  }
}

export default SharedPreferences;
