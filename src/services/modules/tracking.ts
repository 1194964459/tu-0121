/**
 * 全链路追踪API模块
 */
import request from '../request';
import type { ProcessTracking, TimelineItem, Statistics } from '@/types';

export const trackingApi = {
  /** 获取订单全链路追踪信息 */
  getProcessTracking(orderId: string) {
    return request.get<ProcessTracking>(`/tracking/orders/${orderId}`);
  },

  /** 获取时间线数据 */
  getTimeline(params?: { orderId?: string; startDate?: string; endDate?: string }) {
    return request.get<TimelineItem[]>('/tracking/timeline', { params });
  },

  /** 获取统计数据 */
  getStatistics() {
    return request.get<Statistics>('/tracking/statistics');
  }
};
