# Fast Scaff FE 项目说明

## 1. 项目简介

基于 Vue 3 + TypeScript + Vite + Ant Design Vue 的前端项目脚手架，提供完整的开发规范和最佳实践。你可以直接使用此项目作为模板，快速创建自己的前端项目。

## 2. 作为脚手架使用

### 2.1 快速创建新项目

```bash
# 克隆或下载此项目
git clone <repository-url>

# 直接运行初始化脚本（无需进入 fast-scaff-fe 目录）
node fast-scaff-fe/scripts/init.js

# 按提示输入项目信息：
# - 项目名称
# - 项目描述
# - 作者名称

# 进入新创建的项目目录
cd <your-project-name>

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 2.2 初始化说明

运行 `node fast-scaff-fe/scripts/init.js` 后，脚本会自动：

- 在当前目录创建一个新的项目文件夹
- 复制脚手架的所有文件到新项目（排除 node_modules、.git 等不需要的文件）
- 更新新项目中的 `package.json` 中的项目名称、描述和作者信息
- 更新新项目中的 `index.html` 中的页面标题

### 2.3 直接使用模板

如果不需要自定义项目信息，也可以直接复制此项目：

```bash
# 克隆项目并命名为你的新项目
git clone <repository-url> <your-project-name>
cd <your-project-name>

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 3. 技术栈

### 3.1 核心技术栈

| 技术           | 版本 | 用途         |
| -------------- | ---- | ------------ |
| Vue            | 3.x  | 前端框架     |
| TypeScript     | 5.x  | 类型系统     |
| Vite           | 5.x  | 构建工具     |
| Ant Design Vue | 4.x  | UI 组件库    |
| Pinia          | 2.x  | 状态管理     |
| SCSS           | -    | CSS 预处理器 |
| Tailwind CSS   | 3.x  | CSS 框架     |
| pnpm           | 8.x+ | 包管理工具   |

### 3.2 技术选型原则

- **稳定性优先**：选择成熟稳定的技术栈，避免使用实验性特性
- **生态完善**：优先选择社区活跃、文档完善的技术方案
- **团队熟悉度**：确保团队成员能够快速上手和维护
- **可维护性**：代码结构清晰，易于扩展和维护

### 3.3 依赖管理规范

- 统一使用 `pnpm` 作为包管理工具，禁止混用 npm、yarn、pnpm
- 生产依赖和开发依赖分离管理
- 使用精确版本号，避免使用 `^` 或 `~` 符号
- 定期更新依赖，每季度进行一次依赖审查

## 4. 功能特性

- ✅ Vue 3 Composition API
- ✅ TypeScript 类型支持
- ✅ Vite 快速构建
- ✅ Ant Design Vue 组件库
- ✅ Pinia 状态管理
- ✅ Vue Router 路由管理
- ✅ Axios 请求封装
- ✅ Mock 数据支持（仅开发环境）
- ✅ ESLint + Prettier 代码规范
- ✅ Vitest 单元测试

## 5. 快速开始

### 5.1 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 5.2 安装步骤

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

## 6. 开发命令

```bash
# 初始化项目（首次使用）
pnpm init

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 自动修复代码
pnpm lint:fix

# 格式化代码
pnpm format

# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage
```

## 7. AI开发规范

参考：[AI开发规范](docs/0-AI开发规范.md)

## 8. API接口与Mock数据规范

参考：[API接口与Mock数据规范](docs/02-API%E6%8E%A5%E5%8F%A3%E4%B8%8EMock%E6%95%B0%E6%8D%AE%E8%A7%84%E8%8C%83.md)

## 9. 工程目录结构及命名规范

参考：[工程目录结构及命名规范](docs/01-%E5%B7%A5%E7%A8%8B%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84%E5%8F%8A%E5%91%BD%E5%90%8D%E8%A7%84%E8%8C%83.md)

## 10. 状态管理规范

参考：[状态管理规范](docs/03-%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E8%A7%84%E8%8C%83.md)

## 11. Git 分支管理

- `main`：主分支，始终保持稳定可发布状态
- `dev`：开发分支，集成最新开发功能
- `feat/*`：功能分支，从 dev 分支创建
- `fix/*`：普通修复分支，从 dev 分支创建
- `hotfix/*`：线上紧急修复分支，从 main 分支创建
- `release/*`：发布分支，从 dev 分支创建

软件开发流程：main ←─ dev ←─ feat

> 以工厂生产线为例，三者的类比关系：main = 成品仓库（已测试可发货），dev = 组装线（正在测试组装），feat/\* = 各个零件加工站

## 12. Git 提交规范

### 提交信息格式：

```
<类型>(<范围>): <描述>
```

> 范围可省略，如：`fix: 修复全局样式问题`

### 提交类型说明

| 类型     | 说明            |
| -------- | --------------- |
| feat     | 新增功能        |
| update   | 更新现有功能    |
| fix      | 修复bug         |
| docs     | 文档修改        |
| style    | 代码格式修改    |
| refactor | 代码重构        |
| test     | 测试相关        |
| chore    | 构建/工具配置等 |
| perf     | 性能优化        |
| revert   | 回滚提交        |
| ci       | CI/CD配置修改   |

### git提交示例

```
feat(auth): 新增用户登录功能

fix(api): 修复获取用户信息接口错误

docs(readme): 更新项目说明文档
```

## 13. 技术支持

如有问题，请参考：

- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [Ant Design Vue 文档](https://antdv.com/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)
