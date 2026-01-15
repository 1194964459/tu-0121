<template>
  <a-layout class="app-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <img src="@/assets/icons/logo.svg" alt="Logo" class="logo-img" />
        <h2 v-if="!collapsed">物流供应链</h2>
      </div>
      <a-menu
        v-model:selected-keys="selectedKeys"
        v-model:open-keys="openKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
      >
        <a-menu-item key="/home" @click="navigateTo('/home')">
          <template #icon>
            <HomeOutlined />
          </template>
          <span>首页</span>
        </a-menu-item>
        <a-menu-item key="/order" @click="navigateTo('/order')">
          <template #icon>
            <ShoppingOutlined />
          </template>
          <span>订单管理</span>
        </a-menu-item>
        <!-- <a-menu-item key="/user" @click="navigateTo('/user')">
          <template #icon>
            <UserOutlined />
          </template>
          <span>用户管理</span>
        </a-menu-item> -->
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <MenuUnfoldOutlined v-if="collapsed" class="trigger" @click="toggleCollapsed" />
        <MenuFoldOutlined v-else class="trigger" @click="toggleCollapsed" />
        <div class="header-right">
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <UserOutlined style="margin-right: 8px" />
              {{ userStore.user?.name || '用户' }}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout" @click="handleLogout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/modules/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const collapsed = ref(false);
const selectedKeys = ref<string[]>(['/home']);
const openKeys = ref<string[]>([]);

// 监听路由变化，更新菜单选中状态
watch(
  () => route.path,
  (newPath: string) => {
    // 处理带参数的路径
    const basePath = newPath.split('/').slice(0, 2).join('/');
    selectedKeys.value = [basePath];
  },
  { immediate: true }
);

function toggleCollapsed() {
  collapsed.value = !collapsed.value;
}

function navigateTo(path: string) {
  router.push(path);
}

function handleLogout() {
  userStore.logout();
  router.push('/login');
}
</script>

<style scoped lang="scss">
.app-layout {
  height: 100vh;

  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 0 16px;
    background: #001529;

    .logo-img {
      height: 32px;
      width: 32px;
      flex-shrink: 0;
    }

    h2 {
      color: #fff;
      margin: 0;
      font-size: 18px;
      white-space: nowrap;
    }
  }

  .header {
    background: #fff;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .trigger {
      font-size: 18px;
      line-height: 64px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
    }
  }

  .content {
    margin: 24px;
    padding: 24px;
    background: #fff;
    min-height: 280px;
    overflow: auto;
  }
}
</style>
