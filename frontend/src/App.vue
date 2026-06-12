<template>
  <el-container style="min-height: 100vh">
    <el-header class="header">
      <div class="header-inner">
        <div class="logo" @click="router.push('/')">
          <el-icon :size="28" color="#409EFF"><Sunny /></el-icon>
          <span class="logo-text">冲浪浪点预报</span>
        </div>
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          router
          class="nav-menu"
          background-color="transparent"
          text-color="#1a3a5c"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/">浪点列表</el-menu-item>
          <el-menu-item index="/checkins">实时打卡</el-menu-item>
          <el-menu-item index="/logs">冲浪日志</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-main style="padding: 0">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Sunny } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-bottom: 1px solid #7dd3fc;
  padding: 0;
  height: 64px;
}
.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 40px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #0369a1;
}
.nav-menu {
  flex: 1;
  border-bottom: none !important;
}
.nav-menu :deep(.el-menu-item) {
  border-bottom: none !important;
  font-weight: 500;
}
</style>
