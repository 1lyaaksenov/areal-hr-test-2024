const express = require('express');
const userController = require('../controlers/actions_with_db');

const router = express.Router();  

// Получить всех сотрудников
router.get('/employees', userController.getEmployees);
// Получить сотрудника по ФИО
router.get('/employees/fullname/:lastName/:firstName/:middleName', userController.getEmployeeByFullName);
// Получить сотрудников по должности
router.get('/employees/position/:positionName', userController.getEmployeesByPosition);
// Получить сотрудников по организации
router.get('/employees/organization/:organizationName', userController.getEmployeesByOrganization);
// Получить сотрудника по ID
router.get('/employee/:employeeId', userController.getEmployee);
// Проверка логина и пароля
router.post('/user/verify', userController.verifyUser);
// Обновить статус сотрудника
router.put('/employees/status', userController.updateEmployeeStatus);
// Обновить данные сотрудника
router.put('/employees/:employeeId', userController.upload.single('file'), userController.updateEmployee);
// Добавление сотрудника
router.post('/addemployee', userController.upload.single('file'), userController.addEmployee);
// Добавление пользователя 
router.post('/user', userController.registerUser)   
// Вывод истории изменений
router.get('/history', userController.getChangeHistory)

module.exports = router;