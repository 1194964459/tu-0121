/**
 * 物流供应链全链路管理系统 - 数据类型定义
 */

// ========== 订单相关 ==========
/** 订单状态 */
export type OrderStatus = 'pending' | 'confirmed' | 'producing' | 'warehousing' | 'transporting' | 'shipped' | 'completed' | 'cancelled';

/** 订单信息 */
export interface Order {
  id: string; // 订单编号
  customerName: string; // 客户名称
  productName: string; // 产品名称
  productType: string; // 产品类型
  quantity: number; // 数量（吨）
  unit: string; // 单位
  price: number; // 单价
  totalAmount: number; // 总金额
  status: OrderStatus; // 订单状态
  orderDate: string; // 下单日期
  deliveryDate: string; // 交货日期
  tradeSystemRef?: string; // 贸易系统关联号
  createdAt: string;
  updatedAt: string;
}

/** 创建订单参数 */
export interface CreateOrderParams {
  customerName: string;
  productName: string;
  productType: string;
  quantity: number;
  unit: string;
  price: number;
  deliveryDate: string;
}

// ========== 排产相关 ==========
/** 排产状态 */
export type ProductionStatus = 'planned' | 'producing' | 'completed' | 'delayed';

/** 排产计划 */
export interface ProductionPlan {
  id: string; // 排产编号
  orderId: string; // 关联订单ID
  factoryName: string; // 钢厂名称
  productType: string; // 产品类型
  plannedQuantity: number; // 计划产量（吨）
  actualQuantity?: number; // 实际产量（吨）
  plannedStartDate: string; // 计划开始日期
  plannedEndDate: string; // 计划结束日期
  actualStartDate?: string; // 实际开始日期
  actualEndDate?: string; // 实际结束日期
  status: ProductionStatus; // 排产状态
  steelFactorySystemRef?: string; // 钢厂生产系统关联号
  createdAt: string;
  updatedAt: string;
}

/** 创建排产计划参数 */
export interface CreateProductionPlanParams {
  orderId: string;
  factoryName: string;
  productType: string;
  plannedQuantity: number;
  plannedStartDate: string;
  plannedEndDate: string;
}

// ========== 集货相关 ==========
/** 集货状态 */
export type WarehousingStatus = 'scheduled' | 'collecting' | 'completed';

/** 码头集货信息 */
export interface Warehousing {
  id: string; // 集货编号
  orderId: string; // 关联订单ID
  productionPlanId: string; // 关联排产计划ID
  wharfName: string; // 码头名称
  warehouseNo: string; // 仓库编号
  quantity: number; // 集货数量（吨）
  scheduledDate: string; // 计划集货日期
  actualDate?: string; // 实际集货日期
  status: WarehousingStatus; // 集货状态
  logisticsSystemRef?: string; // 平台公司物流系统关联号
  createdAt: string;
  updatedAt: string;
}

/** 创建集货计划参数 */
export interface CreateWarehousingParams {
  orderId: string;
  productionPlanId: string;
  wharfName: string;
  warehouseNo: string;
  quantity: number;
  scheduledDate: string;
}

// ========== 承运商相关 ==========
/** 承运商状态 */
export type CarrierStatus = 'available' | 'assigned' | 'transporting' | 'completed';

/** 承运商信息 */
export interface Carrier {
  id: string;
  name: string; // 承运商名称
  contactPerson: string; // 联系人
  contactPhone: string; // 联系电话
  licenseNo: string; // 许可证号
  status: CarrierStatus;
  rating?: number; // 评级（1-5星）
  createdAt: string;
  updatedAt: string;
}

// ========== 调度相关 ==========
/** 调度状态 */
export type DispatchStatus = 'pending' | 'carrier_assigned' | 'vessel_assigned' | 'transporting' | 'completed';

/** 调度信息 */
export interface Dispatch {
  id: string; // 调度编号
  orderId: string; // 关联订单ID
  warehousingId: string; // 关联集货ID
  carrierId?: string; // 承运商ID
  carrierName?: string; // 承运商名称
  vesselId?: string; // 船舶ID
  vesselName?: string; // 船舶名称
  transportType: 'river' | 'ocean'; // 运输类型：江船/海船
  quantity: number; // 运输数量（吨）
  origin: string; // 起运地
  destination: string; // 目的地
  scheduledDepartureDate?: string; // 计划发船日期
  actualDepartureDate?: string; // 实际发船日期
  scheduledArrivalDate?: string; // 计划到达日期
  actualArrivalDate?: string; // 实际到达日期
  status: DispatchStatus; // 调度状态
  carrierSystemRef?: string; // 承运商系统关联号
  createdAt: string;
  updatedAt: string;
}

