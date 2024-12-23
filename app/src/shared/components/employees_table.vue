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

    <button v-if="roleId === 1" @click="addEmployee" class="add-button">Добавить сотрудника</button>
    <br>
    <button v-if="roleId === 1" @click="addUser" class="add-button">Добавить пользователя</button>
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
        
        // Обновляем статус сотрудника через API
        const response = await api.updateEmployeeStatus({
          employeeId: employee.employee_id,
          status,  // Устанавливаем статус "Уволен"
          userId: this.userId,
        });

        // После успешного обновления, вызываем событие обновления на родительском компоненте
        this.$emit('update');
        alert(response.data.message);  // Выводим сообщение о успешном обновлении

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
}

.employees-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.employees-table th, .employees-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.employee-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.action-button {
  padding: 5px 10px;
  cursor: pointer;
}

.action-button.edit {
  background-color: #ffa500;
  color: white;
}

.action-button.dismiss {
  background-color: red;
  color: white;
}

.add-button {
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
