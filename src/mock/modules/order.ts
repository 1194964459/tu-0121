/**
 * 订单Mock数据
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { Order, CreateOrderParams } from '@/types';

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: 'ORD202401001',
    customerName: '上海钢铁贸易公司',
    productName: '热轧卷板',
    productType: 'HRC',
    quantity: 5000,
    unit: '吨',
    price: 3800,
    totalAmount: 19000000,
    status: 'confirmed',
    orderDate: '2024-01-15',
    deliveryDate: '2024-03-15',
    tradeSystemRef: 'TRADE-2024-001',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'ORD202401002',
    customerName: '江苏建材集团',
    productName: '冷轧卷板',
    productType: 'CRC',
    quantity: 3000,
    unit: '吨',
    price: 4200,
    totalAmount: 12600000,
    status: 'producing',
    orderDate: '2024-01-20',
    deliveryDate: '2024-03-20',
    tradeSystemRef: 'TRADE-2024-002',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 'ORD202401003',
    customerName: '广东金属材料公司',
    productName: '中厚板',
    productType: 'PLATE',
    quantity: 8000,
    unit: '吨',
    price: 3900,
    totalAmount: 31200000,
    status: 'warehousing',
    orderDate: '2024-01-10',
    deliveryDate: '2024-03-10',
    tradeSystemRef: 'TRADE-2024-003',
    createdAt: '2024-01-10T07:00:00Z',
    updatedAt: '2024-02-15T14:00:00Z'
  }
];

export default [
  {
    url: '/api/orders',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, status, customerName } = query;
      let filteredOrders = [...mockOrders];

      if (status) {
        filteredOrders = filteredOrders.filter((o) => o.status === status);
      }
      if (customerName) {
        filteredOrders = filteredOrders.filter((o) => o.customerName.includes(customerName));
      }

      const start = (Number(page) - 1) * Number(pageSize);
      const end = start + Number(pageSize);
      const list = filteredOrders.slice(start, end);

      return {
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: filteredOrders.length,
          page: Number(page),
          pageSize: Number(pageSize)
        }
      };
    }
  },
  {
    url: '/api/orders/:id',
    method: 'get',
    response: ({ query }: any) => {
      const order = mockOrders.find((o) => o.id === query.id);
      if (order) {
        return {
          code: 200,
          message: '获取成功',
          data: order
        };
      }
      return {
        code: 404,
        message: '订单不存在'
      };
    }
  },
  {
    url: '/api/orders',
    method: 'post',
    response: ({ body }: any) => {
      const params = body as CreateOrderParams;
      const newOrder: Order = {
        id: `ORD${Date.now()}`,
        ...params,
        totalAmount: params.quantity * params.price,
        status: 'pending',
        orderDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockOrders.push(newOrder);
      return {
        code: 200,
        message: '创建成功',
        data: newOrder
      };
    }
  },
  {
    url: '/api/orders/:id',
    method: 'put',
    response: ({ query, body }: any) => {
      const index = mockOrders.findIndex((o) => o.id === query.id);
      if (index !== -1) {
        mockOrders[index] = {
          ...mockOrders[index],
          ...body,
          updatedAt: new Date().toISOString()
        };
        return {
          code: 200,
          message: '更新成功',
          data: mockOrders[index]
        };
      }
      return {
        code: 404,
        message: '订单不存在'
      };
    }
  },
  {
    url: '/api/orders/:id/cancel',
    method: 'put',
    response: ({ query }: any) => {
      const index = mockOrders.findIndex((o) => o.id === query.id);
      if (index !== -1) {
        mockOrders[index] = {
          ...mockOrders[index],
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        };
        return {
          code: 200,
          message: '取消成功',
          data: mockOrders[index]
        };
      }
      return {
        code: 404,
        message: '订单不存在'
      };
    }
  }
] as MockMethod[];
