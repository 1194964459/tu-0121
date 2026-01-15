import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const loading = ref(false);
  const collapsed = ref(false);

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function toggleCollapsed() {
    collapsed.value = !collapsed.value;
  }

  return {
    loading,
    collapsed,
    setLoading,
    toggleCollapsed
  };
});
