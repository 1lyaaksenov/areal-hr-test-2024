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
import apiClient from '../../services/api';  // Импортируем API клиент

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

        // Сохраняем userId и roleId в sessionStorage для использования на других страницах
        sessionStorage.setItem('user_id', userId);
        sessionStorage.setItem('role_id', roleId);

        // Перенаправляем на страницу сотрудников
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
  border: 1px solid #ccc;
  border-radius: 5px;
}
.form-group {
  margin-bottom: 1em;
}
.error-message {
  color: red;
  font-size: 0.9em;
}
</style>
