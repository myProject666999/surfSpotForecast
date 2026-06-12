<template>
  <div class="page-container" v-loading="loading">
    <div class="breadcrumb-row">
      <el-button text @click="router.push('/')">&larr; 返回浪点列表</el-button>
    </div>

    <div v-if="spot" class="spot-header card-shadow">
      <div class="spot-title-row">
        <h1 class="spot-name">{{ spot.name }}</h1>
        <div class="spot-tags">
          <el-tag :type="levelTagType(spot.suitable_level)">{{ levelText(spot.suitable_level) }}</el-tag>
          <el-tag type="info">{{ waveTypeText(spot.wave_type) }}</el-tag>
        </div>
      </div>
      <div class="spot-meta">
        <span><el-icon><Location /></el-icon> {{ spot.latitude }}, {{ spot.longitude }}</span>
        <span><el-icon><Wind /></el-icon> 最佳风向：{{ spot.best_wind_direction }}</span>
        <span><el-icon><TrendCharts /></el-icon> 最佳潮汐：{{ spot.best_tide }}</span>
      </div>
      <p class="spot-desc" v-if="spot.description">{{ spot.description }}</p>
    </div>

    <el-tabs v-model="activeTab" class="detail-tabs">
      <el-tab-pane label="📈 7天预报曲线" name="forecast">
        <div class="action-bar">
          <el-button type="primary" size="small" @click="loadForecasts">刷新预报</el-button>
          <el-tag v-if="forecasts.length" type="success">共 {{ forecasts.length }} 组数据（每3小时）</el-tag>
          <el-tag v-else type="warning">暂无数据，请先点击"模拟拉取预报"</el-tag>
        </div>
        <el-row :gutter="20">
          <el-col :span="24"><div ref="waveChart" class="chart-box"></div></el-col>
          <el-col :span="12"><div ref="windChart" class="chart-box"></div></el-col>
          <el-col :span="12"><div ref="tideChart" class="chart-box"></div></el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="⭐ 实时打卡上报" name="checkin">
        <div class="two-col">
          <div class="col-left">
            <h3 class="sub-title">新增打卡</h3>
            <el-form :model="form" label-width="100px" @submit.prevent>
              <el-form-item label="用户名">
                <el-input v-model="form.user_name" placeholder="你的昵称" />
              </el-form-item>
              <el-form-item label="打卡时间">
                <el-date-picker v-model="form.checkin_time" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" />
              </el-form-item>
              <el-form-item label="实际浪高">
                <el-input-number v-model="form.actual_wave_height" :step="0.1" :min="0" :max="10" />
                <span style="margin-left:8px;color:#64748b">米</span>
              </el-form-item>
              <el-form-item label="人群密度">
                <el-select v-model="form.crowd_level" placeholder="选择">
                  <el-option label="空无一人" value="empty" />
                  <el-option label="寥寥无几" value="few" />
                  <el-option label="适中" value="moderate" />
                  <el-option label="拥挤" value="crowded" />
                  <el-option label="人满为患" value="very_crowded" />
                </el-select>
              </el-form-item>
              <el-form-item label="推荐指数">
                <el-rate v-model="form.rating" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.comment" type="textarea" :rows="3" placeholder="今天浪况如何？" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitCheckin">提交打卡</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="col-right">
            <h3 class="sub-title">最新打卡记录</h3>
            <div class="checkin-list" v-if="checkins.length">
              <div class="checkin-item" v-for="c in checkins" :key="c.id">
                <div class="ci-header">
                  <strong>{{ c.user_name }}</strong>
                  <el-rate :model-value="c.rating" disabled size="small" />
                </div>
                <div class="ci-meta">
                  <span>{{ formatTime(c.checkin_time) }}</span>
                  <span v-if="c.actual_wave_height">浪高 {{ c.actual_wave_height }}m</span>
                  <span v-if="c.crowd_level">{{ crowdText(c.crowd_level) }}</span>
                </div>
                <div class="ci-comment" v-if="c.comment">{{ c.comment }}</div>
              </div>
            </div>
            <el-empty v-else description="暂无打卡，来做第一个吧！" :image-size="80" />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="📝 冲浪日志" name="log">
        <h3 class="sub-title">写一篇冲浪日志</h3>
        <el-form :model="logForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名">
                <el-input v-model="logForm.user_name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="冲浪日期">
                <el-date-picker v-model="logForm.log_date" type="date" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="板型">
                <el-input v-model="logForm.board_type" placeholder="如：短板/长板/鱼板" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="板长">
                <el-input v-model="logForm.board_length" placeholder="如：6'2''" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="冲浪时长">
                <el-input-number v-model="logForm.duration" :min="0" />
                <span style="margin-left:8px;color:#64748b">分钟</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="视频链接">
                <el-input v-model="logForm.video_url" placeholder="可选" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="完成动作">
                <el-input v-model="logForm.tricks" placeholder="如：起乘、底转、切浪、管浪" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细描述">
                <el-input v-model="logForm.description" type="textarea" :rows="4" placeholder="记录这次冲浪的心得和亮点" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitLog">保存日志</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { Location, Wind, TrendCharts } from '@element-plus/icons-vue';
import { surfSpotApi, forecastApi, checkinApi, surfLogApi } from '../api';

const route = useRoute();
const router = useRouter();
const spotId = () => parseInt(route.params.id, 10);

const loading = ref(false);
const spot = ref(null);
const activeTab = ref('forecast');
const forecasts = ref([]);
const checkins = ref([]);

