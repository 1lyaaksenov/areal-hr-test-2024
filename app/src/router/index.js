import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/login_user_page.vue';
import ViewEmployees from '../pages/view_employees.vue';
import EditEmployeePage from '../pages/edit_employee_page.vue';
import AddEmployeesPage from "../pages/add_employee_page.vue";
import RegisterUserPage from "../pages/register_user_page.vue";

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/employees',
    name: 'view_employees',
    component: ViewEmployees,
    props: (route) => ({
      roleId: Number(route.query.roleId),
      userId: Number(route.query.userId),
    }),
  },
  {
    path: '/employee/edit/:id',
    name: 'editEmployee',
    component: EditEmployeePage,
    props: (route) => ({
      userId: Number(route.query.userId),
      roleId: Number(route.query.roleId),
    }),
  },
  {
    path: '/employees/add',
    name: 'add_employee_page',
    component: AddEmployeesPage,
    props: (route) => ({
      userId: Number(route.query.userId),
      roleId: Number(route.query.roleId),
    }),
  },
  {
    path: "/user/add",
    name: "addUser",
    component: RegisterUserPage,
    props: (route) => ({
      userId: Number(route.query.userId),
      roleId: Number(route.query.roleId),
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
