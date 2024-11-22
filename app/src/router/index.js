import { createRouter, createWebHistory } from 'vue-router';
import vuew_employees from '../pages/view_employees.vue';

const routes = [
  { path: '/', name: 'vuew_employees', component: vuew_employees },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
