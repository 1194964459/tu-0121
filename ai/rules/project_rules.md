1. 技术栈:Vue3 + TypeScript + Ant Design Vue@4.x + SCSS + Vite + Pinia;
2. 工程规范:
   - 使用 pnpm 作为包管理器
   - 单个组件最大行数:300 行, 自动拆分可复用组件;
   - 代码嵌套≤3层, 函数行数≤50行;
   - 若文件没被其他文件引用, 需删除这类多余的文件
   - 代码需加完整注释(组件/函数需说明功能、入参、返回值);

3. Vue规范:
   - Vue使用Composition API
   - 状态管理: Pinia, 禁止零散 reactive;
   - 组件名: PascalCase, 文件名: kebab-case;
   - 样式: SCSS + BEM 命名 + scoped 隔离 + Tailwind;

4. 组件规范:
   - 基于团队组件模板生成, 使用 <script setup lang="ts"> 语法;
   - Props/Emits 必须定义 TS 类型, 禁止 any;
   - 非首屏/非核心组件使用异步加载, 减少首屏打包体积;
   - 对频繁切换的组件使用 keep-alive 缓存, 避免重复创建/销毁：
   - 响应式API: 处理基础/简单类型时 使用ref;
   - 避免使用 watch 侦听超大对象, 或使用 watchEffect 仅侦听用到的属性;
   - 组件卸载前需要取消 手动创建的侦听器;

5. UI界面:
   - 样式适配 375px/768px/1200px 断点, 响应式布局;
   - 表单需要做必填项校验

6. UI库Ant Design Vue使用规范:
   - UI库ant-Design-vue基于ConfigProvider配置, 默认使用中文, 请在App.vue文件中实现
   - <a-table>组件的第一列、最后一列会固定在表格上，若超过宽度 其他列项会形成水平滚动条；
   - 表单布局layout 默认选用vertical;
   - 模态框的新建、编辑默认使用同一个弹框，不过两者的标题不一致;
