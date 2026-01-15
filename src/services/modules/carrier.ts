/**
 * 承运商API模块
 */
import request from '../request';
import type { Carrier, PageResult, PageParams } from '@/types';

export const carrierApi = {
  /** 获取承运商列表 */
  getCarriers(params?: PageParams & { status?: string; name?: string }) {
    return request.get<PageResult<Carrier>>('/carriers', { params });
  },

  /** 获取承运商详情 */
  getCarrier(id: string) {
    return request.get<Carrier>(`/carriers/${id}`);
  },

  /** 同步承运商系统数据 */
  syncCarrierSystemData() {
    return request.post('/carriers/sync', {});
  }
};
