<template>
  <div class="order-page">
    <a-card title="订单管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="handleCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          新建订单
        </a-button>
      </template>

      <!-- 搜索表单 -->
      <a-form layout="inline" :model="searchForm" class="search-form">
        <a-form-item label="订单状态">
          <a-select v-model:value="searchForm.status" placeholder="请选择状态" allow-clear style="width: 150px">
            <a-select-option value="pending">待确认</a-select-option>
            <a-select-option value="confirmed">已确认</a-select-option>
            <a-select-option value="producing">生产中</a-select-option>
            <a-select-option value="warehousing">集货中</a-select-option>
            <a-select-option value="transporting">运输中</a-select-option>
            <a-select-option value="shipped">已发货</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="客户名称">
          <a-input v-model:value="searchForm.customerName" placeholder="请输入客户名称" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 订单列表 -->
      <a-table
        :columns="columns"
        :data-source="orders"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
        style="margin-top: 16px"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'totalAmount'">
            <span>¥{{ formatNumber(record.totalAmount) }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
              <a-button type="link" size="small" @click="handleTracking(record)">追踪</a-button>
              <a-button type="link" size="small" danger @click="handleCancel(record)" v-if="record.status === 'pending'">
                取消
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { orderApi } from '@/services';
import type { Order, OrderStatus } from '@/types';
import { useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(false);
const orders = ref<Order[]>([]);
const searchForm = reactive({
  status: undefined as string | undefined,
  customerName: undefined as string | undefined
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
});

const columns = [
  {
    title: '订单编号',
    dataIndex: 'id',
    key: 'id',
    width: 150
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    key: 'customerName',
    width: 200
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: 150
  },
  {
    title: '数量',
    key: 'quantity',
    width: 120,
    customRender: ({ record }: { record: Order }) => `${record.quantity} ${record.unit}`
  },
  {
    title: '总金额',
    key: 'totalAmount',
    width: 150
  },
  {
    title: '状态',
    key: 'status',
    width: 120
  },
  {
    title: '下单日期',
    dataIndex: 'orderDate',
    key: 'orderDate',
    width: 120
  },
  {
    title: '交货日期',
    dataIndex: 'deliveryDate',
    key: 'deliveryDate',
    width: 120
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
];

// 获取订单列表
async function fetchOrders() {
  loading.value = true;
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      status: searchForm.status,
      customerName: searchForm.customerName
    };
    const response: any = await orderApi.getOrders(params);
    if (response.code === 200) {
      orders.value = response.data.list;
      pagination.total = response.data.total;
    }
  } catch (error) {
    console.error('获取订单列表失败', error);
    message.error('获取订单列表失败');
  } finally {
    loading.value = false;
  }
}

// 搜索
function handleSearch() {
  pagination.current = 1;
  fetchOrders();
}

// 重置
function handleReset() {
  searchForm.status = undefined;
  searchForm.customerName = undefined;
  pagination.current = 1;
  fetchOrders();
}

// 表格变化
function handleTableChange(pag: any) {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchOrders();
}

// 新建订单
function handleCreate() {
  router.push('/order/create');
}

// 查看详情
function handleView(record: Order) {
  router.push(`/order/detail/${record.id}`);
}

// 全链路追踪
function handleTracking(record: Order) {
  router.push(`/tracking/${record.id}`);
}

// 取消订单
function handleCancel(record: Order) {
  Modal.confirm({
    title: '确认取消',
    content: `确定要取消订单 ${record.id} 吗？`,
    onOk: async () => {
      try {
        const response: any = await orderApi.cancelOrder(record.id);
        if (response.code === 200) {
          message.success('取消成功');
          fetchOrders();
        }
      } catch (error) {
        console.error('取消订单失败', error);
        message.error('取消订单失败');
      }
    }
  });
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

// 格式化数字
function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped lang="scss">
.order-page {
  .search-form {
    margin-bottom: 16px;
  }
}
</style>
