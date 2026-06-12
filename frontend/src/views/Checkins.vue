<template>
  <div class="page-container">
    <h1 class="page-title">⭐ 实时打卡广场</h1>
    <p class="sub-desc">每一条来自浪友的真实上报，都是最珍贵的浪况情报</p>

    <div class="toolbar">
      <el-input
        v-model="keyword"
        placeholder="搜索用户 / 备注"
        clearable
        style="width: 240px"
        :prefix-icon="Search"
      />
      <el-select v-model="filterSpot" placeholder="选择浪点" clearable style="width: 200px">
        <el-option v-for="s in spots" :key="s.id" :label="s.name" :value="s.id" />
      </el-select>
      <el-rate v-model="filterRating" clearable allow-half show-text :texts="['全部', '', '', '', '', '5星']" />
    </div>

    <div v-if="filtered.length" class="checkin-grid">
      <div class="checkin-card card-shadow" v-for="c in filtered" :key="c.id">
        <div class="cc-spot" v-if="c.spot">
          <el-icon><Location /></el-icon>
          <strong>{{ c.spot.name }}</strong>
        </div>
        <div class="cc-header">
          <div class="cc-user">
            <div class="avatar">{{ (c.user_name || '?').slice(0, 1).toUpperCase() }}</div>
            <span class="username">{{ c.user_name }}</span>
          </div>
          <el-rate :model-value="c.rating" disabled size="small" />
        </div>
        <div class="cc-stats">
          <div class="stat" v-if="c.actual_wave_height">
            <div class="stat-num">{{ c.actual_wave_height }}<span>m</span></div>
            <div class="stat-label">实际浪高</div>
          </div>
          <div class="stat" v-if="c.crowd_level">
            <div class="stat-num small">{{ crowdText(c.crowd_level) }}</div>
            <div class="stat-label">人群</div>
          </div>
          <div class="stat">
            <div class="stat-num small">{{ formatTime(c.checkin_time) }}</div>
            <div class="stat-label">打卡时间</div>
          </div>
        </div>
        <div class="cc-comment" v-if="c.comment">
          "{{ c.comment }}"
        </div>
      </div>
    </div>

    <el-empty v-else description="还没有打卡记录，快去浪点详情页打卡吧！" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Location } from '@element-plus/icons-vue';
import { checkinApi, surfSpotApi } from '../api';

const allCheckins = ref([]);
const spots = ref([]);
const keyword = ref('');
const filterSpot = ref(null);
const filterRating = ref(0);

const filtered = computed(() => {
  return allCheckins.value.filter((c) => {
    if (filterSpot.value && c.spot_id !== filterSpot.value) return false;
    if (filterRating.value && c.rating !== Math.round(filterRating.value)) return false;
    if (keyword.value) {
      const kw = keyword.value.toLowerCase();
      return (c.user_name || '').toLowerCase().includes(kw) || (c.comment || '').toLowerCase().includes(kw);
    }
    return true;
  });
});

const loadData = async () => {
  [allCheckins.value, spots.value] = await Promise.all([checkinApi.list(200), surfSpotApi.list()]);
};

const crowdText = (c) => ({ empty: '很空', few: '人少', moderate: '适中', crowded: '拥挤', very_crowded: '爆满' }[c] || c);
const formatTime = (t) => {
  const d = new Date(t);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

onMounted(loadData);
</script>

<style scoped>
.sub-desc {
  color: #64748b;
  margin: -10px 0 20px;
}
.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}
.checkin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.checkin-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border-top: 4px solid #409EFF;
  transition: transform 0.2s;
}
.checkin-card:hover {
  transform: translateY(-3px);
}
.cc-spot {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-size: 13px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e2e8f0;
}
.cc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.cc-user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.username {
  font-weight: 600;
  color: #0f172a;
}
.cc-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
}
.stat {
  flex: 1;
  text-align: center;
  padding: 8px;
  background: #f0f9ff;
  border-radius: 8px;
}
.stat-num {
  font-size: 20px;
  font-weight: 700;
  color: #0369a1;
}
.stat-num span {
  font-size: 12px;
  font-weight: 500;
  margin-left: 2px;
}
.stat-num.small {
  font-size: 13px;
}
.stat-label {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}
.cc-comment {
  color: #334155;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-style: italic;
}
</style>
