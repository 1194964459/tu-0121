<template>
  <div class="login-page">
    <a-card title="用户登录" style="width: 400px">
      <a-form :model="formState" :rules="rules" layout="vertical" @finish="handleLogin">
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="loading">登录</a-button>
        </a-form-item>
      </a-form>
      <a-alert
        message="测试账号"
        description="邮箱: admin@example.com, 密码: 123456"
        type="info"
        show-icon
        style="margin-top: 16px"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { userApi } from '@/services';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  email: 'admin@example.com',
  password: '123456'
});

const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度不能少于 6 位' }
  ]
};

async function handleLogin() {
  loading.value = true;
  try {
    const response: any = await userApi.login(formState);
    if (response.code === 200) {
      message.success('登录成功');
      localStorage.setItem('token', response.data.token);
      router.push('/home');
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error('登录失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
