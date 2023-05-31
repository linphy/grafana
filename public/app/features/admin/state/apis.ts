import { getBackendSrv } from 'app/core/services/backend_srv';

export interface ServerStat {
  name: string;
  value: number;
}

export const getServerStats = async (): Promise<ServerStat[]> => {
  try {
    const res = await getBackendSrv().get('api/admin/stats');
    return [
      { name: '用户总数', value: res.users },
      { name: '仪表盘总数', value: res.dashboards },
      { name: '活跃用户 (30天之内有过活动)', value: res.activeUsers },
      { name: '组织总数', value: res.orgs },
      { name: '播放列表总数', value: res.playlists },
      { name: '快照总数', value: res.snapshots },
      { name: '仪表盘标签总数', value: res.tags },
      { name: '标星仪表盘总数', value: res.stars },
      { name: '报警总数', value: res.alerts },
    ];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
