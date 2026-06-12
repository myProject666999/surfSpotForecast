<template>
  <div class="page-container">
    <h1 class="page-title">📝 冲浪日志</h1>
    <p class="sub-desc">记录每一次与海浪的对话，见证自己的进步</p>

    <div class="toolbar">
      <el-input v-model="keyword" placeholder="搜索用户 / 动作 / 描述" clearable style="width: 280px" />
      <el-select v-model="filterSpot" placeholder="选择浪点" clearable style="width: 200px">
        <el-option v-for="s in spots" :key="s.id" :label="s.name" :value="String(s.id)" />
      </el-select>
      <el-button type="primary" @click="showCreate = true">
        <el-icon><Plus /></el-icon>
        写新日志
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="8" v-for="log in filtered" :key="log.id">
        <el-card class="log-card card-shadow">
          <div class="log-top">
            <div class="log-date">
              <el-icon><Calendar /></el-icon>
              <span>{{ log.log_date }}</span>
            </div>
            <el-tag type="success" size="small" v-if="log.spot">{{ log.spot.name }}</el-tag>
          </div>
          <div class="log-user">
            <div class="avatar">{{ (log.user_name || '?').slice(0, 1).toUpperCase() }}</div>
            <span>{{ log.user_name }}</span>
          </div>
          <div class="log-meta">
            <div class="meta-item" v-if="log.board_type">
              <el-icon><Tickets /></el-icon>
              <span>{{ log.board_type }} {{ log.board_length || '' }}</span>
            </div>
            <div class="meta-item" v-if="log.duration">
              <el-icon><Timer /></el-icon>
              <span>{{ log.duration }} 分钟</span>
            </div>
          </div>
          <div class="log-tricks" v-if="log.tricks">
            <span class="trick-label">完成动作：</span>
            <el-tag v-for="t in log.tricks.split(/[,，、]/).filter(Boolean)" :key="t" size="small" type="warning" style="margin:2px">{{ t.trim() }}</el-tag>
          </div>
          <div class="log-desc" v-if="log.description">{{ log.description }}</div>
          <div class="log-video" v-if="log.video_url">
            <el-link :href="log.video_url" target="_blank" type="primary">
              <el-icon><VideoPlay /></el-icon>
              查看视频
            </el-link>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="!filtered.length" description="还没有日志，点击右上角写一篇吧！" />

    <el-dialog v-model="showCreate" title="写一篇冲浪日志" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="选择浪点">
          <el-select v-model="form.spot_id" placeholder="选择浪点" style="width:100%">
            <el-option v-for="s in spots" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名"><el-input v-model="form.user_name" /></el-form-item>
        <el-form-item label="日期"><el-date-picker v-model="form.log_date" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-row :gutter="10">
          <el-col :span="12"><el-form-item label="板型"><el-input v-model="form.board_type" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="板长"><el-input v-model="form.board_length" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="时长">
          <el-input-number v-model="form.duration" :min="0" />
          <span style="margin-left:8px;color:#64748b">分钟</span>
        </el-form-item>
        <el-form-item label="完成动作"><el-input v-model="form.tricks" placeholder="用逗号分隔，如：起乘,底转,切浪" /></el-form-item>
        <el-form-item label="视频链接"><el-input v-model="form.video_url" /></el-form-item>
        <el-form-item label="详细描述"><el-input v-model="form.description" type="textarea" :rows="4" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" @click="submitLog">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Calendar, Tickets, Timer, VideoPlay, Plus } from '@element-plus/icons-vue';
import { surfLogApi, surfSpotApi } from '../api';

const allLogs = ref([]);
const spots = ref([]);
const keyword = ref('');
const filterSpot = ref('');
const showCreate = ref(false);

const form = ref({
  spot_id: null,
  user_name: '',
  log_date: new Date().toISOString().slice(0, 10),
  board_type: '',
  board_length: '',
  duration: 90,
  tricks: '',
  video_url: '',
  description: '',
});

const filtered = computed(() => {
  return allLogs.value.filter((log) => {
    if (filterSpot.value && String(log.spot_id) !== filterSpot.value) return false;
    if (keyword.value) {
      const kw = keyword.value.toLowerCase();
      const hay = [log.user_name, log.tricks, log.description, log.board_type].join(' ').toLowerCase();
      return hay.includes(kw);
    }
    return true;
  });
});

const loadData = async () => {
  [allLogs.value, spots.value] = await Promise.all([surfLogApi.list(), surfSpotApi.list()]);
};

const submitLog = async () => {
  if (!form.value.spot_id || !form.value.user_name) return ElMessage.warning('请填写浪点和用户名');
  await surfLogApi.create(form.value);
  ElMessage.success('日志已保存！');
  showCreate.value = false;
  form.value.tricks = '';
  form.value.video_url = '';
  form.value.description = '';
  loadData();
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
.log-card {
  margin-bottom: 20px;
  transition: transform 0.2s;
  border-left: 4px solid #10b981;
}
.log-card:hover {
  transform: translateY(-3px);
}
.log-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e5e7eb;
}
.log-date {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #10b981;
  font-weight: 600;
}
.log-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}
.log-user > span {
  font-weight: 600;
}
.log-meta {
  display: flex;
  gap: 16px;
  color: #475569;
  font-size: 13px;
  margin-bottom: 10px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.log-tricks {
  margin-bottom: 10px;
  line-height: 1.8;
}
.trick-label {
  color: #64748b;
  font-size: 13px;
}
.log-desc {
  color: #334155;
  padding: 10px 12px;
  background: #f0fdf4;
  border-radius: 8px;
  line-height: 1.5;
  margin-bottom: 10px;
  font-size: 14px;
}
.log-video a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
