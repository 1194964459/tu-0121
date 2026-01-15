/**
 * 集货Mock数据
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { Warehousing } from '@/types';

const mockWarehousings: Warehousing[] = [
  {
    id: 'WH202401001',
    orderId: 'ORD202401001',
    productionPlanId: 'PROD202401001',
    wharfName: '上海港码头',
    warehouseNo: 'WH-001',
    quantity: 4800,
    scheduledDate: '2024-02-20',
    actualDate: '2024-02-22',
    status: 'completed',
    logisticsSystemRef: 'LOG-2024-001',
    createdAt: '2024-02-18T08:00:00Z',
    updatedAt: '2024-02-22T14:00:00Z'
  },
  {
    id: 'WH202401002',
    orderId: 'ORD202401003',
    productionPlanId: 'PROD202401003',
    wharfName: '宁波港码头',
    warehouseNo: 'WH-002',
    quantity: 8000,
    scheduledDate: '2024-02-25',
    actualDate: '2024-02-26',
    status: 'completed',
    logisticsSystemRef: 'LOG-2024-002',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-02-26T16:00:00Z'
  }
];

export default [
  {
    url: '/api/warehousing',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, orderId, status } = query;
      let filtered = [...mockWarehousings];

      if (orderId) {
        filtered = filtered.filter((w) => w.orderId === orderId);
      }
      if (status) {
        filtered = filtered.filter((w) => w.status === status);
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
    url: '/api/warehousing/:id',
    method: 'get',
    response: ({ query }: any) => {
      const warehousing = mockWarehousings.find((w) => w.id === query.id);
      if (warehousing) {
        return {
          code: 200,
          message: '获取成功',
          data: warehousing
        };
      }
      return {
        code: 404,
        message: '集货信息不存在'
      };
    }
  },
  {
    url: '/api/warehousing',
    method: 'post',
    response: ({ body }: any) => {
      const newWarehousing: Warehousing = {
        id: `WH${Date.now()}`,
        ...body,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockWarehousings.push(newWarehousing);
      return {
        code: 200,
        message: '创建成功',
        data: newWarehousing
      };
    }
  },
  {
    url: '/api/warehousing/:id/sync',
    method: 'post',
    response: ({ query }: any) => {
      const warehousing = mockWarehousings.find((w) => w.id === query.id);
      if (warehousing) {
        // 模拟同步物流系统数据
        warehousing.actualDate = new Date().toISOString().split('T')[0];
        warehousing.status = 'completed';
        warehousing.updatedAt = new Date().toISOString();
        return {
          code: 200,
          message: '同步成功',
          data: warehousing
        };
      }
      return {
        code: 404,
        message: '集货信息不存在'
      };
    }
  }
] as MockMethod[];
