/**
 * 船舶Mock数据
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { Vessel, AISData } from '@/types';

const mockVessels: Vessel[] = [
  {
    id: 'VES001',
    name: '长江号',
    imoNumber: 'IMO1234567',
    carrierId: 'CAR001',
    carrierName: '长江航运有限公司',
    vesselType: 'river',
    capacity: 5000,
    currentLocation: '上海港',
    currentLongitude: 121.4737,
    currentLatitude: 31.2304,
    status: 'transit',
    aisSystemRef: 'AIS-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'VES002',
    name: '海运号',
    imoNumber: 'IMO2345678',
    carrierId: 'CAR002',
    carrierName: '上海海运集团',
    vesselType: 'ocean',
    capacity: 20000,
    currentLocation: '上海外高桥码头',
    currentLongitude: 121.5737,
    currentLatitude: 31.3504,
    status: 'loading',
    aisSystemRef: 'AIS-002',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

const mockAISData: Record<string, AISData[]> = {
  VES001: [
    {
      vesselId: 'VES001',
      vesselName: '长江号',
      longitude: 121.4737,
      latitude: 31.2304,
      speed: 12.5,
      course: 90,
      heading: 90,
      timestamp: new Date().toISOString()
    }
  ],
  VES002: [
    {
      vesselId: 'VES002',
      vesselName: '海运号',
      longitude: 121.5737,
      latitude: 31.3504,
      speed: 0,
      course: 0,
      heading: 0,
      timestamp: new Date().toISOString()
    }
  ]
};

export default [
  {
    url: '/api/vessels',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, pageSize = 10, carrierId, status, vesselType } = query;
      let filtered = [...mockVessels];

      if (carrierId) {
        filtered = filtered.filter((v) => v.carrierId === carrierId);
      }
      if (status) {
        filtered = filtered.filter((v) => v.status === status);
      }
      if (vesselType) {
        filtered = filtered.filter((v) => v.vesselType === vesselType);
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
    url: '/api/vessels/:id',
    method: 'get',
    response: ({ query }: any) => {
      const vessel = mockVessels.find((v) => v.id === query.id);
      if (vessel) {
        return {
          code: 200,
          message: '获取成功',
          data: vessel
        };
      }
      return {
        code: 404,
        message: '船舶不存在'
      };
    }
  },
  {
    url: '/api/vessels/:id/ais',
    method: 'get',
    response: ({ query }: any) => {
      const aisData = mockAISData[query.id] || [];
      return {
        code: 200,
        message: '获取成功',
        data: aisData
      };
    }
  },
  {
    url: '/api/vessels/ais/realtime',
    method: 'get',
    response: () => {
      const allAISData = Object.values(mockAISData).flat();
      return {
        code: 200,
        message: '获取成功',
        data: allAISData
      };
    }
  },
  {
    url: '/api/dispatches/:id/assign-vessel',
    method: 'post',
    response: ({ query, body }: any) => {
      const vessel = mockVessels.find((v) => v.id === body.vesselId);
      if (vessel) {
        return {
          code: 200,
          message: '分配成功',
          data: { dispatchId: query.id, vesselId: body.vesselId, vesselName: vessel.name }
        };
      }
      return {
        code: 404,
        message: '船舶不存在'
      };
    }
  },
  {
    url: '/api/vessels/ais/sync',
    method: 'post',
    response: () => {
      // 模拟同步AIS数据
      return {
        code: 200,
        message: '同步成功',
        data: { synced: Object.keys(mockAISData).length }
      };
    }
  }
] as MockMethod[];
