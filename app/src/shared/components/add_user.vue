<template>
  <div class="register-user-page">
    <h1>Добавить пользователя</h1>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <form v-if="!loading && !error" @submit.prevent="submitForm" class="register-user-form">
      <div class="form-group">
        <label for="login">Логин:</label>
        <input
          type="text"
          id="login"
          v-model="userData.login"
          required
          class="input-field"
        />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          type="password"
          id="password"
          v-model="userData.password"
          required
          class="input-field"
        />
      </div>
      <div class="form-group">
        <label for="role_id">Роль:</label>
        <select v-model="userData.role_id" required class="input-field">
          <option value="1">Редактор</option>
          <option value="2">Просматривающий</option>
        </select>
      </div>
      <button type="submit" class="submit-button">Добавить пользователя</button>
    </form>

    <div v-if="userData.user_id" class="user-info">
      <p>Пользователь успешно добавлен!</p>
      <p><strong>ID пользователя:</strong> {{ userData.user_id }}</p>
      <p><strong>Роль пользователя:</strong> {{ userData.role_id }}</p>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "RegisterUserPage",
  data() {
    return {
      userData: {
        login: "",
        password: "",
        role_id: 2,
        user_id: null,
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      try {
        const response = await api.registerUser(this.userData);
        this.userData.user_id = response.user.user_id;
        this.userData.role_id = response.user.role_id;
        alert("Пользователь успешно добавлен!");
        this.$router.push({ name: "view_employees" });
      } catch (error) {
        this.error = "Ошибка при добавлении пользователя";
        console.error("Ошибка при добавлении пользователя:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-user-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.register-user-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
}

.input-field {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.submit-button {
  padding: 12px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

.loading {
  color: #4caf50;
  text-align: center;
  margin-bottom: 20px;
}

.error {
  color: #f44336;
  text-align: center;
  margin-bottom: 20px;
}

.user-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 4px;
  text-align: center;
}

.user-info p {
  margin: 5px 0;
}
</style>