/** 创建调度参数 */
export interface CreateDispatchParams {
  orderId: string;
  warehousingId: string;
  transportType: 'river' | 'ocean';
  quantity: number;
  origin: string;
  destination: string;
  scheduledDepartureDate?: string;
}

/** 分配承运商参数 */
export interface AssignCarrierParams {
  dispatchId: string;
  carrierId: string;
}

// ========== 船舶相关 ==========
/** 船舶状态 */
export type VesselStatus = 'available' | 'loading' | 'transit' | 'unloading' | 'maintenance';

/** 船舶信息 */
export interface Vessel {
  id: string; // 船舶ID
  name: string; // 船舶名称
  imoNumber: string; // IMO编号
  carrierId: string; // 承运商ID
  carrierName: string; // 承运商名称
  vesselType: 'river' | 'ocean'; // 船舶类型：江船/海船
  capacity: number; // 载重量（吨）
  currentLocation?: string; // 当前位置
  currentLongitude?: number; // 当前经度
  currentLatitude?: number; // 当前纬度
  status: VesselStatus; // 船舶状态
  aisSystemRef?: string; // AIS数据关联号
  createdAt: string;
  updatedAt: string;
}

/** AIS数据 */
export interface AISData {
  vesselId: string;
  vesselName: string;
  longitude: number; // 经度
  latitude: number; // 纬度
  speed: number; // 速度（节）
  course: number; // 航向（度）
  heading: number; // 船首向（度）
  timestamp: string; // 时间戳
}

/** 分配船舶参数 */
export interface AssignVesselParams {
  dispatchId: string;
  vesselId: string;
}

// ========== 报关相关 ==========
/** 报关状态 */
export type CustomsStatus = 'not_submitted' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'cleared';

/** 报关信息 */
export interface CustomsDeclaration {
  id: string; // 报关编号
  orderId: string; // 关联订单ID
  dispatchId: string; // 关联调度ID
  declarationNo?: string; // 报关单号
  exporterName: string; // 出口商名称
  productName: string; // 产品名称
  productCode: string; // 商品编码
  quantity: number; // 数量
  unit: string; // 单位
  value: number; // 货值（USD）
  destinationCountry: string; // 目的国
  submitDate?: string; // 提交日期
  reviewDate?: string; // 审核日期
  clearanceDate?: string; // 放行日期
  status: CustomsStatus; // 报关状态
  customsSystemRef?: string; // 海关报关系统关联号
  remarks?: string; // 备注
  createdAt: string;
  updatedAt: string;
}

/** 创建报关单参数 */
export interface CreateCustomsDeclarationParams {
  orderId: string;
  dispatchId: string;
  exporterName: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: string;
  value: number;
  destinationCountry: string;
}

// ========== 全链路流程追踪 ==========
/** 流程节点 */
export interface ProcessNode {
  id: string;
  name: string; // 节点名称
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  startTime?: string;
  endTime?: string;
  participant?: string; // 参与方
  data?: any; // 节点数据
}

/** 全链路流程追踪 */
export interface ProcessTracking {
  orderId: string;
  orderNo: string;
  nodes: ProcessNode[]; // 流程节点
  currentStep: number; // 当前步骤
  totalSteps: number; // 总步骤数
  progress: number; // 进度百分比
  estimatedCompletionDate?: string; // 预计完成日期
}

// ========== 数据可视化 ==========
/** 统计数据 */
export interface Statistics {
  totalOrders: number; // 总订单数
  activeOrders: number; // 进行中订单数
  completedOrders: number; // 已完成订单数
  totalQuantity: number; // 总数量（吨）
  inTransitQuantity: number; // 运输中数量（吨）
  totalVessels: number; // 船舶总数
  activeVessels: number; // 在航船舶数
  totalCarriers: number; // 承运商总数
  activeCarriers: number; // 活跃承运商数
}

/** 时间线数据 */
export interface TimelineItem {
  id: string;
  orderId: string;
  eventType: 'order' | 'production' | 'warehousing' | 'dispatch' | 'vessel' | 'customs';
  title: string;
  description: string;
  timestamp: string;
  participant?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}
