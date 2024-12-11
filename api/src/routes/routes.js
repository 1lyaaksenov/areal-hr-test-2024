const express = require('express');
const userController = require('../controlers/actions_with_db');

const router = express.Router();

// Получить всех пользователей
router.get('/users', userController.getEmployees);
// Получить пользователя по ФИО
router.get('/users/fullname/:lastName/:firstName/:middleName', userController.getEmployeeByFullName);
// Получить пользователей по должности
router.get('/users/position/:positionName', userController.getEmployeesByPosition);
// Получить пользователей по организации
router.get('/users/organization/:organizationName', userController.getEmployeesByOrganization);
// Проверка логина и пароля
router.post('/users/verify', userController.verifyUser);
// Обновить данные пользователя
router.put('/users/:employeeId', userController.updateEmployee);
// Обновить статус сотрудника
router.put('/users/status', userController.updateEmployeeStatus);

module.exports = router;