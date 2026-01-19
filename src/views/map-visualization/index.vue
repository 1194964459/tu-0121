<template>
  <div class="map-visualization">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container"></div>
    
    <!-- 缩放级别显示 -->
    <div v-if="isMapLoaded" class="zoom-level-display">
      <span class="zoom-label">缩放级别:</span>
      <span class="zoom-value">{{ currentZoom.toFixed(1) }}</span>
    </div>
    
    <!-- 时间轴 -->
    <Timeline :nodes="TIMELINE_NODES" v-model="currentTimeIndex" />
    
    <!-- 业务面板 - 地图加载完成后再显示 -->
    <PortPanels 
      v-if="isMapLoaded" 
      ref="portPanelsRef" 
      :current-time-index="currentTimeIndex"
      :is-ready="isPanelReady"
      :is-sailing="isSailing"
    />
  </div>
</template>


<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { throttle, debounce } from 'lodash-es';
import { PORTS, TIMELINE_NODES, ROUTE_PATH, MAANSHAN_INDEX, CHINA_BOUNDS, SHIP_ICON_CONTENT } from './constants';
import Timeline from './components/Timeline.vue';
import PortPanels from './components/PortPanels.vue';

const mapContainer = ref<HTMLDivElement | null>(null);
const portPanelsRef = ref<any>(null);
const currentTimeIndex = ref(0);
const isMapLoaded = ref(false); // 地图加载状态
const isPanelReady = ref(false); // 面板位置计算完成状态
const isSailing = ref(false); // 是否正在航行中
const currentZoom = ref(7.3); // 当前缩放级别

// 使用 shallowRef 减少 Vue 对 AMap 实例的响应式追踪，提升性能
const map = shallowRef<any>(null);
const satelliteLayer = shallowRef<any>(null);
const routePolyline = shallowRef<any>(null);
const shipMarker = shallowRef<any>(null);
let shipAnimationTimer: number | null = null; // 船只动画定时器

let animationFrameId: number | null = null;

// 扩展window对象类型
declare global {
  interface Window {
    AMap: any;
  }
}

// 监听时间索引变化，增加防抖控制，避免频繁切换导致的计算压力
const debouncedSelectTimeNode = debounce((newIndex: number, oldIndex: number) => {
  // 切换时先隐藏面板，避免位置跳变
  isPanelReady.value = false;
  selectTimeNode(newIndex, oldIndex);
}, 100);

watch(currentTimeIndex, (newVal, oldVal) => {
  debouncedSelectTimeNode(newVal, oldVal);
});

// 使用 requestAnimationFrame 优化面板位置更新，减少主线程压力
const requestPanelUpdate = () => {
  if (animationFrameId) return;
  animationFrameId = requestAnimationFrame(() => {
    updatePanelPositions();
    animationFrameId = null;
  });
};

// 为 moveend 和 zoomend 事件增加节流，确保在操作结束时有一次准确的更新，但不至于过于频繁
const throttledUpdatePanelPositions = throttle(() => {
  updatePanelPositions();
}, 100);

// 窗口大小变化防抖
const handleResize = debounce(() => {
  updatePanelPositions();
}, 200);

// 更新缩放级别
const updateZoomLevel = () => {
  if (!map.value) return;
  currentZoom.value = map.value.getZoom();
};

