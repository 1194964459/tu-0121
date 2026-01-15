/**
 * 排产Mock数据
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { ProductionPlan } from '@/types';

const mockProductionPlans: ProductionPlan[] = [
  {
    id: 'PROD202401001',
    orderId: 'ORD202401001',
    factoryName: '宝钢集团',
    productType: 'HRC',
    plannedQuantity: 5000,
    actualQuantity: 4800,
    plannedStartDate: '2024-01-20',
    plannedEndDate: '2024-02-20',
    actualStartDate: '2024-01-20',
    actualEndDate: '2024-02-18',
    status: 'completed',
    steelFactorySystemRef: 'STEEL-2024-001',
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-02-18T16:00:00Z'
  },
  {
    id: 'PROD202401002',
    orderId: 'ORD202401002',
    factoryName: '沙钢集团',
    productType: 'CRC',
    plannedQuantity: 3000,
    actualQuantity: 2800,
    plannedStartDate: '2024-01-25',
    plannedEndDate: '2024-02-25',
    actualStartDate: '2024-01-25',
    status: 'producing',
    steelFactorySystemRef: 'STEEL-2024-002',
    createdAt: '2024-01-21T09:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z'
  }
];

export default [
  {
    url: '/api/production/plans',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, orderId, status } = query;
      let filtered = [...mockProductionPlans];

      if (orderId) {
        filtered = filtered.filter((p) => p.orderId === orderId);
      }
      if (status) {
        filtered = filtered.filter((p) => p.status === status);
      }

      const start = (Number(page) - 1) * Number(pageSize);
      const end = start + Number(pageSize);
      const list = filtered.slice(start, end);

      return {
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filtered.length,
          page: Number(page),
          pageSize: Number(pageSize)
        }
      };
    }
  },
  {
    url: '/api/production/plans/:id',
    method: 'get',
    response: ({ query }: any) => {
      const plan = mockProductionPlans.find((p) => p.id === query.id);
      if (plan) {
        return {
          code: 200,
          message: '获取成功',
          data: plan
        };
      }
      return {
        code: 404,
        message: '排产计划不存在'
      };
    }
  },
  {
    url: '/api/production/plans',
    method: 'post',
    response: ({ body }: any) => {
      const newPlan: ProductionPlan = {
        id: `PROD${Date.now()}`,
        ...body,
        status: 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockProductionPlans.push(newPlan);
      return {
        code: 200,
        message: '创建成功',
        data: newPlan
      };
    }
  },
  {
    url: '/api/production/plans/:id/sync',
    method: 'post',
    response: ({ query }: any) => {
      const plan = mockProductionPlans.find((p) => p.id === query.id);
      if (plan) {
        // 模拟同步钢厂系统数据
        plan.actualQuantity = Math.floor(plan.plannedQuantity * 0.95);
        plan.actualStartDate = plan.plannedStartDate;
        plan.status = 'producing';
        plan.updatedAt = new Date().toISOString();
        return {
          code: 200,
          message: '同步成功',
          data: plan
        };
      }
      return {
        code: 404,
        message: '排产计划不存在'
      };
    }
  }
] as MockMethod[];
