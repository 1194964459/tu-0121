/**
 * 集货API模块
 */
import request from '../request';
import type { Warehousing, CreateWarehousingParams, PageResult, PageParams } from '@/types';

export const warehousingApi = {
  /** 获取集货信息列表 */
  getWarehousings(params?: PageParams & { orderId?: string; status?: string }) {
    return request.get<PageResult<Warehousing>>('/warehousing', { params });
  },

  /** 获取集货信息详情 */
  getWarehousing(id: string) {
    return request.get<Warehousing>(`/warehousing/${id}`);
  },

  /** 创建集货计划 */
  createWarehousing(params: CreateWarehousingParams) {
    return request.post<Warehousing>('/warehousing', params);
  },

  /** 更新集货信息 */
  updateWarehousing(id: string, data: Partial<Warehousing>) {
    return request.put<Warehousing>(`/warehousing/${id}`, data);
  },

  /** 同步平台公司物流系统数据 */
  syncLogisticsData(warehousingId: string) {
    return request.post(`/warehousing/${warehousingId}/sync`, {});
  }
};
