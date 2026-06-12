<template>
  <div class="page-container">
    <div class="header-row">
      <h1 class="page-title">🌊 浪点档案</h1>
      <el-button type="primary" @click="fetchForecasts">
        <el-icon><Refresh /></el-icon>
        <span>模拟拉取预报</span>
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="spot in spots" :key="spot.id">
        <el-card class="spot-card card-shadow" @click="goDetail(spot.id)">
          <div class="card-header">
            <span class="spot-name">{{ spot.name }}</span>
            <el-tag :type="levelTagType(spot.suitable_level)" size="small">
              {{ levelText(spot.suitable_level) }}
            </el-tag>
          </div>
          <div class="card-info">
            <div class="info-row">
              <el-icon><Location /></el-icon>
              <span>{{ spot.latitude }}, {{ spot.longitude }}</span>
            </div>
            <div class="info-row">
              <el-icon><Coin /></el-icon>
              <span>浪型：{{ waveTypeText(spot.wave_type) }}</span>
            </div>
            <div class="info-row">
              <el-icon><Wind /></el-icon>
              <span>最佳风向：{{ spot.best_wind_direction || '-' }}</span>
            </div>
            <div class="info-row">
              <el-icon><TrendCharts /></el-icon>
              <span>最佳潮汐：{{ spot.best_tide || '-' }}</span>
            </div>
          </div>
          <div class="card-desc" v-if="spot.description">
            {{ spot.description }}
          </div>
          <div class="card-footer">
            <el-button type="primary" size="small" @click.stop="goDetail(spot.id)">查看预报 &rarr;</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="spots.length === 0" description="暂无浪点数据" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElNotification } from 'element-plus';
import { Location, Wind, TrendCharts, Refresh, Coin } from '@element-plus/icons-vue';
import { surfSpotApi, forecastApi } from '../api';

const router = useRouter();
const spots = ref([]);

const loadSpots = async () => {
  spots.value = await surfSpotApi.list();
};

const fetchForecasts = async () => {
  await forecastApi.fetch();
  ElNotification.success({
    title: '预报数据已生成',
    message: '未来7天每3小时一组的浪高、风速、潮位数据已模拟生成',
  });
  ElMessage.success('数据拉取完成');
};

const goDetail = (id) => router.push(`/spot/${id}`);

const waveTypeText = (t) => ({ point_break: '点礁', beach_break: '沙滩', reef_break: '礁石' }[t] || t);
const levelText = (l) => ({ beginner: '新手', intermediate: '中阶', advanced: '高阶' }[l] || l);
const levelTagType = (l) => ({ beginner: 'success', intermediate: 'warning', advanced: 'danger' }[l] || 'info');

onMounted(loadSpots);
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-title {
  margin: 0;
}
.spot-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}
.spot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.spot-name {
  font-size: 18px;
  font-weight: 700;
  color: #0369a1;
}
.card-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  color: #475569;
  font-size: 13px;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.card-desc {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 10px;
  background: #f0f9ff;
  border-radius: 6px;
  margin-bottom: 12px;
}
.card-footer {
  text-align: right;
}
</style>
