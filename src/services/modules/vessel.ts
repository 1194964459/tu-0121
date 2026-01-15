/**
 * 船舶API模块
 */
import request from '../request';
import type { Vessel, AISData, AssignVesselParams, PageResult, PageParams } from '@/types';

export const vesselApi = {
  /** 获取船舶列表 */
  getVessels(params?: PageParams & { carrierId?: string; status?: string; vesselType?: string }) {
    return request.get<PageResult<Vessel>>('/vessels', { params });
  },

  /** 获取船舶详情 */
  getVessel(id: string) {
    return request.get<Vessel>(`/vessels/${id}`);
  },

  /** 获取船舶AIS数据 */
  getAISData(vesselId: string) {
    return request.get<AISData[]>(`/vessels/${vesselId}/ais`);
  },

  /** 实时获取所有船舶AIS数据 */
  getRealTimeAISData() {
    return request.get<AISData[]>('/vessels/ais/realtime');
  },

  /** 分配船舶 */
  assignVessel(params: AssignVesselParams) {
    return request.post(`/dispatches/${params.dispatchId}/assign-vessel`, {
      vesselId: params.vesselId
    });
  },

  /** 同步AIS数据 */
  syncAISData() {
    return request.post('/vessels/ais/sync', {});
  }
};
