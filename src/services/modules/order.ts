/**
 * 订单API模块
 */
import request from '../request';
import type { Order, CreateOrderParams, PageResult, PageParams } from '@/types';

export const orderApi = {
  /** 获取订单列表 */
  getOrders(params?: PageParams & { status?: string; customerName?: string }) {
    return request.get<PageResult<Order>>('/orders', { params });
  },

  /** 获取订单详情 */
  getOrder(id: string) {
    return request.get<Order>(`/orders/${id}`);
  },

  /** 创建订单 */
  createOrder(params: CreateOrderParams) {
    return request.post<Order>('/orders', params);
  },

  /** 更新订单 */
  updateOrder(id: string, data: Partial<Order>) {
    return request.put<Order>(`/orders/${id}`, data);
  },

  /** 取消订单 */
  cancelOrder(id: string) {
    return request.put<Order>(`/orders/${id}/cancel`, {});
  }
};
