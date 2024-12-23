<template>
  <div class="page-container">
    <LoginUser />
  </div>
</template>

<script>
import LoginUser from "../shared/components/login_user.vue";

export default {
  name: "LoginPage",
  components: {
    LoginUser,
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}
</style>
