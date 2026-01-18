<template>
  <div class="info-panel" :class="[type, { merged }]">
    <div class="panel-header">
      <h3>{{ title }}</h3>
      <a-button 
        v-if="closable" 
        type="text" 
        size="small"
        class="close-btn"
        @click="$emit('close')"
      >
        <CloseOutlined />
      </a-button>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button as AButton } from 'ant-design-vue';
import { CloseOutlined } from '@ant-design/icons-vue';

defineProps<{
  title: string;
  type?: 'left' | 'right' | 'merged' | 'single';
  closable?: boolean;
  merged?: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style scoped lang="scss">
.info-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 200px;
  overflow: hidden;
  pointer-events: auto;
}

.info-panel.merged {
  width: 240px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: color 0.3s;
  font-size: 12px;
  
  &:hover {
    color: #333;
  }
}

.panel-content {
  padding: 10px 12px;
}
</style>
