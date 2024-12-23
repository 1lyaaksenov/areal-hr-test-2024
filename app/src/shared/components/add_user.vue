<template>
  <div class="register-user-page">
    <h1>Добавить пользователя</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="login">Логин:</label>
        <input type="text" id="login" v-model="userData.login" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="userData.password" required />
      </div>
      <div class="form-group">
        <label for="role_id">Роль:</label>
        <select v-model="userData.role_id" required>
          <option value="1">Редактор</option>
          <option value="2">Просматривающий</option>
        </select>
      </div>
      <button type="submit" class="submit-button">Добавить пользователя</button>
    </form>
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
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await api.registerUser(this.userData);
        alert("Пользователь успешно добавлен!");
        this.$router.push({ name: "view_employees" });
      } catch (error) {
        console.error("Ошибка при добавлении пользователя:", error);
        alert("Ошибка: не удалось добавить пользователя");
      }
    },
  },
};
</script>

<style scoped>
.register-user-page {
  padding: 2rem;
}

h1 {
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 1rem;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
