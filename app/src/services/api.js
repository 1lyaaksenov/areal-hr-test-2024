import axios from 'axios';

// Настройка базового клиента API
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Убедитесь, что порт и адрес совпадают с вашим сервером
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Получить список всех сотрудников
  getUsers() {
    return apiClient.get('/users');
  },

  // Получить сотрудника по ФИО
  getUserByFullName(lastName, firstName, middleName) {
    return apiClient.get(`/users/fullname/${lastName}/${firstName}/${middleName}`);
  },

  // Получить сотрудников по должности
  getUsersByPosition(positionName) {
    return apiClient.get(`/users/position/${positionName}`);
  },

  // Получить сотрудников по организации
  getUsersByOrganization(organizationName) {
    return apiClient.get(`/users/organization/${organizationName}`);
  },

  // Обновить статус сотрудника
  updateUserStatus(employeeId, status) {
    return apiClient.put(`/users/status`, { employeeId, status });
  },

  // Удалить сотрудника
  deleteUser(employeeId) {
    return apiClient.delete(`/users/${employeeId}`);
  },

  // Обновить данные сотрудника
  updateUser(employeeId, data) {
    return apiClient.put(`/users/${employeeId}`, data);
  },
};
