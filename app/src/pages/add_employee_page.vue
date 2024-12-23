<template>
  <employee-add-page :userId="userRoleId" />
</template>

<script>
import EmployeeAddPage from "../shared/components/add_employee.vue";

export default {
  components: {
    EmployeeAddPage,
  },
  data() {
    return {
      userRoleId: parseInt(this.$route.query.userId) || 1, 
    };
  },
}; 
</script>
