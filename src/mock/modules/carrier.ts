/**
 * 承运商Mock数据
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { Carrier } from '@/types';

const mockCarriers: Carrier[] = [
  {
    id: 'CAR001',
    name: '长江航运有限公司',
    contactPerson: '张经理',
    contactPhone: '13800138001',
    licenseNo: 'CAR-LIC-001',
    status: 'available',
    rating: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'CAR002',
    name: '上海海运集团',
    contactPerson: '李经理',
    contactPhone: '13800138002',
    licenseNo: 'CAR-LIC-002',
    status: 'available',
    rating: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'CAR003',
    name: '江苏水运物流公司',
    contactPerson: '王经理',
    contactPhone: '13800138003',
    licenseNo: 'CAR-LIC-003',
    status: 'transporting',
    rating: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export default [
  {
    url: '/api/carriers',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, status, name } = query;
      let filtered = [...mockCarriers];

      if (status) {
        filtered = filtered.filter((c) => c.status === status);
      }
      if (name) {
        filtered = filtered.filter((c) => c.name.includes(name));
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
    url: '/api/carriers/:id',
    method: 'get',
    response: ({ query }: any) => {
      const carrier = mockCarriers.find((c) => c.id === query.id);
      if (carrier) {
        return {
          code: 200,
          message: '获取成功',
          data: carrier
        };
      }
      return {
        code: 404,
        message: '承运商不存在'
      };
    }
  },
  {
    url: '/api/carriers/sync',
    method: 'post',
    response: () => {
      // 模拟同步承运商系统数据
      return {
        code: 200,
        message: '同步成功',
        data: { synced: mockCarriers.length }
      };
    }
  }
] as MockMethod[];
