import { createRouter, createWebHistory } from 'vue-router';
import ViewEmployees from '../pages/view_employees.vue';
import EditEmployeePage from '../pages/edit_employee_page.vue';

const routes = [
  {
    path: '/',
    name: 'view_employees',
    component: ViewEmployees,
  },
  {
    path: '/edit-employee/:employeeId',
    name: 'edit_employee',
    component: EditEmployeePage,
    props: true,
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