// 初始化地图
const initMap = () => {
  if (!mapContainer.value) return;
  
  // 检查是否已经加载过脚本
  if (window.AMap) {
    doInitMap();
    return;
  }

  const scriptId = 'amap-script';
  if (document.getElementById(scriptId)) return;
  
  const script = document.createElement('script');
  script.id = scriptId;
  const amapKey = '8940d994cb3eeea3ae13fb33c34c0fd9';
  script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}&plugin=AMap.ToolBar`;
  script.onload = () => {
    doInitMap();
  };
  document.body.appendChild(script);
};

const doInitMap = () => {
  if (!window.AMap || !mapContainer.value) return;
  
  try {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const initialZoom = isMobile ? 6.5 : 7.3; // 移动端使用较小的缩放级别
    
    // 1. 优先初始化基础地图，提升首屏响应速度
    map.value = new window.AMap.Map(mapContainer.value, {
      center: [PORTS[0].lng, PORTS[0].lat],
      zoom: initialZoom,
      zooms: [4, 18], // 限制缩放级别，避免无效渲染
      mapStyle: 'amap://styles/normal',
      features: ['bg', 'point'], // 仅保留背景和点，减少矢量底图渲染压力
      touchZoom: true, // 支持触摸缩放
      doubleClickZoom: true, // 支持双击缩放
      dragEnable: true // 支持拖拽
    });
        
    // 限制地图显示范围在中国区域
    const bounds = new window.AMap.Bounds(CHINA_BOUNDS[0], CHINA_BOUNDS[1]);
    map.value.setLimitBounds(bounds);
        
    // 监听地图移动和缩放，使用 requestAnimationFrame 保持平滑
    map.value.on('mapmove', requestPanelUpdate);
    map.value.on('zoom', () => {
      requestPanelUpdate();
      updateZoomLevel();
    });
    map.value.on('moveend', throttledUpdatePanelPositions);
    map.value.on('zoomend', () => {
      throttledUpdatePanelPositions();
      updateZoomLevel();
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 2. 延迟加载非核心资源和覆盖物，避免初始化时阻塞
    setTimeout(() => {
      if (!map.value) return;
      
      // 加载卫星图层
      satelliteLayer.value = new window.AMap.TileLayer.Satellite();
      satelliteLayer.value.setMap(map.value);
      
      // 添加工具栏
      map.value.addControl(new window.AMap.ToolBar());
      
      // 批量初始化覆盖物
      initPortMarkers();
      initRoute();
      initShipMarker();
      
      // 地图加载完成，启用面板显示
      isMapLoaded.value = true;
      
      // 初始化缩放级别
      updateZoomLevel();
      
      // 设置初始状态并等待面板渲染和位置计算
      selectTimeNode(0, 0);
    }, 200);

  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

// 初始化港口标记
const initPortMarkers = () => {
  if (!map.value) return;
  PORTS.forEach(port => {
    new window.AMap.Marker({
      position: [port.lng, port.lat],
      title: port.name,
      map: map.value,
      // 使用自定义 HTML 内容放大图标
      content: `
        <div style="position: relative;">
          <svg viewBox="0 0 1024 1024" width="36" height="36">
            <path d="M512 0C312.64 0 151.04 161.6 151.04 360.96c0 101.12 48.64 190.72 122.88 252.16L512 1024l238.08-410.88c74.24-61.44 122.88-151.04 122.88-252.16C872.96 161.6 711.36 0 512 0z m0 544c-100.48 0-181.76-81.28-181.76-181.76s81.28-181.76 181.76-181.76 181.76 81.28 181.76 181.76-81.28 181.76-181.76 181.76z" fill="#ff4d4f"></path>
          </svg>
        </div>
      `,
      offset: new window.AMap.Pixel(-18, -36) // 偏移量调整为图标宽度的一半和高度的全长
    });
  });
};

// 初始化航线
const initRoute = () => {
  if (!map.value) return;
  routePolyline.value = new window.AMap.Polyline({
    path: ROUTE_PATH,
    strokeColor: '#0088FF',
    strokeWeight: 5,
    strokeStyle: 'solid',
    map: map.value,
    lineJoin: 'round',
    lineCap: 'round'
  });
};

// 初始化船只标记
const initShipMarker = () => {
  if (!map.value) return;
  
  shipMarker.value = new window.AMap.Marker({
    position: [PORTS[0].lng, PORTS[0].lat],
    content: SHIP_ICON_CONTENT,
    map: map.value,
    offset: new window.AMap.Pixel(-24, -24),
    zIndex: 200 // 设置较高的 z-index 确保船只在最上层
  });
  
  console.log('船只 Marker 初始化完成:', shipMarker.value);
};

// 选择时间节点
const selectTimeNode = (index: number, oldIndex: number = 0) => {
  if (!map.value) return;
  const port = PORTS[TIMELINE_NODES[index].portIndex];
  
  // 检测移动设备，使用适合的缩放级别
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  const targetZoom = isMobile ? 6.5 : 7.3;
  
  map.value.setCenter([port.lng, port.lat]);
  map.value.setZoom(targetZoom);
  updateShipPosition(index, oldIndex);
  
  // 等待地图移动完成后再计算面板位置并显示
  setTimeout(async () => {
    // 等待 Vue 完成 DOM 更新（新面板渲染完成）
    await nextTick();
    
    // 计算所有面板的正确位置
    updatePanelPositions();
    
    // 再等待一帧，确保 transform 已应用
    await nextTick();
    
    // 只有在非航行状态（即到达目的地）时，才在这里显示面板
    // 航行状态下的面板显示逻辑由 updateShipPosition 控制
    if (!isSailing.value) {
      isPanelReady.value = true;
    }
  }, 300); // 等待地图动画完成
};

// 更新航线显示
const updateRouteDisplay = (currentPathIndex: number = -1) => {
  if (!map.value) return;
  
  // 清理旧航线
  if (routePolyline.value) {
    if (Array.isArray(routePolyline.value)) {
      routePolyline.value.forEach(p => p.setMap(null));
    } else {
      routePolyline.value.setMap(null);
    }
  }

  // 计算当前航行到的全局索引
  // 如果没有传入具体索引，则根据 currentTimeIndex 估算一个静态位置
  let globalPathIdx = currentPathIndex;
  if (globalPathIdx === -1) {
    const portIdx = TIMELINE_NODES[currentTimeIndex.value].portIndex;
    if (portIdx === 0) globalPathIdx = 0;
    else if (portIdx === 1) globalPathIdx = MAANSHAN_INDEX;
    else if (portIdx === 2) globalPathIdx = ROUTE_PATH.length - 1;
  }

  // 1. 创建已航行路段 (深红色虚线)
  const sailedPath = ROUTE_PATH.slice(0, globalPathIdx + 1);
  const sailedRoute = new window.AMap.Polyline({
    path: sailedPath,
    strokeColor: '#B71C1C', // 深红色
    strokeWeight: 5,
    strokeStyle: 'dashed', // 虚线
    map: map.value,
    lineJoin: 'round',
    lineCap: 'round',
    zIndex: 50
  });

  // 2. 创建未航行路段 (蓝色)
  const remainingPath = ROUTE_PATH.slice(globalPathIdx);
  const remainingRoute = new window.AMap.Polyline({
    path: remainingPath,
    strokeColor: '#0088FF', // 蓝色
    strokeWeight: 5,
    strokeStyle: 'solid',
    map: map.value,
    lineJoin: 'round',
    lineCap: 'round',
    zIndex: 40
  });

  routePolyline.value = [sailedRoute, remainingRoute];
};

// 获取港口在航线采样点中的索引
const getPortRouteIndex = (portIdx: number) => {
  if (portIdx === 0) return 0;
  if (portIdx === 1) return MAANSHAN_INDEX;
  if (portIdx === 2) return ROUTE_PATH.length - 1;
  return 0;
};

// 更新船只位置
const updateShipPosition = (newIndex: number, oldIndex: number) => {
  if (!shipMarker.value) {
    console.log('shipMarker 不存在');
    return;
  }
  
  // 清除之前的动画
  if (shipAnimationTimer) {
    clearInterval(shipAnimationTimer);
    shipAnimationTimer = null;
  }
  
  const startPortIdx = TIMELINE_NODES[oldIndex].portIndex;
  const endPortIdx = TIMELINE_NODES[newIndex].portIndex;
  
  const startIdx = getPortRouteIndex(startPortIdx);
  const endIdx = getPortRouteIndex(endPortIdx);

  // 在动画开始前，立即更新一次航线显示，确保从上一个位置开始，防止颜色跳变
  updateRouteDisplay(startIdx);

  console.log(`更新船只位置：从节点 ${oldIndex} 到 ${newIndex}，路径索引从 ${startIdx} 到 ${endIdx}`);
  
  let targetPath: any[];
  
  if (startIdx <= endIdx) {
    // 正常顺序或原地
    targetPath = ROUTE_PATH.slice(startIdx, endIdx + 1);
  } else {
    // 后退时，直接跳转或反向移动（这里选择直接跳转到目标点）
    targetPath = [ROUTE_PATH[endIdx]];
  }
  
  console.log('targetPath 长度:', targetPath.length);
  
  // 如果路径只有一个点，直接设置位置
  if (targetPath.length <= 1) {
    console.log('路径只有一个点，直接设置位置:', targetPath[0]);
    shipMarker.value.setPosition(targetPath[0]);
    isSailing.value = false;
    return;
  }
  
  // 动画开始
  isSailing.value = true;
  
  // 航行开始时立即计算一次位置并显示面板
  nextTick(() => {
    updatePanelPositions();
    isPanelReady.value = true;
  });
  
  // 动画参数
  let currentIndex = 0;
  const totalSteps = targetPath.length - 1;
  const duration = 5000; // 总时长 5 秒
  const interval = duration / totalSteps;
  
  console.log('开始船只动画，总步数:', totalSteps, '间隔:', interval, 'ms');
  
  // 设置初始位置
  shipMarker.value.setPosition(targetPath[0]);
  console.log('船只初始位置设置为:', targetPath[0]);
  
  // 创建动画 - 每次移动一个点
  shipAnimationTimer = window.setInterval(() => {
    currentIndex++;
    
    if (currentIndex >= targetPath.length) {
      console.log('船只动画完成，到达终点');
      isSailing.value = false;
      
      // 船只到达目的地后，重置为水平方向
      if (shipMarker.value && shipMarker.value.setAngle) {
        shipMarker.value.setAngle(0);
      }
      
      // 动画完成后，确保面板位置再次校准
      setTimeout(async () => {
        await nextTick();
        updatePanelPositions();
        await nextTick();
        isPanelReady.value = true;
      }, 50);
      
      if (shipAnimationTimer) {
        clearInterval(shipAnimationTimer);
        shipAnimationTimer = null;
      }
      return;
    }
    
    const nextPos = targetPath[currentIndex];
    if (shipMarker.value && shipMarker.value.setPosition) {
      shipMarker.value.setPosition(nextPos);
      
      // 航行中，实时更新航线颜色：已航行为红色，未航行位蓝色
      // 计算当前在全局 ROUTE_PATH 中的索引
      const globalPathIdx = startIdx + currentIndex;
      updateRouteDisplay(globalPathIdx);
      
      // 航行中，实时更新面板位置，使航行信息面板跟随小船
      updatePanelPositions();
      
      // 每 10 个点打印一次日志，避免过多日志
      if (currentIndex % 10 === 0) {
        console.log(`船只移动到第 ${currentIndex}/${targetPath.length} 个点:`, nextPos);
      }
      
      // 计算船只旋转角度
      if (currentIndex > 0 && shipMarker.value.setAngle) {
        const prevPos = targetPath[currentIndex - 1];
        const angle = Math.atan2(nextPos[1] - prevPos[1], nextPos[0] - prevPos[0]) * 180 / Math.PI;
        shipMarker.value.setAngle(angle);
      }
    } else {
      console.error('船只 Marker 或 setPosition 方法不存在');
      if (shipAnimationTimer) {
        clearInterval(shipAnimationTimer);
        shipAnimationTimer = null;
      }
    }
  }, interval);
};

// 更新面板位置
const updatePanelPositions = () => {
  if (!map.value || !portPanelsRef.value) return;
  
  const { 
    wuhanLeftPanel, wuhanRightPanel, wuhanPanel,
    maanshanLeftPanel, maanshanRightPanel, maanshanPanel,
    shanghaiPanel 
  } = portPanelsRef.value;
  
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  // 边界检测：确保面板不超出屏幕
  const clampPosition = (x: number, y: number, panelWidth: number, panelHeight: number = 200) => {
    const padding = 10; // 边距
    const maxX = window.innerWidth - panelWidth - padding;
    const maxY = window.innerHeight - panelHeight - padding;
    
    return {
      x: Math.max(padding, Math.min(x, maxX)),
      y: Math.max(padding, Math.min(y, maxY))
    };
  };
  
  // 业务面板（left）在港口左侧
  const updateLeftPanel = (panel: HTMLElement | null, portIdx: number) => {
    if (panel) {
      const port = PORTS[portIdx];
      const pos = map.value.lngLatToContainer([port.lng, port.lat]);
      // 移动端使用更小的偏移量
      const panelWidth = isMobile ? 120 : 200; // 更新为140px
      const xOffset = isMobile ? -160 : -240; // 调整偏移量为面板宽度的一半
      const yOffset = isMobile ? -80 : -80; // 移动端增加垂直偏移，避免遮挡小船
      
      const clamped = clampPosition(pos.x + xOffset, pos.y + yOffset, panelWidth);
      panel.style.transform = `translate(${clamped.x}px, ${clamped.y}px)`;
    }
  };
  
  // 物流面板（right）在港口右侧
  const updateRightPanel = (panel: HTMLElement | null, portIdx: number) => {
    if (panel) {
      const port = PORTS[portIdx];
      const pos = map.value.lngLatToContainer([port.lng, port.lat]);
      // 移动端使用更小的偏移量
      const panelWidth = isMobile ? 120 : 200; // 更新为140px
      const xOffset = isMobile ? 40 : 50;
      const yOffset = isMobile ? -100 : -80; // 移动端增加垂直偏移，避免遮挡小船
      
      const clamped = clampPosition(pos.x + xOffset, pos.y + yOffset, panelWidth);
      panel.style.transform = `translate(${clamped.x}px, ${clamped.y}px)`;
    }
  };
  
  // 合并面板和单独面板（航行中跟随船只，到达后固定在港口）
  const updateCenterPanel = (panel: HTMLElement | null, portIdx: number, followShip: boolean = false) => {
    if (panel) {
      let position;
      if (followShip && shipMarker.value) {
        // 如果是航行中，获取船只当前经纬度
        const lngLat = shipMarker.value.getPosition();
        position = [lngLat.lng, lngLat.lat];
      } else {
        // 否则使用港口坐标
        const port = PORTS[portIdx];
        position = [port.lng, port.lat];
      }
      
      const pos = map.value.lngLatToContainer(position);
      // 移动端调整偏移量，确保面板在屏幕可见区域
      const panelWidth = isMobile ? 160 : 240; // 更新为160px
      const xOffset = isMobile ? -50 : -120; // 调整偏移量为面板宽度的一半
      const yOffset = followShip 
        ? (isMobile ? -260 : -220)
        : (isMobile ? -260 : -200);
      
      const clamped = clampPosition(pos.x + xOffset, pos.y + yOffset, panelWidth);
      panel.style.transform = `translate(${clamped.x}px, ${clamped.y}px)`;
    }
  };
  
  // 武汉港面板
  updateLeftPanel(wuhanLeftPanel, 0);
  updateRightPanel(wuhanRightPanel, 0);
  // 武汉航行面板跟随船只
  updateCenterPanel(wuhanPanel, 0, isSailing.value && currentTimeIndex.value === 1);
  
  // 马鞍山港面板
  updateLeftPanel(maanshanLeftPanel, 1);
  updateRightPanel(maanshanRightPanel, 1);
  // 马鞍山航行面板跟随船只
  updateCenterPanel(maanshanPanel, 1, isSailing.value && currentTimeIndex.value === 2);
  
  // 上海港面板
  updateCenterPanel(shanghaiPanel, 2);
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (shipAnimationTimer) clearInterval(shipAnimationTimer);
  window.removeEventListener('resize', handleResize);
  debouncedSelectTimeNode.cancel();
  throttledUpdatePanelPositions.cancel();
  handleResize.cancel();
  if (map.value) map.value.destroy();
});
</script>


<style scoped lang="scss">
.map-visualization {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.zoom-level-display {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  // 移动端适配
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 12px;
  }
}

.zoom-label {
  color: #666;
  font-weight: 500;
}

.zoom-value {
  color: #1890ff;
  font-weight: 600;
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
}
</style>
