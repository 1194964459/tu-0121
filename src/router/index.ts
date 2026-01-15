import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        redirect: 'home'
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'HomeOutlined' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/order/index.vue'),
        meta: { title: '订单管理', icon: 'ShoppingOutlined' }
      },
      {
        path: 'tracking/:id',
        name: 'Tracking',
        component: () => import('@/views/tracking/index.vue'),
        meta: { title: '全链路追踪' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'UserOutlined' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to: any, _from: any, next: any) => {
  document.title = `${to.meta.title || '页面'} - 物流供应链全链路管理系统`;
  next();
});

export default router;
