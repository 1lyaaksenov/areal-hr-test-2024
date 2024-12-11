<template>
    <div class="edit-employee-page">
      <h1>Изменить данные сотрудника</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="last_name">Фамилия:</label>
          <input type="text" id="last_name" v-model="employee.last_name" required />
        </div>
        <div class="form-group">
          <label for="first_name">Имя:</label>
          <input type="text" id="first_name" v-model="employee.first_name" required />
        </div>
        <div class="form-group">
          <label for="middle_name">Отчество:</label>
          <input type="text" id="middle_name" v-model="employee.middle_name" />
        </div>
        <div class="form-group">
          <label for="date_of_birth">Дата рождения:</label>
          <input type="date" id="date_of_birth" v-model="employee.date_of_birth" required />
        </div>
        <div class="form-group">
          <label for="passport_details">Паспортные данные:</label>
          <input type="text" id="passport_details" v-model="employee.passport_details" required />
        </div>
        <div class="form-group">
          <label for="passport_issued_date">Дата выдачи паспорта:</label>
          <input type="date" id="passport_issued_date" v-model="employee.passport_issued_date" required />
        </div>
        <div class="form-group">
          <label for="address">Адрес:</label>
          <input type="text" id="address" v-model="employee.address" required />
        </div>
        <div class="form-group">
          <label for="salary">Зарплата:</label>
          <input type="number" id="salary" v-model="employee.salary" min="0" step="0.01" required />
        </div>
        <div class="form-group">
          <label for="status_name">Статус:</label>
          <select id="status_name" v-model="employee.status_name" required>
            <option>Активен</option>
            <option>Уволен</option>
          </select>
        </div>
        <div class="form-group">
          <label for="department_name">Департамент:</label>
          <input type="text" id="department_name" v-model="employee.department_name" required />
        </div>
        <div class="form-group">
          <label for="organization_name">Организация:</label>
          <input type="text" id="organization_name" v-model="employee.organization_name" required />
        </div>
        <div class="form-group">
          <label for="position_name">Должность:</label>
          <input type="text" id="position_name" v-model="employee.position_name" required />
        </div>
        <div class="form-group">
          <label for="file_name">Имя файла:</label>
          <input type="text" id="file_name" v-model="employee.file_name" required />
        </div>
        <div class="form-group">
          <label for="file_path">Путь к файлу:</label>
          <input type="text" id="file_path" v-model="employee.file_path" required />
        </div>
        <div class="form-buttons">
          <button type="submit" class="save-button">Сохранить</button>
          <button type="button" class="cancel-button" @click="cancelEdit">Отмена</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import api from "../../services/api.js";
  
  export default {
    data() {
      return {
        employee: {
          employee_id: null,
          last_name: "",
          first_name: "",
          middle_name: "",
          date_of_birth: "",
          passport_details: "",
          passport_issued_date: "",
          address: "",
          salary: 0,
          status_name: "",
          department_name: "",
          organization_name: "",
          position_name: "",
          file_name: "",
          file_path: "",
        },
      };
    },
    async created() {
      const employeeId = this.$route.params.id;
      await this.fetchEmployeeData(employeeId);
    },
    methods: {
      async fetchEmployeeData(employeeId) {
        try {
          const response = await api.getUser(employeeId);
          this.employee = response.data;
        } catch (error) {
          console.error("Ошибка загрузки данных сотрудника:", error);
        }
      },
      async submitForm() {
        try {
          await api.updateUser(this.employee.employee_id, this.employee);
          alert("Данные успешно сохранены!");
          this.$router.push("/employees");
        } catch (error) {
          console.error("Ошибка при сохранении данных:", error);
          alert("Произошла ошибка при сохранении данных.");
        }
      },
      cancelEdit() {
        this.$router.push("/");
      },
    },
  };
  </script>
  
  <style>
  .edit-employee-page {
    padding: 2rem;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .save-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .save-button:hover {
    background-color: #45a049;
  }
  
  .cancel-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .cancel-button:hover {
    background-color: #da190b;
  }
  </style>
  