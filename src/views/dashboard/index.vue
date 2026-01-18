<template>
  <div class="dashboard-page">
    <a-row :gutter="16" style="margin-bottom: 16px">
      <!-- 统计数据 -->
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总订单数"
            :value="statistics.totalOrders"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <ShoppingOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="进行中订单"
            :value="statistics.activeOrders"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <SyncOutlined spin />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总数量（吨）"
            :value="statistics.totalQuantity"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <ContainerOutlined />
            </template>
            <template #suffix>
              <span>吨</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="在航船舶"
            :value="statistics.activeVessels"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <GlobalOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <!-- 订单列表 -->
      <a-col :span="16">
        <a-card title="最近订单" :bordered="false">
          <a-table
            :columns="orderColumns"
            :data-source="recentOrders"
            :loading="orderLoading"
            :pagination="false"
            size="small"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" size="small" @click="handleViewTracking(record)">查看追踪</a-button>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <!-- 时间线 -->
      <a-col :span="8">
        <a-card title="最新动态" :bordered="false">
          <a-timeline style="max-height: 400px; overflow-y: auto">
            <a-timeline-item
              v-for="item in timeline"
              :key="item.id"
              :color="getTimelineColor(item.status)"
            >
              <div class="timeline-item">
                <div class="timeline-title">{{ item.title }}</div>
                <div class="timeline-description">{{ item.description }}</div>
                <div class="timeline-meta">
                  {{ formatDateTime(item.timestamp) }}
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import {
  ShoppingOutlined,
  SyncOutlined,
  ContainerOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue';
import { orderApi, trackingApi } from '@/services';
import type { Order, Statistics, TimelineItem, OrderStatus } from '@/types';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter();

const statistics = reactive<Statistics>({
  totalOrders: 0,
  activeOrders: 0,
  completedOrders: 0,
  totalQuantity: 0,
  inTransitQuantity: 0,
  totalVessels: 0,
  activeVessels: 0,
  totalCarriers: 0,
  activeCarriers: 0
});

const orderLoading = ref(false);
const recentOrders = ref<Order[]>([]);
const timeline = ref<TimelineItem[]>([]);

const orderColumns = [
  {
    title: '订单编号',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    key: 'customerName'
  },
  {
    title: '数量',
    key: 'quantity',
    customRender: ({ record }: { record: Order }) => `${record.quantity} ${record.unit}`
  },
  {
    title: '状态',
    key: 'status'
  },
  {
    title: '操作',
    key: 'action'
  }
];

// 获取统计数据
async function fetchStatistics() {
  try {
    const response: any = await trackingApi.getStatistics();
    if (response.code === 200) {
      Object.assign(statistics, response.data);
    }
  } catch (error) {
    console.error('获取统计数据失败', error);
  }
}

// 获取最近订单
async function fetchRecentOrders() {
  orderLoading.value = true;
  try {
    const response: any = await orderApi.getOrders({ page: 1, pageSize: 5 });
    if (response.code === 200) {
      recentOrders.value = response.data.list;
    }
  } catch (error) {
    console.error('获取最近订单失败', error);
  } finally {
    orderLoading.value = false;
  }
}

// 获取时间线
async function fetchTimeline() {
  try {
    const response: any = await trackingApi.getTimeline({});
    if (response.code === 200) {
      timeline.value = response.data.slice(0, 10); // 只显示最近10条
    }
  } catch (error) {
    console.error('获取时间线失败', error);
  }
}

// 查看追踪
function handleViewTracking(record: Order) {
  router.push(`/tracking/${record.id}`);
}

// 获取状态颜色
function getStatusColor(status: OrderStatus): string {
  const colorMap: Record<OrderStatus, string> = {
    pending: 'default',
    confirmed: 'blue',
    producing: 'processing',
    warehousing: 'orange',
    transporting: 'cyan',
    shipped: 'purple',
    completed: 'success',
    cancelled: 'error'
  };
  return colorMap[status] || 'default';
}

// 获取状态文本
function getStatusText(status: OrderStatus): string {
  const textMap: Record<OrderStatus, string> = {
    pending: '待确认',
    confirmed: '已确认',
    producing: '生产中',
    warehousing: '集货中',
    transporting: '运输中',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return textMap[status] || status;
}

// 获取时间线颜色
function getTimelineColor(status: string): string {
  const colorMap: Record<string, string> = {
    success: 'green',
    warning: 'orange',
    error: 'red',
    info: 'blue'
  };
  return colorMap[status] || 'blue';
}

// 格式化日期时间
function formatDateTime(dateTime: string): string {
  return dayjs(dateTime).format('MM-DD HH:mm');
}

onMounted(() => {
  fetchStatistics();
  fetchRecentOrders();
  fetchTimeline();

  // 定时刷新数据（生产环境使用Mock数据时，可以延长刷新间隔）
  const refreshInterval = import.meta.env.MODE === 'production' ? 60000 : 30000; // 生产环境60秒，开发环境30秒
  const interval = setInterval(() => {
    fetchStatistics();
    fetchRecentOrders();
    fetchTimeline();
  }, refreshInterval);

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<style scoped lang="scss">
.dashboard-page {
  .timeline-item {
    .timeline-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .timeline-description {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }

    .timeline-meta {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
