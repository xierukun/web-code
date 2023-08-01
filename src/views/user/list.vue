<template>
  <div class="container">
    <div style="display: flex;align-items: center;justify-content: space-between; margin-bottom:50px; ">
      <h1 class="title" style="margin-right: 10px;">User List</h1>
     <router-link to="/register">返回注册</router-link>
    </div>
    <div class="table-container">
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="username" width="150px" label="Username"></el-table-column>
        <el-table-column prop="createDate" width="200px" label="createDate">
          <template #default="{ row }">
            {{ formatDate(row.createDate, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="{ row }">
            <el-button type="danger" @click="deleteUser(row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/user/list');
    users.value = response.data;
  } catch (error) {
    ElMessage.error('Failed to fetch users');
    console.error(error);
  }
};

const deleteUser = async (userId) => {
  try {
    await axios.post(`/api/user/delete`, {id:userId});
    users.value = users.value.filter((user) => user.id !== userId);
    ElMessage.success('User deleted successfully');
  } catch (error) {
    ElMessage.error('Failed to delete user');
    console.error(error);
  }
};

const formatDate = (dateStr, format) =>{
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  const formattedDate = format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);

  return formattedDate;
}

onMounted(fetchUsers);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
}
</style>