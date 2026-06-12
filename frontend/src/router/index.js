import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Spots',
    component: () => import('../views/Spots.vue'),
  },
  {
    path: '/spot/:id',
    name: 'SpotDetail',
    component: () => import('../views/SpotDetail.vue'),
  },
  {
    path: '/checkins',
    name: 'Checkins',
    component: () => import('../views/Checkins.vue'),
  },
  {
    path: '/logs',
    name: 'SurfLogs',
    component: () => import('../views/SurfLogs.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
