<template>
  <div>
    <h1>Сотрудники</h1>
    <EmployeesTable
      :employees="employees"
      @delete="deleteEmployee"
      @edit="editEmployee"
    />
    <button @click="addEmployee" class="add-button">Добавить сотрудника</button>
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
    };
  },
  async created() {
    this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await api.getUsers();
        this.employees = response.data;
      } catch (error) {
        console.error("Ошибка загрузки сотрудников:", error);
      }
    },
    async deleteEmployee(employeeId) {
      try {
        const confirmed = confirm("Вы уверены, что хотите удалить сотрудника?");
        if (confirmed) {
          await api.deleteUser(employeeId);
          this.fetchEmployees();
        }
      } catch (error) {
        console.error("Ошибка при удалении сотрудника:", error);
      }
    },
    editEmployee(employeeId) {
      this.$router.push(`/edit-employee/${employeeId}`);
    },
    addEmployee() {
      alert("Добавить нового сотрудника");
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
