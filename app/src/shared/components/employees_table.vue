<template>
  <div class="employees-page">
    <header>
      <h1>Список сотрудников</h1>
      <button class="add-button" @click="addEmployee">Добавить сотрудника</button>
    </header>

    <table class="employees-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Дата рождения</th>
          <th>Адрес</th>
          <th>Зарплата</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.employee_id">
          <td>{{ employee.employee_id }}</td>
          <td>{{ employee.last_name }}</td>
          <td>{{ employee.first_name }}</td>
          <td>{{ formatDate(employee.date_of_birth) }}</td>
          <td>{{ employee.address }}</td>
          <td>{{ formatSalary(employee.salary) }}</td>
          <td>
            <button class="action-button edit" @click="editEmployee(employee)">Изменить</button>
            <button class="action-button delete" @click="deleteEmployee(employee)">Уволить</button>
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
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ru-RU", options);
    },
    formatSalary(salary) {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(salary);
    },
    addEmployee() {
      // Логика добавления сотрудника
      alert("Добавить сотрудника");
    },
    editEmployee(employee) {
      // Логика изменения сотрудника
      alert(`Изменить сотрудника ID: ${employee.employee_id}`);
    },
    deleteEmployee(employee) {
      // Логика удаления сотрудника
      const confirmed = confirm(`Вы уверены, что хотите уволить сотрудника ${employee.last_name} ${employee.first_name}?`);
      if (confirmed) {
        alert(`Сотрудник ID: ${employee.employee_id} уволен`);
      }
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
