/**
 * 调度API模块
 */
import request from '../request';
import type {
  Dispatch,
  CreateDispatchParams,
  AssignCarrierParams,
  PageResult,
  PageParams
} from '@/types';

export const dispatchApi = {
  /** 获取调度列表 */
  getDispatches(params?: PageParams & { orderId?: string; status?: string }) {
    return request.get<PageResult<Dispatch>>('/dispatches', { params });
  },

  /** 获取调度详情 */
  getDispatch(id: string) {
    return request.get<Dispatch>(`/dispatches/${id}`);
  },

  /** 创建调度 */
  createDispatch(params: CreateDispatchParams) {
    return request.post<Dispatch>('/dispatches', params);
  },

  /** 分配承运商 */
  assignCarrier(params: AssignCarrierParams) {
    return request.post<Dispatch>(`/dispatches/${params.dispatchId}/assign-carrier`, {
      carrierId: params.carrierId
    });
  },

  /** 更新调度信息 */
  updateDispatch(id: string, data: Partial<Dispatch>) {
    return request.put<Dispatch>(`/dispatches/${id}`, data);
  }
};
