/**
 * 全链路追踪Mock数据
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { ProcessTracking, TimelineItem, Statistics } from '@/types';

export default [
  {
    url: '/api/tracking/orders/:id',
    method: 'get',
    response: ({ query }: any) => {
      const tracking: ProcessTracking = {
        orderId: query.id,
        orderNo: 'ORD202401001',
        nodes: [
          {
            id: 'node1',
            name: '客户下单',
            status: 'completed',
            startTime: '2024-01-15T08:00:00Z',
            endTime: '2024-01-15T08:00:00Z',
            participant: '客户'
          },
          {
            id: 'node2',
            name: '工厂排产',
            status: 'completed',
            startTime: '2024-01-16T08:00:00Z',
            endTime: '2024-02-18T16:00:00Z',
            participant: '钢厂'
          },
          {
            id: 'node3',
            name: '码头集货',
            status: 'completed',
            startTime: '2024-02-20T08:00:00Z',
            endTime: '2024-02-22T14:00:00Z',
            participant: '平台公司'
          },
          {
            id: 'node4',
            name: '调度承运商',
            status: 'completed',
            startTime: '2024-02-22T08:00:00Z',
            endTime: '2024-02-23T10:00:00Z',
            participant: '平台公司'
          },
          {
            id: 'node5',
            name: '船舶运输',
            status: 'completed',
            startTime: '2024-02-25T08:00:00Z',
            endTime: '2024-02-26T16:00:00Z',
            participant: '承运商'
          },
          {
            id: 'node6',
            name: '海关报关',
            status: 'completed',
            startTime: '2024-02-27T08:00:00Z',
            endTime: '2024-02-28T16:00:00Z',
            participant: '海关'
          }
        ],
        currentStep: 6,
        totalSteps: 6,
        progress: 100,
        estimatedCompletionDate: '2024-02-28'
      };

      return {
        code: 200,
        message: '获取成功',
        data: tracking
      };
    }
  },
  {
    url: '/api/tracking/timeline',
    method: 'get',
    response: ({ query }: any) => {
      const timeline: TimelineItem[] = [
        {
          id: 'timeline1',
          orderId: 'ORD202401001',
          eventType: 'order',
          title: '客户下单',
          description: '上海钢铁贸易公司下单 5000吨热轧卷板',
          timestamp: '2024-01-15T08:00:00Z',
          participant: '客户',
          status: 'success'
        },
        {
          id: 'timeline2',
          orderId: 'ORD202401001',
          eventType: 'production',
          title: '工厂排产',
          description: '宝钢集团开始生产，计划产量5000吨',
          timestamp: '2024-01-16T08:00:00Z',
          participant: '钢厂',
          status: 'success'
        },
        {
          id: 'timeline3',
          orderId: 'ORD202401001',
          eventType: 'warehousing',
          title: '码头集货完成',
          description: '上海港码头集货完成，实际集货4800吨',
          timestamp: '2024-02-22T14:00:00Z',
          participant: '平台公司',
          status: 'success'
        },
        {
          id: 'timeline4',
          orderId: 'ORD202401001',
          eventType: 'dispatch',
          title: '分配承运商',
          description: '已分配长江航运有限公司承运',
          timestamp: '2024-02-23T10:00:00Z',
          participant: '平台公司',
          status: 'success'
        },
        {
          id: 'timeline5',
          orderId: 'ORD202401001',
          eventType: 'vessel',
          title: '船舶启航',
          description: '长江号从上海港码头启航，目的地上海外高桥码头',
          timestamp: '2024-02-25T08:00:00Z',
          participant: '承运商',
          status: 'info'
        },
        {
          id: 'timeline6',
          orderId: 'ORD202401001',
          eventType: 'customs',
          title: '海关放行',
          description: '报关单已审核通过，货物已放行',
          timestamp: '2024-02-28T16:00:00Z',
          participant: '海关',
          status: 'success'
        }
      ];

      let filtered = [...timeline];
      if (query.orderId) {
        filtered = filtered.filter((t) => t.orderId === query.orderId);
      }

      return {
        code: 200,
        message: '获取成功',
        data: filtered
      };
    }
  },
  {
    url: '/api/tracking/statistics',
    method: 'get',
    response: () => {
      const statistics: Statistics = {
        totalOrders: 25,
        activeOrders: 8,
        completedOrders: 15,
        totalQuantity: 125000,
        inTransitQuantity: 32000,
        totalVessels: 15,
        activeVessels: 8,
        totalCarriers: 12,
        activeCarriers: 8
      };

      return {
        code: 200,
        message: '获取成功',
        data: statistics
      };
    }
  }
] as MockMethod[];
