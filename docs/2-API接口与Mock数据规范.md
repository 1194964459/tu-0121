# API与Mock数据规范

## 1. API接口规范

### 1.1 请求封装

```typescript
// src/services/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          message.error('未授权，请重新登录');
          // 跳转到登录页
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(data.message || '请求失败');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export default instance;
```

### 1.2 API模块化

**API模块结构**

```
services/
├── index.ts                    # API 入口
├── request.ts                  # 请求封装
├── modules/
│   ├── user.ts                 # 用户 API
│   ├── product.ts              # 产品 API
│   ├── order.ts                # 订单 API
│   └── [module].ts             # 其他 API
└── types.ts                    # API 类型定义
```

**API模块示例**

```typescript
// src/services/modules/user.ts
import request from '../request';
import type { User, LoginParams } from '../types';

export const userApi = {
  // 登录
  login(params: LoginParams) {
    return request.post<User>('/auth/login', params);
  },

  // 获取用户信息
  getUserInfo(id: number) {
    return request.get<User>(`/users/${id}`);
  }
};
```

### 1.3 API类型定义

```typescript
// src/services/types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface LoginParams {
  email: string;
  password: string;
}
```

### 1.4 API调用规范

```typescript
// 在组件中使用 API（自动兼容Mock/真实API）
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userApi } from '@/services/modules/user';
import type { User } from '@/services/types';

const user = ref<User | null>(null);
const loading = ref(false);

// 调用API（自动切换Mock/真实API）
async function fetchUser(id: number) {
  loading.value = true;
  try {
    user.value = await userApi.getUserInfo(id);
  } catch (error) {
    console.error('获取用户信息失败', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUser(1);
});
</script>
```

## 2. Mock数据规范

### 2.1 Mock数据概述

Mock数据是开发阶段用于模拟真实API响应的技术，支持与真实API的无缝切换。本项目采用`vite-plugin-mock`实现Mock功能，无需修改前端代码即可切换数据源。

### 2.2 目录结构与配置

**Mock相关文件结构**

```
fast-scaff-fe/
├── src/
│   ├── config/
│   │   └── mock.config.ts       # Mock 配置文件
│   ├── mock/                   # Mock 数据目录（仅开发环境）
│   │   ├── index.ts            # Mock 入口
│   │   ├── modules/            # Mock 模块
│   │   │   ├── user.ts         # 用户 Mock
│   │   │   ├── product.ts      # 产品 Mock
│   │   │   └── [module].ts     # 其他模块 Mock
│   │   └── utils.ts            # Mock 工具函数
│   └── services/
│       └── request.ts          # API 请求封装（集成 Mock）
├── .env.development            # 开发环境变量
└── .env.production             # 生产环境变量
```

**环境变量配置**

```bash
# 开发环境 - 启用 Mock
VITE_USE_MOCK=true
VITE_MOCK_DELAY=300

# 生产环境 - 禁用 Mock
VITE_USE_MOCK=false
```

**Vite配置**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      vue(),
      // 仅在开发环境启用 Mock
      viteMockServe({
        mockPath: 'src/mock',
        localEnabled: isDev,
        prodEnabled: false, // 生产环境禁用
        injectCode: `
          import { setupMock } from '/src/mock/index';
          setupMock();
        `
      })
    ]
  };
});
```

### 2.3 Mock模块开发规范

**Mock模块示例**

```typescript
// src/mock/modules/user.ts
import { MockMethod } from 'vite-plugin-mock';

/**
 * 用户相关 Mock 接口
 * 包含登录、注册、用户信息等接口
 */
export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { email, password } = body;
      if (email === 'admin@example.com' && password === '123456') {
        return {
          code: 200,
          message: '登录成功',
          data: {
            id: 1,
            name: '管理员',
            email: 'admin@example.com',
            role: 'admin',
            token: 'mock-token-123456'
          }
        };
      }
      return {
        code: 401,
        message: '用户名或密码错误'
      };
    }
  }
] as MockMethod[];
```

**Mock数据管理规范**

1. **数据结构一致性**：Mock数据结构必须与真实API返回的数据结构一致
2. **注释完善**：在Mock文件中添加注释说明接口用途
3. **场景覆盖**：Mock数据应覆盖各种业务场景，包括成功、失败、异常等情况
4. **同步更新**：接口变更时同步更新Mock数据
5. **避免敏感数据**：不要在Mock数据中包含真实的敏感信息

### 2.4 Mock数据使用

Mock数据的使用方式与真实API完全相同，参考[API调用规范](#14-api调用规范)部分的示例即可。系统会根据环境变量自动切换数据源。

## 3. API与Mock集成

### 3.1 Mock与API的关系

#### 相同点

- **请求方式**：都支持GET、POST、PUT、DELETE等HTTP方法
- **数据结构**：Mock数据应与真实API返回的数据结构保持一致
- **调用方式**：前端代码调用方式完全相同，无需修改
- **错误处理**：都遵循相同的错误处理机制

#### 不同点

- **数据来源**：Mock数据来自本地文件，真实API来自后端服务器
- **实时性**：Mock数据是静态的，真实API数据是动态的
- **环境**：Mock仅在开发环境使用，真实API用于测试和生产环境
- **性能**：Mock响应更快，真实API受网络和服务器影响

### 3.2 无缝切换机制

1. **Mock模式**：
   - 请求发送到当前开发服务器（如 http://localhost:3000/api）
   - Mock插件拦截请求并返回Mock数据
   - 自动适配任何端口，无需启动后端服务

2. **真实API模式**：
   - `request.ts` 使用完整URL发送请求
   - 自动转发到真实后端服务器
   - 支持跨域请求和后端调试

3. **切换方式**：
   - 修改环境变量 `VITE_USE_MOCK` 的值
   - 重启开发服务器

## 4. 总结

- **API接口规范**：提供了统一的API请求封装、模块化组织、类型定义和调用规范，确保代码的一致性和可维护性
- **Mock数据规范**：支持在后端API未完成时独立开发和测试，通过环境变量实现与真实API的无缝切换
- **集成优势**：无论使用Mock还是真实API，前端代码的调用方式完全一致，提高开发效率和代码质量

通过遵循这些规范，可以实现前后端开发的并行工作，提高项目的开发效率和质量。
