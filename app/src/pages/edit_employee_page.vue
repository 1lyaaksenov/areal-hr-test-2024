<template>
    <div class="edit-employee-page-container">
      <edit-employee />
    </div>
  </template>
  
  <script>
  import EditEmployee from "@/shared/components/edit_employee.vue";
  
  export default {
    name: "EditEmployeePage",
    components: {
      EditEmployee,
    },
  };
  </script>
  
  <style scoped>
  .edit-employee-page-container {
    padding: 2rem;
  }
  </style>
  