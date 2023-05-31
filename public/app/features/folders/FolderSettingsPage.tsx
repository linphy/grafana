import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import PageHeader from 'app/core/components/PageHeader/PageHeader';
import appEvents from 'app/core/app_events';
import { getNavModel } from 'app/core/selectors/navModel';
import { NavModel, StoreState, FolderState } from 'app/types';
import { getFolderByUid, setFolderTitle, saveFolder, deleteFolder } from './state/actions';
import { getLoadingNav } from './state/navModel';

export interface Props {
  navModel: NavModel;
  folderUid: string;
  folder: FolderState;
  getFolderByUid: typeof getFolderByUid;
  setFolderTitle: typeof setFolderTitle;
  saveFolder: typeof saveFolder;
  deleteFolder: typeof deleteFolder;
}

export class FolderSettingsPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.getFolderByUid(this.props.folderUid);
  }

  onTitleChange = evt => {
    this.props.setFolderTitle(evt.target.value);
  };

  onSave = async evt => {
    evt.preventDefault();
    evt.stopPropagation();

    await this.props.saveFolder(this.props.folder);
  };

  onDelete = evt => {
    evt.stopPropagation();
    evt.preventDefault();

    appEvents.emit('confirm-modal', {
      title: '删除',
      text: `你想要删除这个文件夹和文件夹下的所有仪表盘吗?`,
      icon: 'fa-trash',
      yesText: '删除',
      onConfirm: () => {
        this.props.deleteFolder(this.props.folder.uid);
      },
    });
  };

  render() {
    const { navModel, folder } = this.props;

    return (
      <div>
        <PageHeader model={navModel} />
        <div className="page-container page-body">
          <h2 className="page-sub-heading">文件夹设置</h2>

          <div className="section gf-form-group">
            <form name="folderSettingsForm" onSubmit={this.onSave}>
              <div className="gf-form">
                <label className="gf-form-label width-7">名称</label>
                <input
                  type="text"
                  className="gf-form-input width-30"
                  value={folder.title}
                  onChange={this.onTitleChange}
                />
              </div>
              <div className="gf-form-button-row">
                <button type="submit" className="btn btn-success" disabled={!folder.canSave || !folder.hasChanged}>
                  <i className="fa fa-save" /> 保存
                </button>
                <button className="btn btn-danger" onClick={this.onDelete} disabled={!folder.canSave}>
                  <i className="fa fa-trash" /> 删除
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  const uid = state.location.routeParams.uid;

  return {
    navModel: getNavModel(state.navIndex, `folder-settings-${uid}`, getLoadingNav(2)),
    folderUid: uid,
    folder: state.folder,
  };
};

const mapDispatchToProps = {
  getFolderByUid,
  saveFolder,
  setFolderTitle,
  deleteFolder,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(FolderSettingsPage));
