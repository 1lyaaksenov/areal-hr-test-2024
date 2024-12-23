<template>
  <div class="login-container">
    <h2>Вход в систему</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="login">Логин:</label>
        <input
          v-model="login"
          type="text"
          id="login"
          placeholder="Введите ваш логин"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Введите ваш пароль"
          required
        />
      </div>
      
      <button type="submit" class="btn">Войти</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import apiClient from '../../services/api'; 

export default {
  data() {
    return {
      login: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await apiClient.verifyUser(this.login, this.password);
        const { userId, roleId } = response.data;

        sessionStorage.setItem('user_id', userId);
        sessionStorage.setItem('role_id', roleId);

        this.$router.push({ name: 'view_employees', query: { userId, roleId } });
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Ошибка авторизации';
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #1e3a8a;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  color: #1e3a8a;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #1e3a8a;
  border-radius: 5px;
  font-size: 16px;
  color: #1e3a8a;
  background-color: #ffffff;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  border-color: #0c2c68;
  outline: none;
}

button.btn {
  width: 100%;
  padding: 10px;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

button.btn:hover {
  background-color: #0c2c68;
}

.error-message {
  color: #d32f2f;
  font-size: 0.9em;
  text-align: center;
  margin-top: 10px;
}
</style>
