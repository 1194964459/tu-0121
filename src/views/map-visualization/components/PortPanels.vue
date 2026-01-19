<template>
  <div class="port-panels-wrapper" :data-ready="isReady">
    <!-- 武汉港信息面板 -->
    <template v-if="currentTimeIndex <= 1">
      <!-- 初始停在武汉港：展示业务信息、物流信息 -->
      <template v-if="currentTimeIndex === 0 && !isSailing">
        <div v-if="showInfoPanels.wuhan.left" ref="wuhanLeftPanelRef" class="single-panel wuhan-left">
          <InfoPanel 
            title="业务信息" 
            type="left" 
            closable 
            @close="togglePanel('wuhan', 'left')"
          >
            <div class="info-item"><span class="label">订单号：</span><span class="value">A0001</span></div>
            <div class="info-item"><span class="label">钢厂：</span><span class="value">武汉钢厂</span></div>
            <div class="info-item"><span class="label">预准发号：</span><span class="value">A10001</span></div>
            <div class="info-item"><span class="label">预准发数量：</span><span class="value">100T，目的地上海</span></div>
          </InfoPanel>
        </div>
        
        <div v-if="showInfoPanels.wuhan.right" ref="wuhanRightPanelRef" class="single-panel wuhan-right">
          <InfoPanel 
            title="物流信息" 
            type="right" 
            closable 
            @close="togglePanel('wuhan', 'right')"
          >
            <div class="info-item"><span class="label">船名：</span><span class="value">武汉1号</span></div>
            <div class="info-item"><span class="label">吨数：</span><span class="value">120T</span></div>
            <div class="info-item"><span class="label">预计抵达时间：</span><span class="value">1月16日12点</span></div>
          </InfoPanel>
        </div>
      </template>
      
      <!-- 从武汉向马鞍山航行中：展示武汉航行信息 -->
      <div 
        v-if="currentTimeIndex === 1 && isSailing && showInfoPanels.wuhan.sailing" 
        ref="wuhanPanelRef" 
        class="single-panel wuhan-merged"
      >
        <InfoPanel 
          title="航行信息" 
          type="merged" 
          merged 
          closable
          @close="togglePanel('wuhan', 'sailing')"
        >
          <div class="info-item"><span class="label">排船计划号：</span><span class="value">B0001</span></div>
          <div class="info-item"><span class="label">船名：</span><span class="value">武汉1号</span></div>
          <div class="info-item"><span class="label">预计抵达时间：</span><span class="value">1月16日12时</span></div>
          <div class="info-item"><span class="label">预计装货吨位：</span><span class="value">100吨</span></div>
          <div class="info-item"><span class="label">关联预准发号：</span><span class="value">A10001</span></div>
        </InfoPanel>
      </div>
    </template>

    <!-- 马鞍山港信息面板 -->
    <template v-if="currentTimeIndex >= 1 && currentTimeIndex <= 2">
      <!-- 到达马鞍山港：展示业务信息、物流信息 -->
      <template v-if="currentTimeIndex === 1 && !isSailing">
        <div v-if="showInfoPanels.maanshan.left" ref="maanshanLeftPanelRef" class="single-panel maanshan-left">
          <InfoPanel 
            title="业务信息" 
            type="left" 
            closable 
            @close="togglePanel('maanshan', 'left')"
          >
            <div class="info-item"><span class="label">母船批号：</span><span class="value">C0001</span></div>
            <div class="info-item"><span class="label">船名：</span><span class="value">武汉1号</span></div>
            <div class="info-item"><span class="label">发货时间：</span><span class="value">1月16日16时</span></div>
            <div class="info-item"><span class="label">装货吨位：</span><span class="value">102吨 目的地上海</span></div>
            <div class="info-item"><span class="label">关联预准发号：</span><span class="value">A10001</span></div>
          </InfoPanel>
        </div>
        
        <div v-if="showInfoPanels.maanshan.right" ref="maanshanRightPanelRef" class="single-panel maanshan-right">
          <InfoPanel 
            title="物流信息" 
            type="right" 
            closable 
            @close="togglePanel('maanshan', 'right')"
          >
            <div class="info-item"><span class="label">排船计划号：</span><span class="value">F0001</span></div>
            <div class="info-item"><span class="label">船名：</span><span class="value">武汉1号</span></div>
            <div class="info-item"><span class="label">预计抵达时间：</span><span class="value">1月19日12时</span></div>
            <div class="info-item"><span class="label">预计装货吨位：</span><span class="value">300吨</span></div>
            <div class="info-item"><span class="label">关联预准发号：</span><span class="value">E10001</span></div>
          </InfoPanel>
        </div>
      </template>
      
      <!-- 从马鞍山向上海航行中：展示马鞍山航行信息 -->
      <div 
        v-if="currentTimeIndex === 2 && isSailing && showInfoPanels.maanshan.sailing" 
        ref="maanshanPanelRef" 
        class="single-panel maanshan-merged"
      >
        <InfoPanel 
          title="航行信息" 
          type="merged" 
          merged
          closable
          @close="togglePanel('maanshan', 'sailing')"
        >
          <div class="info-item"><span class="label">子船批号：</span><span class="value">S001</span></div>
          <div class="info-item"><span class="label">船名：</span><span class="value">武汉1号</span></div>
          <div class="info-item"><span class="label">预计到货时间：</span><span class="value">1月20日12点</span></div>
          <div class="info-item"><span class="label">装货吨位：</span><span class="value">402吨 目的地上海</span></div>
          <div class="info-item"><span class="label">关联母船批号：</span><span class="value">C0001、G0001</span></div>
        </InfoPanel>
      </div>
    </template>

    <!-- 上海港信息面板：仅在到达上海后展示 -->
    <div v-if="currentTimeIndex === 2 && !isSailing" ref="shanghaiPanelRef" class="single-panel shanghai">
      <InfoPanel title="港口信息" type="single">
        <div class="info-item"><span class="label">子船批号：</span><span class="value">S001</span></div>
        <div class="info-item"><span class="label">船名：</span><span class="value">武汉1号</span></div>
        <div class="info-item"><span class="label">卸货时间：</span><span class="value">1月20日8点</span></div>
        <div class="info-item"><span class="label">港口实收库存：</span><span class="value">402吨/15件</span></div>
      </InfoPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InfoPanel from './InfoPanel.vue';

