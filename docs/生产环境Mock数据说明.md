# 生产环境Mock数据使用说明

## 工作原理

生产环境通过 **Mock适配器（mockAdapter.ts）** 在API请求失败时自动返回Mock数据，实现与开发环境完全一致的Mock数据支持。

## 工作流程

### 1. 请求流程

```
用户操作
  ↓
API调用 (trackingApi.getStatistics())
  ↓
axios请求 (baseURL: /tu-0121/api, url: /tracking/statistics)
  ↓
实际请求: /tu-0121/api/tracking/statistics
  ↓
GitHub Pages返回404（静态文件服务器，无后端）
  ↓
axios响应拦截器捕获错误
  ↓
检查是否启用生产环境Mock
  ↓
调用mockAdapter(error)
  ↓
匹配Mock配置并执行
  ↓
返回Mock数据
```

### 2. 配置检查

生产环境Mock的启用条件（`src/services/mockAdapter.ts`）：

```typescript
const isProduction = import.meta.env.MODE === 'production';
const useProductionMock = isProduction && !import.meta.env.VITE_API_BASE_URL;
```

**启用条件**：
- ✅ 必须是生产环境（`MODE === 'production'`）
- ✅ 没有配置真实API地址（`!VITE_API_BASE_URL`）

### 3. URL匹配逻辑

1. **获取请求信息**：
   - `config.url`: 相对路径（如 `/tracking/statistics`）
   - `config.baseURL`: baseURL（如 `/tu-0121/api`）

2. **构建完整URL**：
   ```typescript
   fullUrl = baseURL + url  // /tu-0121/api/tracking/statistics
   ```

3. **标准化URL**：
   ```typescript
   normalizedUrl = fullUrl.replace(/^\/tu-0121\/api/, '/api')
   // 结果: /api/tracking/statistics
   ```

4. **匹配Mock配置**：
   - Mock配置URL: `/api/tracking/statistics`
   - 匹配成功 ✅

### 4. Mock数据执行

```typescript
// Mock配置（src/mock/modules/tracking.ts）
{
  url: '/api/tracking/statistics',
  method: 'get',
  response: () => {
    return {
      code: 200,
      message: '获取成功',
      data: { /* 统计数据 */ }
    };
  }
}
```

执行时传入的参数格式（与vite-plugin-mock一致）：
```typescript
{
  url: '/api/tracking/statistics',
  method: 'get',
  query: { /* 查询参数 */ },
  body: { /* 请求体 */ },
  headers: { /* 请求头 */ }
}
```

## 配置文件

### 环境变量（.env.production）

```bash
# 生产环境配置
# 注意：生产环境如果没有真实后端，请注释掉 VITE_API_BASE_URL
# 系统将自动使用相对路径适配 GitHub Pages，并启用Mock数据
# VITE_API_BASE_URL=https://api.example.com/api
VITE_USE_MOCK=false  # 这个在生产环境不影响，因为不依赖vite-plugin-mock
VITE_APP_TITLE=生产环境
```

**重要**：
- 如果设置了 `VITE_API_BASE_URL`（且不是example.com），会使用真实API，Mock不会启用
- 如果不设置 `VITE_API_BASE_URL`，会自动启用Mock数据

### Vite配置（vite.config.ts）

```typescript
viteMockServe({
  mockPath: 'src/mock',
  // 只在开发环境启用Mock插件（提供HTTP服务）
  // 生产环境通过 mockAdapter.ts 直接使用Mock数据
  enable: isDev && useMock,
  watchFiles: true,
  logger: true
})
```

**说明**：
- `vite-plugin-mock` 只在开发环境工作
- 生产环境不依赖此插件，通过代码逻辑实现

## 调试方法

### 1. 查看控制台日志

生产环境会在控制台输出调试信息：

```javascript
[Mock] 尝试匹配: {
  requestUrl: "/tracking/statistics",
  baseURL: "/tu-0121/api",
  fullUrl: "/tu-0121/api/tracking/statistics",
  normalizedUrl: "/api/tracking/statistics",
  method: "get",
  mockCount: 24
}

[Mock] 找到匹配: {
  mockUrl: "/api/tracking/statistics",
  url: "/api/tracking/statistics"
}

[Mock] 使用Mock数据: /tracking/statistics
```

### 2. 检查网络请求

1. 打开浏览器开发者工具
2. 查看Network标签
3. 请求会先返回404（正常，GitHub Pages没有后端）
4. 然后Mock适配器会返回数据

### 3. 常见问题排查

**问题1：Mock数据没有返回**

检查项：
- ✅ 是否在生产环境（`import.meta.env.MODE === 'production'`）
- ✅ 是否没有配置 `VITE_API_BASE_URL`
- ✅ 控制台是否有 `[Mock]` 日志
- ✅ URL是否匹配（查看 `normalizedUrl` 和 `mockUrl`）

**问题2：URL匹配失败**

可能原因：
- URL格式不一致
- baseURL处理错误
- Mock配置中的URL格式错误

解决方法：
- 查看控制台的 `[Mock] 尝试匹配` 日志
- 确认 `normalizedUrl` 和 `mockUrl` 是否一致

## 与开发环境的区别

| 特性 | 开发环境 | 生产环境 |
|------|---------|---------|
| Mock服务 | vite-plugin-mock插件 | mockAdapter代码逻辑 |
| 请求拦截 | HTTP层面（插件） | 响应拦截器（代码） |
| 数据来源 | 相同的Mock模块 | 相同的Mock模块 |
| 配置方式 | VITE_USE_MOCK=true | 不设置VITE_API_BASE_URL |

## 优势

1. **完全复用**：生产环境使用与开发环境完全相同的Mock数据
2. **无需配置**：自动检测环境，无需额外配置
3. **透明切换**：配置真实API后自动切换，无需修改代码
4. **调试友好**：提供详细的调试日志
