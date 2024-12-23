<template>
  <div class="add-employee-page">
    <h1>Добавить сотрудника</h1>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <form v-if="!loading && !error" @submit.prevent="handleSubmit" class="add-employee-form">
      <div class="form-group" v-for="(field, key) in formFields" :key="key">
        <label :for="key">{{ field.label }}:</label>
        <input
          v-if="field.type !== 'textarea'"
          :type="field.type"
          :id="key"
          v-model="employeeData[key]"
          :required="field.required"
        />
        <textarea
          v-else
          :id="key"
          v-model="employeeData[key]"
          :required="field.required"
        ></textarea>
      </div>
      <button type="submit" class="submit-button">Добавить сотрудника</button>
    </form>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'AddEmployeePage',
  props: {
    userId: {
      type: Number,
      required: true,
    },
    roleId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      employeeData: {
        last_name: '',
        first_name: '',
        middle_name: '',
        date_of_birth: '',
        passport_details: '',
        passport_issued_date: '',
        address: '',
        salary: '',
        status_name: '',
        department_name: '',
        organization_name: '',
        position_name: '',
        file_name: '',
        file_path: '',
      },
      loading: false,
      error: null,
      formFields: {
        last_name: { label: 'Фамилия', type: 'text', required: true },
        first_name: { label: 'Имя', type: 'text', required: true },
        middle_name: { label: 'Отчество', type: 'text', required: true },
        date_of_birth: { label: 'Дата рождения', type: 'date', required: true },
        passport_details: { label: 'Паспортные данные', type: 'text', required: true },
        passport_issued_date: { label: 'Дата выдачи паспорта', type: 'date', required: true },
        address: { label: 'Адрес', type: 'text', required: true },
        salary: { label: 'Зарплата', type: 'number', required: true },
        status_name: { label: 'Статус', type: 'text', required: true },
        department_name: { label: 'Департамент', type: 'text', required: true },
        organization_name: { label: 'Организация', type: 'text', required: true },
        position_name: { label: 'Должность', type: 'text', required: true },
        file_name: { label: 'Имя файла', type: 'text', required: true },
        file_path: { label: 'Путь к файлу', type: 'text', required: true },
      },
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      try {
        const { userId } = this.$route.query;
        await api.addEmployee({ ...this.employeeData, userId });
        this.$router.push({
          name: 'view_employees',
          query: { userId, roleId: this.roleId },
        });
      } catch (error) {
        this.error = 'Ошибка при добавлении сотрудника';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.add-employee-page {
  padding: 20px;
}

.add-employee-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 10px;
}

.submit-button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.loading {
  color: green;
}

.error {
  color: red;
}
</style>
