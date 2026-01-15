<template>
  <div class="tracking-page">
    <a-card title="全链路流程追踪" :bordered="false">
      <a-spin :spinning="loading">
        <div v-if="tracking" class="tracking-content">
          <!-- 订单信息 -->
          <div class="order-info">
            <h3>订单信息</h3>
            <a-descriptions :column="4" bordered>
              <a-descriptions-item label="订单编号">{{ tracking.orderNo }}</a-descriptions-item>
              <a-descriptions-item label="当前步骤">{{ tracking.currentStep }} / {{ tracking.totalSteps }}</a-descriptions-item>
              <a-descriptions-item label="完成进度">{{ tracking.progress }}%</a-descriptions-item>
              <a-descriptions-item label="预计完成日期">{{ tracking.estimatedCompletionDate || '-' }}</a-descriptions-item>
            </a-descriptions>
          </div>

          <!-- 流程节点 -->
          <div class="process-nodes" style="margin-top: 24px">
            <h3>流程节点</h3>
            <a-steps :current="tracking.currentStep - 1" :items="stepItems" />
          </div>

          <!-- 时间线 -->
          <div class="timeline-section" style="margin-top: 24px" v-if="timeline.length > 0">
            <h3>操作时间线</h3>
            <a-timeline>
              <a-timeline-item
                v-for="item in timeline"
                :key="item.id"
                :color="getTimelineColor(item.status)"
              >
                <template #dot>
                  <component :is="getTimelineIcon(item.status)" />
                </template>
                <div class="timeline-item">
                  <div class="timeline-title">{{ item.title }}</div>
                  <div class="timeline-description">{{ item.description }}</div>
                  <div class="timeline-meta">
                    <span>{{ item.participant }}</span>
                    <span style="margin-left: 16px">{{ formatDateTime(item.timestamp) }}</span>
                  </div>
                </div>
              </a-timeline-item>
            </a-timeline>
          </div>
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { trackingApi } from '@/services';
import type { ProcessTracking, TimelineItem } from '@/types';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';

const route = useRoute();

const loading = ref(false);
const tracking = ref<ProcessTracking | null>(null);
const timeline = ref<TimelineItem[]>([]);

const orderId = computed(() => route.params.id as string);

// 步骤项
const stepItems = computed(() => {
  if (!tracking.value) return [];
  return tracking.value.nodes.map((node) => ({
    title: node.name,
    description: node.participant,
    status: getStepStatus(node.status)
  }));
});

// 获取步骤状态
function getStepStatus(status: string) {
  const statusMap: Record<string, 'wait' | 'process' | 'finish' | 'error'> = {
    pending: 'wait',
    in_progress: 'process',
    completed: 'finish',
    error: 'error'
  };
  return statusMap[status] || 'wait';
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

// 获取时间线图标
function getTimelineIcon(status: string) {
  const iconMap: Record<string, any> = {
    success: CheckCircleOutlined,
    warning: ClockCircleOutlined,
    error: CloseCircleOutlined,
    info: InfoCircleOutlined
  };
  return iconMap[status] || InfoCircleOutlined;
}

// 格式化日期时间
function formatDateTime(dateTime: string): string {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

// 获取追踪信息
async function fetchTracking() {
  if (!orderId.value) return;
  
  loading.value = true;
  try {
    const [trackingRes, timelineRes]: any[] = await Promise.all([
      trackingApi.getProcessTracking(orderId.value),
      trackingApi.getTimeline({ orderId: orderId.value })
    ]);

    if (trackingRes.code === 200) {
      tracking.value = trackingRes.data;
    }
    if (timelineRes.code === 200) {
      timeline.value = timelineRes.data;
    }
  } catch (error) {
    console.error('获取追踪信息失败', error);
    message.error('获取追踪信息失败');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchTracking();
});
</script>

<style scoped lang="scss">
.tracking-page {
  .tracking-content {
    .order-info {
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .process-nodes {
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .timeline-section {
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 600;
      }

      .timeline-item {
        .timeline-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .timeline-description {
          color: #666;
          margin-bottom: 8px;
        }

        .timeline-meta {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>