defineProps<{
  currentTimeIndex: number;
  isReady?: boolean;
  isSailing?: boolean;
}>();

const wuhanLeftPanelRef = ref<HTMLDivElement | null>(null);
const wuhanRightPanelRef = ref<HTMLDivElement | null>(null);
const wuhanPanelRef = ref<HTMLDivElement | null>(null);
const maanshanLeftPanelRef = ref<HTMLDivElement | null>(null);
const maanshanRightPanelRef = ref<HTMLDivElement | null>(null);
const maanshanPanelRef = ref<HTMLDivElement | null>(null);
const shanghaiPanelRef = ref<HTMLDivElement | null>(null);

const showInfoPanels = ref({
  wuhan: { left: true, right: true, sailing: true },
  maanshan: { left: true, right: true, sailing: true }
});

const togglePanel = (port: 'wuhan' | 'maanshan', side: 'left' | 'right' | 'sailing') => {
  showInfoPanels.value[port][side] = false;
};

defineExpose({
  wuhanLeftPanel: wuhanLeftPanelRef,
  wuhanRightPanel: wuhanRightPanelRef,
  wuhanPanel: wuhanPanelRef,
  maanshanLeftPanel: maanshanLeftPanelRef,
  maanshanRightPanel: maanshanRightPanelRef,
  maanshanPanel: maanshanPanelRef,
  shanghaiPanel: shanghaiPanelRef
});
</script>

<style scoped lang="scss">
.port-panels-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0s linear 0.3s;
}

.port-panels-wrapper[data-ready="true"] {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in-out, visibility 0s linear 0s;
}

.single-panel {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
  transform: translate(-9999px, -9999px); /* 初始位置在屏幕外，防止闪现 */
  transition: none; /* 不需要过渡动画，位置由 JS 直接设置 */
}

.info-item {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  line-height: 1.4;
  
  // 移动端适配
  @media (max-width: 768px) {
    margin-bottom: 5px; // 从6px减少到5px
    gap: 6px; // 从4px增加到6px，更好地区分label和value
    flex-direction: column;
    line-height: 1.3;
  }
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: #666;
  font-size: 12px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 10px; // 从11px减小到10px
    white-space: normal; // 允许换行，适应更窄的宽度
  }
}

.info-item .value {
  color: #333;
  font-size: 12px;
  font-weight: 500;
  text-align: right;
  
  @media (max-width: 768px) {
    font-size: 10px; // 从11px减小到10px
    text-align: left;
    word-break: break-all; // 允许长文本换行
  }
}
</style>
