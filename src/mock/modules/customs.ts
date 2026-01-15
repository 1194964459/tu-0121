/**
 * 报关Mock数据
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { CustomsDeclaration } from '@/types';

const mockCustomsDeclarations: CustomsDeclaration[] = [
  {
    id: 'CUS202401001',
    orderId: 'ORD202401001',
    dispatchId: 'DISP202401001',
    declarationNo: 'CUS-DEC-2024-001',
    exporterName: '上海钢铁贸易公司',
    productName: '热轧卷板',
    productCode: 'HS72142000',
    quantity: 4800,
    unit: '吨',
    value: 18240000,
    destinationCountry: '美国',
    submitDate: '2024-02-27',
    reviewDate: '2024-02-28',
    clearanceDate: '2024-02-28',
    status: 'cleared',
    customsSystemRef: 'CUSTOMS-2024-001',
    remarks: '已放行',
    createdAt: '2024-02-27T08:00:00Z',
    updatedAt: '2024-02-28T16:00:00Z'
  }
];

export default [
  {
    url: '/api/customs/declarations',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, orderId, status } = query;
      let filtered = [...mockCustomsDeclarations];

      if (orderId) {
        filtered = filtered.filter((c) => c.orderId === orderId);
      }
      if (status) {
        filtered = filtered.filter((c) => c.status === status);
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
    url: '/api/customs/declarations/:id',
    method: 'get',
    response: ({ query }: any) => {
      const declaration = mockCustomsDeclarations.find((c) => c.id === query.id);
      if (declaration) {
        return {
          code: 200,
          message: '获取成功',
          data: declaration
        };
      }
      return {
        code: 404,
        message: '报关单不存在'
      };
    }
  },
  {
    url: '/api/customs/declarations',
    method: 'post',
    response: ({ body }: any) => {
      const newDeclaration: CustomsDeclaration = {
        id: `CUS${Date.now()}`,
        ...body,
        status: 'not_submitted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockCustomsDeclarations.push(newDeclaration);
      return {
        code: 200,
        message: '创建成功',
        data: newDeclaration
      };
    }
  },
  {
    url: '/api/customs/declarations/:id/submit',
    method: 'post',
    response: ({ query }: any) => {
      const declaration = mockCustomsDeclarations.find((c) => c.id === query.id);
      if (declaration) {
        declaration.status = 'submitted';
        declaration.submitDate = new Date().toISOString().split('T')[0];
        declaration.updatedAt = new Date().toISOString();
        return {
          code: 200,
          message: '提交成功',
          data: declaration
        };
      }
      return {
        code: 404,
        message: '报关单不存在'
      };
    }
  },
  {
    url: '/api/customs/declarations/:id/sync',
    method: 'post',
    response: ({ query }: any) => {
      const declaration = mockCustomsDeclarations.find((c) => c.id === query.id);
      if (declaration) {
        // 模拟同步海关系统数据
        declaration.status = 'approved';
        declaration.reviewDate = new Date().toISOString().split('T')[0];
        declaration.clearanceDate = new Date().toISOString().split('T')[0];
        declaration.updatedAt = new Date().toISOString();
        return {
          code: 200,
          message: '同步成功',
          data: declaration
        };
      }
      return {
        code: 404,
        message: '报关单不存在'
      };
    }
  }
] as MockMethod[];
