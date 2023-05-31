import React from 'react';

export interface Props {
  apiKey: string;
  rootPath: string;
}

export const ApiKeysAddedModal = (props: Props) => {
  return (
    <div className="modal-body">
      <div className="modal-header">
        <h2 className="modal-header-title">
          <i className="fa fa-key" />
          <span className="p-l-1">API Key已创建</span>
        </h2>

        <a className="modal-header-close" ng-click="dismiss();">
          <i className="fa fa-remove" />
        </a>
      </div>

      <div className="modal-content">
        <div className="gf-form-group">
          <div className="gf-form">
            <span className="gf-form-label">Key</span>
            <span className="gf-form-label">{props.apiKey}</span>
          </div>
        </div>

        <div className="grafana-info-box" style={{ border: 0 }}>
          您只能在这里查看此密钥一次!它不存储在此表单中。所以一定要复制下来。
          <br />
          <br />
          您可以使用授权HTTP Header验证请求，示例:
          <br />
          <br />
          <pre className="small">
            curl -H "Authorization: Bearer {props.apiKey}" {props.rootPath}/api/dashboards/home
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysAddedModal;
