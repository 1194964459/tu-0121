<template>
  <div class="user-page">
    <a-card title="用户管理">
      <template #extra>
        <a-button type="primary" @click="showAddModal">添加用户</a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="modalVisible" :title="modalTitle" @ok="handleModalOk" @cancel="handleModalCancel">
      <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="姓名">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="formState.role">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { userApi } from '@/services';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const loading = ref(false);
const users = ref<User[]>([]);
const modalVisible = ref(false);
const modalTitle = ref('添加用户');
const editingId = ref<number | null>(null);

const formState = reactive({
  name: '',
  email: '',
  role: 'user'
});

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role'
  },
  {
    title: '操作',
    key: 'action'
  }
];

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

function handleTableChange(pag: any) {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchUsers();
}

function showAddModal() {
  modalTitle.value = '添加用户';
  editingId.value = null;
  formState.name = '';
  formState.email = '';
  formState.role = 'user';
  modalVisible.value = true;
}

function handleEdit(record: User) {
  modalTitle.value = '编辑用户';
  editingId.value = record.id;
  formState.name = record.name;
  formState.email = record.email;
  formState.role = record.role;
  modalVisible.value = true;
}

function handleDelete(record: User) {
  message.success(`删除用户: ${record.name}`);
}

function handleModalOk() {
  if (editingId.value) {
    message.success('更新用户成功');
  } else {
    message.success('添加用户成功');
  }
  modalVisible.value = false;
  fetchUsers();
}

function handleModalCancel() {
  modalVisible.value = false;
}

async function fetchUsers() {
  loading.value = true;
  try {
    const response: any = await userApi.getUsers();
    users.value = response.data || [];
    pagination.total = users.value.length;
  } catch (error) {
    message.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped lang="scss">
.user-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
