<template>
  <div>
    <EmployeesTable
      :employees="employees"
      :roleId="userRoleId"
      @dismiss="markAsDismissed"
      @edit="editEmployee"
      :userId="userId"
    />
  </div>
</template>

<script>
import EmployeesTable from "../shared/components/employees_table.vue";
import api from "../services/api.js";

export default {
  components: { EmployeesTable },
  data() {
    return {
      employees: [],
      userRoleId: null,
      userId: null,  
    };
  },
  async created() {
    this.userRoleId = parseInt(this.$route.query.roleId) || 1; 
    this.userId = parseInt(this.$route.query.userId) || 1;
    this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await api.getEmployees();
        this.employees = response.data;
      } catch (error) {
        console.error("Ошибка загрузки сотрудников:", error);
      }
    },
    async markAsDismissed(employee) {
      try {
        const confirmed = confirm("Вы уверены, что хотите уволить сотрудника?");
        if (confirmed) {
          await api.updateEmployeeStatus(employee.employee_id, "Уволен", this.userRoleId);
          window.location.reload();
        }
      } catch (error) {
        console.error("Ошибка при изменении статуса сотрудника:", error);
        alert("Не удалось изменить статус сотрудника");
      }
    },
    editEmployee(employeeId) {
      this.$router.push({
        path: `/edit-employee/${employeeId}`,
        query: { userId: this.userId }, 
      });
    },
  },
};
</script>

<style>
.add-button {
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.add-button:hover {
  background-color: #45a049;
}
</style>
