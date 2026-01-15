import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';
import { userApi } from '@/services';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string>('');
  const loading = ref(false);

  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(credentials: { email: string; password: string }) {
    loading.value = true;
    try {
      const response: any = await userApi.login(credentials);
      user.value = response.data;
      token.value = response.data.token;
      localStorage.setItem('token', token.value);
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    loading,
    isLoggedIn,
    isAdmin,
    login,
    logout
  };
});
