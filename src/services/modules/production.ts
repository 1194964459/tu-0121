/**
 * 排产API模块
 */
import request from '../request';
import type { ProductionPlan, CreateProductionPlanParams, PageResult, PageParams } from '@/types';

export const productionApi = {
  /** 获取排产计划列表 */
  getProductionPlans(params?: PageParams & { orderId?: string; status?: string }) {
    return request.get<PageResult<ProductionPlan>>('/production/plans', { params });
  },

  /** 获取排产计划详情 */
  getProductionPlan(id: string) {
    return request.get<ProductionPlan>(`/production/plans/${id}`);
  },

  /** 创建排产计划 */
  createProductionPlan(params: CreateProductionPlanParams) {
    return request.post<ProductionPlan>('/production/plans', params);
  },

  /** 更新排产计划 */
  updateProductionPlan(id: string, data: Partial<ProductionPlan>) {
    return request.put<ProductionPlan>(`/production/plans/${id}`, data);
  },

  /** 同步钢厂生产系统数据 */
  syncSteelFactoryData(planId: string) {
    return request.post(`/production/plans/${planId}/sync`, {});
  }
};