const form = ref({
  user_name: '',
  checkin_time: new Date(),
  actual_wave_height: 1.0,
  crowd_level: 'moderate',
  rating: 4,
  comment: '',
});

const logForm = ref({
  user_name: '',
  log_date: new Date().toISOString().slice(0, 10),
  board_type: '',
  board_length: '',
  duration: 90,
  tricks: '',
  video_url: '',
  description: '',
});

const waveChart = ref(null);
const windChart = ref(null);
const tideChart = ref(null);
let waveInst, windInst, tideInst;

const loadSpot = async () => {
  spot.value = await surfSpotApi.detail(spotId());
};

const loadForecasts = async () => {
  forecasts.value = await forecastApi.getBySpot(spotId());
  await nextTick();
  renderCharts();
};

const loadCheckins = async () => {
  checkins.value = await checkinApi.getBySpot(spotId());
};

const renderCharts = () => {
  const times = forecasts.value.map((f) => formatTime(f.forecast_time));
  const waves = forecasts.value.map((f) => Number(f.wave_height));
  const winds = forecasts.value.map((f) => Number(f.wind_speed));
  const tides = forecasts.value.map((f) => Number(f.tide_level));

  if (waveChart.value) {
    waveInst = echarts.init(waveChart.value);
    waveInst.setOption({
      title: { text: '浪高变化（米）', left: 10, textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis' },
      grid: { left: 50, right: 30, top: 50, bottom: 60 },
      xAxis: { type: 'category', data: times, axisLabel: { rotate: 40, fontSize: 10 } },
      yAxis: { type: 'value', name: 'm' },
      series: [{ data: waves, type: 'line', smooth: true, areaStyle: { opacity: 0.2 }, itemStyle: { color: '#0ea5e9' }, lineStyle: { width: 2 } }],
    });
  }

  if (windChart.value) {
    windInst = echarts.init(windChart.value);
    windInst.setOption({
      title: { text: '风速（节）', left: 10, textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis' },
      grid: { left: 50, right: 30, top: 50, bottom: 60 },
      xAxis: { type: 'category', data: times, axisLabel: { rotate: 40, fontSize: 10 } },
      yAxis: { type: 'value', name: 'kt' },
      series: [{ data: winds, type: 'bar', itemStyle: { color: '#22c55e' } }],
    });
  }

  if (tideChart.value) {
    tideInst = echarts.init(tideChart.value);
    tideInst.setOption({
      title: { text: '潮位变化（米）', left: 10, textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis' },
      grid: { left: 50, right: 30, top: 50, bottom: 60 },
      xAxis: { type: 'category', data: times, axisLabel: { rotate: 40, fontSize: 10 } },
      yAxis: { type: 'value', name: 'm' },
      series: [{ data: tides, type: 'line', smooth: true, areaStyle: { opacity: 0.2, color: '#f59e0b' }, itemStyle: { color: '#f59e0b' }, lineStyle: { width: 2 } }],
    });
  }
};

const submitCheckin = async () => {
  if (!form.value.user_name) return ElMessage.warning('请填写用户名');
  await checkinApi.create({ ...form.value, spot_id: spotId() });
  ElMessage.success('打卡成功！感谢你的分享 🤙');
  form.value.comment = '';
  loadCheckins();
};

const submitLog = async () => {
  if (!logForm.value.user_name) return ElMessage.warning('请填写用户名');
  await surfLogApi.create({ ...logForm.value, spot_id: spotId() });
  ElMessage.success('日志已保存！');
  logForm.value.tricks = '';
  logForm.value.video_url = '';
  logForm.value.description = '';
};

const formatTime = (t) => {
  const d = new Date(t);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:00`;
};
const waveTypeText = (t) => ({ point_break: '点礁', beach_break: '沙滩', reef_break: '礁石' }[t] || t);
const levelText = (l) => ({ beginner: '新手友好', intermediate: '中阶', advanced: '高阶挑战' }[l] || l);
const levelTagType = (l) => ({ beginner: 'success', intermediate: 'warning', advanced: 'danger' }[l] || 'info');
const crowdText = (c) => ({ empty: '空无一人', few: '寥寥无几', moderate: '适中', crowded: '拥挤', very_crowded: '人满为患' }[c] || c);

onMounted(async () => {
  loading.value = true;
  try {
    await loadSpot();
    await Promise.all([loadForecasts(), loadCheckins()]);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.breadcrumb-row {
  margin-bottom: 16px;
}
.spot-header {
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #bae6fd;
}
.spot-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.spot-name {
  font-size: 28px;
  margin: 0;
  color: #0369a1;
}
.spot-tags {
  display: flex;
  gap: 8px;
}
.spot-meta {
  display: flex;
  gap: 24px;
  color: #475569;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.spot-meta > span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.spot-desc {
  color: #64748b;
  margin: 0;
  padding: 10px 14px;
  background: white;
  border-radius: 8px;
}
.detail-tabs {
  margin-top: 20px;
}
.action-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.chart-box {
  height: 320px;
  background: white;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.sub-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a3a5c;
}
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 900px) {
  .two-col { grid-template-columns: 1fr; }
}
.checkin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 520px;
  overflow-y: auto;
}
.checkin-item {
  padding: 14px;
  background: white;
  border-radius: 10px;
  border-left: 4px solid #409EFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.ci-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.ci-meta {
  display: flex;
  gap: 14px;
  color: #64748b;
  font-size: 13px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.ci-comment {
  color: #334155;
  font-size: 14px;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 6px;
}
</style>
