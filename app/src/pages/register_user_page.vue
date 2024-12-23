<template>
    <div class="add-user-page">
      <RegisterUserPage />
    </div>
  </template>
  
  <script>
  import RegisterUserPage from "../shared/components/add_user.vue";
  
  export default {
    name: "AddUserPage",
    components: {
      RegisterUserPage,
    },
  };
  </script>
  
  <style scoped>
  .add-user-page {
    padding: 20px;
  }
  </style>
  