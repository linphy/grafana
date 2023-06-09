import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PageHeader from '../../core/components/PageHeader/PageHeader';
import PageLoader from 'app/core/components/PageLoader/PageLoader';
import OrgActionBar from '../../core/components/OrgActionBar/OrgActionBar';
import EmptyListCTA from '../../core/components/EmptyListCTA/EmptyListCTA';
import DataSourcesList from './DataSourcesList';
import { DataSource, NavModel } from 'app/types';
import { LayoutMode } from '../../core/components/LayoutSelector/LayoutSelector';
import { loadDataSources, setDataSourcesLayoutMode, setDataSourcesSearchQuery } from './state/actions';
import { getNavModel } from '../../core/selectors/navModel';
import {
  getDataSources,
  getDataSourcesCount,
  getDataSourcesLayoutMode,
  getDataSourcesSearchQuery,
} from './state/selectors';

export interface Props {
  navModel: NavModel;
  dataSources: DataSource[];
  dataSourcesCount: number;
  layoutMode: LayoutMode;
  searchQuery: string;
  hasFetched: boolean;
  loadDataSources: typeof loadDataSources;
  setDataSourcesLayoutMode: typeof setDataSourcesLayoutMode;
  setDataSourcesSearchQuery: typeof setDataSourcesSearchQuery;
}

const emptyListModel = {
  title: '还没有数据源',
  buttonIcon: 'gicon gicon-add-datasources',
  buttonLink: 'datasources/new',
  buttonTitle: '添加数据源',
  proTip: '您还可以通过配置文件定义数据源。',
  proTipLink: '',
  proTipLinkTitle: 'Learn more',
  proTipTarget: '_blank',
};

export class DataSourcesListPage extends PureComponent<Props> {
  componentDidMount() {
    this.fetchDataSources();
  }

  async fetchDataSources() {
    return await this.props.loadDataSources();
  }

  render() {
    const {
      dataSources,
      dataSourcesCount,
      navModel,
      layoutMode,
      searchQuery,
      setDataSourcesSearchQuery,
      setDataSourcesLayoutMode,
      hasFetched,
    } = this.props;

    const linkButton = {
      href: 'datasources/new',
      title: '添加数据源',
    };

    return (
      <div>
        <PageHeader model={navModel} />
        <div className="page-container page-body">
          {!hasFetched && <PageLoader pageName="Data sources" />}
          {hasFetched && dataSourcesCount === 0 && <EmptyListCTA model={emptyListModel} />}
          {hasFetched &&
            dataSourcesCount > 0 && [
              <OrgActionBar
                layoutMode={layoutMode}
                searchQuery={searchQuery}
                onSetLayoutMode={mode => setDataSourcesLayoutMode(mode)}
                setSearchQuery={query => setDataSourcesSearchQuery(query)}
                linkButton={linkButton}
                key="action-bar"
              />,
              <DataSourcesList dataSources={dataSources} layoutMode={layoutMode} key="list" />,
            ]}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navModel: getNavModel(state.navIndex, 'datasources'),
    dataSources: getDataSources(state.dataSources),
    layoutMode: getDataSourcesLayoutMode(state.dataSources),
    dataSourcesCount: getDataSourcesCount(state.dataSources),
    searchQuery: getDataSourcesSearchQuery(state.dataSources),
    hasFetched: state.dataSources.hasFetched,
  };
}

const mapDispatchToProps = {
  loadDataSources,
  setDataSourcesSearchQuery,
  setDataSourcesLayoutMode,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(DataSourcesListPage));
