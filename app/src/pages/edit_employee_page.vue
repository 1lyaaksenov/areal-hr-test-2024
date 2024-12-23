<template>
  <div class="edit-employee-page-container">
    <edit-employee :userId="userId" :roleId="roleId" />
  </div>
</template>

<script>
import EditEmployee from "../shared/components/edit_employee.vue";

export default {
  name: "EditEmployeePage",
  components: {
    EditEmployee,
  },
  props: {
    userId: {
      type: Number,
      required: true,
    },
    roleId: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.edit-employee-page-container {
  padding: 2rem;
}
</style>
