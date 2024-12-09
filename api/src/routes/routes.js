const express = require('express');
const userController = require('../controlers/actions_with_db');

const router = express.Router();

// Получить всех пользователей
router.get('/users', userController.getUsers);

// Получить пользователя по ФИО
router.get('/users/fullname/:lastName/:firstName/:middleName', userController.getUserByFullName);

// Получить пользователей по должности
router.get('/users/position/:positionName', userController.getUsersByPosition);

// Получить пользователей по организации
router.get('/users/organization/:organizationName', userController.getUsersByOrganization);

// // Обновить статус пользователя
// router.put('/users/status', userController.updateUserStatus);

// Удалить пользователя
router.delete('/users/:employeeId', userController.deleteUser);

// Обновить данные пользователя
router.put('/users/:employeeId', userController.updateUser);

module.exports = router;