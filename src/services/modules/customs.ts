/**
 * 报关API模块
 */
import request from '../request';
import type {
  CustomsDeclaration,
  CreateCustomsDeclarationParams,
  PageResult,
  PageParams
} from '@/types';

export const customsApi = {
  /** 获取报关单列表 */
  getCustomsDeclarations(params?: PageParams & { orderId?: string; status?: string }) {
    return request.get<PageResult<CustomsDeclaration>>('/customs/declarations', { params });
  },

  /** 获取报关单详情 */
  getCustomsDeclaration(id: string) {
    return request.get<CustomsDeclaration>(`/customs/declarations/${id}`);
  },

  /** 创建报关单 */
  createCustomsDeclaration(params: CreateCustomsDeclarationParams) {
    return request.post<CustomsDeclaration>('/customs/declarations', params);
  },

  /** 提交报关单 */
  submitCustomsDeclaration(id: string) {
    return request.post<CustomsDeclaration>(`/customs/declarations/${id}/submit`, {});
  },

  /** 同步海关报关系统数据 */
  syncCustomsSystemData(declarationId: string) {
    return request.post(`/customs/declarations/${declarationId}/sync`, {});
  }
};
