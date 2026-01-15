/**
 * 调度Mock数据
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { Dispatch } from '@/types';

const mockDispatches: Dispatch[] = [
  {
    id: 'DISP202401001',
    orderId: 'ORD202401001',
    warehousingId: 'WH202401001',
    carrierId: 'CAR001',
    carrierName: '长江航运有限公司',
    vesselId: 'VES001',
    vesselName: '长江号',
    transportType: 'river',
    quantity: 4800,
    origin: '上海港码头',
    destination: '上海外高桥码头',
    scheduledDepartureDate: '2024-02-25',
    actualDepartureDate: '2024-02-25',
    scheduledArrivalDate: '2024-02-26',
    actualArrivalDate: '2024-02-26',
    status: 'completed',
    carrierSystemRef: 'CAR-SYS-001',
    createdAt: '2024-02-22T08:00:00Z',
    updatedAt: '2024-02-26T16:00:00Z'
  }
];

export default [
  {
    url: '/api/dispatches',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, orderId, status } = query;
      let filtered = [...mockDispatches];

      if (orderId) {
        filtered = filtered.filter((d) => d.orderId === orderId);
      }
      if (status) {
        filtered = filtered.filter((d) => d.status === status);
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
    url: '/api/dispatches/:id',
    method: 'get',
    response: ({ query }: any) => {
      const dispatch = mockDispatches.find((d) => d.id === query.id);
      if (dispatch) {
        return {
          code: 200,
          message: '获取成功',
          data: dispatch
        };
      }
      return {
        code: 404,
        message: '调度信息不存在'
      };
    }
  },
  {
    url: '/api/dispatches',
    method: 'post',
    response: ({ body }: any) => {
      const newDispatch: Dispatch = {
        id: `DISP${Date.now()}`,
        ...body,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockDispatches.push(newDispatch);
      return {
        code: 200,
        message: '创建成功',
        data: newDispatch
      };
    }
  },
  {
    url: '/api/dispatches/:id/assign-carrier',
    method: 'post',
    response: ({ query, body }: any) => {
      const dispatch = mockDispatches.find((d) => d.id === query.id);
      if (dispatch) {
        dispatch.carrierId = body.carrierId;
        dispatch.carrierName = '长江航运有限公司'; // 模拟数据
        dispatch.status = 'carrier_assigned';
        dispatch.updatedAt = new Date().toISOString();
        return {
          code: 200,
          message: '分配成功',
          data: dispatch
        };
      }
      return {
        code: 404,
        message: '调度信息不存在'
      };
    }
  }
] as MockMethod[];
