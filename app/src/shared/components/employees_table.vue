<template>
  <div class="employees-page">
    <header>
      <h1>Сотрудники</h1>
    </header>
    <table class="employees-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Отчество</th>
          <th>Дата рождения</th>
          <th>Паспортные данные</th>
          <th>Дата выдачи паспорта</th>
          <th>Адрес</th>
          <th>Зарплата</th>
          <th>Департамент</th>
          <th>Организация</th>
          <th>Должность</th>
          <th>Фото</th>
          <th v-if="roleId === 1">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.employee_id">
          <td>{{ employee.employee_id }}</td>
          <td>{{ employee.last_name }}</td>
          <td>{{ employee.first_name }}</td>
          <td>{{ employee.middle_name }}</td>
          <td>{{ formatDate(employee.date_of_birth) }}</td>
          <td>{{ employee.passport_details }}</td>
          <td>{{ formatDate(employee.passport_issued_date) }}</td>
          <td>{{ employee.address }}</td>
          <td>{{ formatSalary(employee.salary) }}</td>
          <td>{{ employee.department_name }}</td>
          <td>{{ employee.organization_name }}</td>
          <td>{{ employee.position_name }}</td>
          <td>
            <img :src="employee.file_path" alt="Фото сотрудника" class="employee-photo" />
          </td>
          <td v-if="roleId === 1">
            <button class="action-button edit" @click="editEmployee(employee.employee_id, userId)">Изменить</button>
            <button class="action-button dismiss" @click="dismissEmployee(employee)">Уволить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="action-buttons">
      <button v-if="roleId === 1" @click="addEmployee" class="add-button">Добавить сотрудника</button>
      <button v-if="roleId === 1" @click="addUser" class="add-button">Добавить пользователя</button>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'EmployeeTable',
  props: {
    roleId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    employees: {
      type: Array,
      required: true,
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    formatSalary(salary) {
      return new Intl.NumberFormat('ru-RU').format(salary) + ' руб.';
    },

    editEmployee(employeeId, userId) {
      this.$router.push({
        name: 'editEmployee',
        params: { id: employeeId },
        query: { userId: userId }
      });
    },

    async dismissEmployee(employee) {
      try {
        const status = 'Уволен';

        const response = await api.updateEmployeeStatus({
          employeeId: employee.employee_id,
          status,  
          userId: this.userId,
        });

        this.$emit('update');
        alert(response.data.message);

      } catch (error) {
        console.error("Ошибка при обновлении статуса сотрудника", error);
        alert("Произошла ошибка при обновлении статуса сотрудника");
      }
    },

    addEmployee() {
      this.$router.push({
        name: 'add_employee_page',
        query: { userId: this.userId },
      });
    },

    addUser() {
      this.$router.push({ name: 'addUser' });
    },
  },
};
</script>

<style scoped>
.employees-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.employees-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.employees-table th, .employees-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.employees-table th {
  background-color: #f1f1f1;
  font-weight: bold;
}

.employee-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.action-button {
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  margin: 0 5px;
}

.action-button.edit {
  background-color: #4CAF50;
  color: white;
}

.action-button.dismiss {
  background-color: #f44336;
  color: white;
}

.action-buttons {
  text-align: center;
  margin-top: 20px;
}

.add-button {
  padding: 12px 20px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #0056b3;
}
</style>
