<template>
  <div class="employees-page">
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
          <th>Имя файла</th>
          <th>Фото</th>
          <th>Действия</th>
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
          <td>{{ employee.file_name }}</td>
          <td>
            <a :href="employee.file_path" target="_blank">{{ employee.file_path }}</a>
          </td>
          <td>
            <button class="action-button edit" @click="$emit('edit', employee.employee_id)">Изменить</button>
            <button class="action-button delete" @click="$emit('delete', employee.employee_id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    employees: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "—";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ru-RU", options);
    },
    formatSalary(salary) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(salary);
    },
  },
};
</script>

<style>
.employees-page {
  padding: 2rem;
  font-family: Arial, sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

header h1 {
  font-size: 1.8rem;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
}

.add-button:hover {
  background-color: #45a049;
}

.employees-table {
  width: 100%;
  border-collapse: collapse;
}

.employees-table th,
.employees-table td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: left;
}

.employees-table th {
  background-color: #f4f4f4;
}

.employees-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.employees-table tr:hover {
  background-color: #f1f1f1;
}

.action-button {
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.action-button.edit {
  background-color: #2196F3;
  color: white;
}

.action-button.edit:hover {
  background-color: #0b7dda;
}

.action-button.delete {
  background-color: #f44336;
  color: white;
}

.action-button.delete:hover {
  background-color: #da190b;
}
</style>
