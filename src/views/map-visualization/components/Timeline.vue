<template>
  <div class="timeline-container">
    <div class="timeline-wrapper">
      <div style="width: 65px; margin-top: -6px;">时间轴：</div>
      <a-steps
        :current="modelValue"
        @change="handleStepChange"
        size="small"
        progress-dot
        class="custom-steps"
      >
        <a-step
          v-for="(node, index) in nodes"
          :key="index"
          :title="node.label"
          :status="getStepStatus(index)"
          :disabled="isStepDisabled(index)"
          class="clickable-step"
        />
      </a-steps>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Steps as ASteps, Step as AStep } from 'ant-design-vue';
import type { TimelineNode } from '../constants';

const props = defineProps<{
  nodes: TimelineNode[];
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void;
}>();

// 判断步骤是否禁用：只有当前及之前的节点完成，或者紧邻的下一个节点才可点击
const isStepDisabled = (index: number) => {
  return index > props.modelValue + 1;
};

const handleStepChange = (val: number) => {
  if (!isStepDisabled(val)) {
    emit('update:modelValue', val);
  }
};

// 根据当前索引决定每个节点的状态
const getStepStatus = (index: number) => {
  if (index < props.modelValue) {
    return 'finish'; // 已完成
  } else if (index === props.modelValue) {
    return 'process'; // 进行中
  } else {
    return 'wait'; // 待执行
  }
};
</script>

<style scoped lang="scss">
.timeline-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  z-index: 100;
  width: 100%;
  pointer-events: none;
}

.timeline-wrapper {
    display: flex;
  background: rgba(255, 255, 255, 0.9);
  padding: 30px 20px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  min-width: 500px;
  max-width: 80%;
}

.custom-steps {
  :deep(.ant-steps-item-container) {
    cursor: pointer;
  }
}

.clickable-step {
  cursor: pointer;
}
</style>
