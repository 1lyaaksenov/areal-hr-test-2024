  import axios from 'axios'; 

  const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  export default {
    // Получить список всех сотрудников
    getEmployees() {
      return apiClient.get('/employees');
    },

    // Получить сотрудника по ФИО
    getEmployeeByFullName(lastName, firstName, middleName) {
      return apiClient.get(`/employees/fullname/${lastName}/${firstName}/${middleName}`);
    },

    // Получить сотрудников по должности
    getEmployeesByPosition(positionName) {
      return apiClient.get(`/employees/position/${positionName}`);
    },

    // Получить сотрудников по организации
    getEmployeesByOrganization(organizationName) {
      return apiClient.get(`/employees/organization/${organizationName}`);
    },

    updateEmployeeStatus({ employeeId, status, userId }) {
      return apiClient.put('/employees/status', { employeeId, status, userId});
    },

    // Удалить сотрудника
    deleteEmployee(employeeId) {
      return apiClient.delete(`/employees/${employeeId}`);
    },

    // Обновить данные сотрудника
    updateEmployee(employeeId, data) {
      return apiClient.put(`/employees/${employeeId}`, data);
    },

    // Проверка логина и пароля
    verifyUser(login, password) {
      return apiClient.post('/user/verify', { login, password });
    },

    // Получить сотрудника по ID
    getEmployee(employeeId) {
      return apiClient.get(`/employee/${employeeId}`);
    },
    
    addEmployee(employeeData) {
      return apiClient.post('/employees', employeeData);
    },

    registerUser(userData){
      return apiClient.post('/user', userData);
    }
  };
