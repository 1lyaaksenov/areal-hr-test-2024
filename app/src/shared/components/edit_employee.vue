<template>
  <div class="employee-update-page">
    <h1>Обновить данные сотрудника</h1>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <form v-if="!loading && !error" @submit.prevent="handleSubmit" class="update-form" enctype="multipart/form-data">
      <div class="form-group" v-for="(field, key) in formFields" :key="key">
        <label :for="key">{{ field.label }}:</label>
        <input
          v-if="field.type !== 'textarea' && field.type !== 'file'"
          :type="field.type"
          :id="key"
          v-model="employeeData[key]"
          :required="field.required"
        />
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="key"
          v-model="employeeData[key]"
          :required="field.required"
        ></textarea>
        <input
          v-else-if="field.type === 'file'"
          type="file"
          :id="key"
          @change="handleFileChange"
        />
      </div>
      <button type="submit" class="submit-button">Обновить данные</button>
    </form>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'EmployeeUpdate',
  data() {
    return {
      employeeData: {},
      formFields: {
        last_name: { label: 'Фамилия', type: 'text', required: true },
        first_name: { label: 'Имя', type: 'text', required: true },
        middle_name: { label: 'Отчество', type: 'text', required: true },
        date_of_birth: { label: 'Дата рождения', type: 'date', required: true },
        passport_details: { label: 'Паспортные данные', type: 'text', required: true },
        passport_issued_date: { label: 'Дата выдачи паспорта', type: 'date', required: true },
        address: { label: 'Адрес', type: 'text', required: true },
        salary: { label: 'Зарплата', type: 'number', required: true },
        department_name: { label: 'Департамент', type: 'text', required: true },
        organization_name: { label: 'Организация', type: 'text', required: true },
        position_name: { label: 'Должность', type: 'text', required: true },
        photo: { label: 'Фото', type: 'file', required: false },
      },
      loading: true,
      error: '',
      file: null,
    };
  },
  mounted() {
    this.fetchEmployeeData();
  },
  methods: {
    async fetchEmployeeData() {
      try {
        const employeeId = this.$route.params.id;
        const response = await api.getEmployee(employeeId);
        this.employeeData = response.data;
        this.loading = false;
      } catch (error) {
        this.error = 'Ошибка загрузки данных сотрудника';
        this.loading = false;
      }
    },

    handleFileChange(event) {
      this.file = event.target.files[0];
    },

    async handleSubmit() {
      try {
        this.employeeData.status_name = 'Работает';
        const employeeId = this.$route.params.id;
        const userId = this.$route.query.userId;

        if (!userId) {
          this.error = 'Ошибка: не найден userId';
          return;
        }

        const formData = new FormData();

        for (const key in this.employeeData) {
          formData.append(key, this.employeeData[key]);
        }

        if (this.file) {
          formData.append('file', this.file);
        }

        await api.updateEmployee(employeeId, formData, userId);
        this.$router.push({ name: 'view_employees', query: { userId } });
      } catch (error) {
        this.error = 'Ошибка при обновлении данных';
      }
    },
  },
};
</script>

<style scoped>
.employee-update-page {
  padding: 20px;
}

.update-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
}

.loading {
  font-size: 18px;
  color: #666;
}
</style>
