# 物流供应链全链路管理系统

## 系统概述

本系统是一个物流供应链全链路管理系统，旨在解决以下痛点：

1. **人工传递信息问题**：从客户下单、工厂排产、码头集货、调度找承运商、承运商找船、江船到上海换大船出口，一共有5-6个参与方，全是人工传递信息

2. **数据孤岛问题**：要靠贸易系统、钢厂生成系统、平台公司物流系统、承运商系统、AIS数据、海关报关系统才能串联，总包方就是平台公司全部人工录入

## 核心功能

### 1. 全链路数据互联互通
- ✅ 订单管理系统：客户下单、订单跟踪
- ✅ 排产管理系统：钢厂排产计划、生产进度同步
- ✅ 集货管理系统：码头集货、仓储管理
- ✅ 调度管理系统：承运商调度、船舶分配
- ✅ 船舶追踪系统：AIS数据集成、实时位置追踪
- ✅ 报关管理系统：海关报关、状态跟踪

### 2. 数据可视化
- ✅ 数据统计大屏：总订单数、进行中订单、总数量、在航船舶等关键指标
- ✅ 全链路流程追踪：订单全生命周期可视化
- ✅ 时间线展示：操作记录、事件时间线
- ✅ 流程节点可视化：订单流程各节点状态展示

## 系统架构

### 参与方整合
1. **客户**：通过贸易系统下单
2. **钢厂**：通过钢厂生产系统提供排产数据
3. **平台公司**：通过平台公司物流系统管理集货和调度
4. **承运商**：通过承运商系统提供船舶信息
5. **船舶**：通过AIS系统提供实时位置数据
6. **海关**：通过海关报关系统提供报关状态

### 技术架构
- **前端**：Vue 3 + TypeScript + Vite + Ant Design Vue
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **API管理**：Axios封装 + 模块化API
- **Mock数据**：vite-plugin-mock（开发环境）

## 业务流程

### 完整流程
1. **客户下单** → 订单创建，状态：待确认
2. **订单确认** → 状态：已确认，关联贸易系统
3. **工厂排产** → 创建排产计划，同步钢厂生产系统，状态：生产中
4. **码头集货** → 创建集货计划，同步平台公司物流系统，状态：集货中
5. **调度承运商** → 创建调度，分配承运商，同步承运商系统
6. **分配船舶** → 分配船舶，同步AIS数据，状态：运输中
7. **海关报关** → 创建报关单，同步海关报关系统，状态：已发货
8. **完成出口** → 状态：已完成

## 数据模型

### 核心实体
- **Order（订单）**：客户订单信息
- **ProductionPlan（排产计划）**：钢厂排产信息
- **Warehousing（集货）**：码头集货信息
- **Carrier（承运商）**：承运商信息
- **Dispatch（调度）**：调度信息
- **Vessel（船舶）**：船舶信息及AIS数据
- **CustomsDeclaration（报关单）**：海关报关信息
- **ProcessTracking（全链路追踪）**：订单全流程追踪

## API接口

### 订单API (`/api/orders`)
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders` - 创建订单
- `PUT /api/orders/:id` - 更新订单
- `PUT /api/orders/:id/cancel` - 取消订单

### 排产API (`/api/production/plans`)
- `GET /api/production/plans` - 获取排产计划列表
- `GET /api/production/plans/:id` - 获取排产计划详情
- `POST /api/production/plans` - 创建排产计划
- `POST /api/production/plans/:id/sync` - 同步钢厂生产系统数据

### 集货API (`/api/warehousing`)
- `GET /api/warehousing` - 获取集货信息列表
- `GET /api/warehousing/:id` - 获取集货信息详情
- `POST /api/warehousing` - 创建集货计划
- `POST /api/warehousing/:id/sync` - 同步平台公司物流系统数据

### 调度API (`/api/dispatches`)
- `GET /api/dispatches` - 获取调度列表
- `GET /api/dispatches/:id` - 获取调度详情
- `POST /api/dispatches` - 创建调度
- `POST /api/dispatches/:id/assign-carrier` - 分配承运商
- `POST /api/dispatches/:id/assign-vessel` - 分配船舶

### 船舶API (`/api/vessels`)
- `GET /api/vessels` - 获取船舶列表
- `GET /api/vessels/:id` - 获取船舶详情
- `GET /api/vessels/:id/ais` - 获取船舶AIS数据
- `GET /api/vessels/ais/realtime` - 实时获取所有船舶AIS数据
- `POST /api/vessels/ais/sync` - 同步AIS数据

### 报关API (`/api/customs/declarations`)
- `GET /api/customs/declarations` - 获取报关单列表
- `GET /api/customs/declarations/:id` - 获取报关单详情
- `POST /api/customs/declarations` - 创建报关单
- `POST /api/customs/declarations/:id/submit` - 提交报关单
- `POST /api/customs/declarations/:id/sync` - 同步海关报关系统数据

### 追踪API (`/api/tracking`)
- `GET /api/tracking/orders/:id` - 获取订单全链路追踪信息
- `GET /api/tracking/timeline` - 获取时间线数据
- `GET /api/tracking/statistics` - 获取统计数据

## 页面功能

### 1. 首页（Dashboard）
- 统计数据展示：总订单数、进行中订单、总数量、在航船舶
- 最近订单列表
- 最新动态时间线

### 2. 订单管理
- 订单列表查询（支持状态、客户名称筛选）
- 订单详情查看
- 订单创建
- 订单取消
- 全链路追踪跳转

### 3. 全链路追踪
- 订单信息展示
- 流程节点可视化（Steps组件）
- 操作时间线展示
- 完成进度显示

## 使用方法

### 启动开发服务器
```bash
pnpm install
pnpm dev
```

### 访问系统
- 开发服务器：http://localhost:3000
- 登录账号：admin@example.com
- 登录密码：123456

### Mock数据
系统已配置Mock数据，模拟各参与方的数据流转。在开发环境中，系统会自动使用Mock数据，无需启动后端服务。

## 数据同步机制

系统通过API接口的`/sync`端点实现与各参与方系统的数据同步：

1. **钢厂生产系统同步**：`POST /api/production/plans/:id/sync`
2. **平台公司物流系统同步**：`POST /api/warehousing/:id/sync`
3. **承运商系统同步**：`POST /api/carriers/sync`
4. **AIS数据同步**：`POST /api/vessels/ais/sync`
5. **海关报关系统同步**：`POST /api/customs/declarations/:id/sync`

在实际部署时，这些同步接口将对接真实的各参与方系统API。

## 系统优势

1. **自动化数据流转**：消除了人工传递信息的痛点，实现数据自动流转
2. **全链路可视化**：订单全生命周期可视化，实时掌握订单状态
3. **多系统集成**：整合贸易系统、钢厂系统、物流系统、承运商系统、AIS系统、海关系统
4. **实时数据同步**：支持与各参与方系统的实时数据同步
5. **标准化API接口**：统一的API接口规范，便于系统集成

## 未来扩展

- [ ] 地图可视化（船舶实时位置展示）
- [ ] 报表统计（订单分析、承运商评价等）
- [ ] 消息通知（订单状态变更通知）
- [ ] 权限管理（各参与方权限控制）
- [ ] 移动端支持（H5/小程序）
