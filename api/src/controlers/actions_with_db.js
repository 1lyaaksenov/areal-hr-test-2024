const { pool } = require('../db/database');

// Проверка логина и пароля пользователя
const verifyUser = async (req, res) => {
  try {
      const { login, password } = req.body;
      const query = `
          SELECT COUNT(*) AS count 
          FROM users 
          WHERE login = $1 AND password = $2;
      `;

      const result = await pool.query(query, [login, password]);

      if (result.rows[0].count > 0) {
          res.status(200).json({ message: 'Успешная авторизация' });
      } else {
          res.status(401).json({ error: 'Неверный логин или пароль' });
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Ошибка при проверке логина и пароля' });
  }
};

// Получение списка пользователей
const getEmployees = async (req, res) => {
  try {
      const query = `
          SELECT 
              e.employee_id,
              e.last_name,
              e.first_name,
              e.middle_name,
              e.date_of_birth,
              e.passport_details,
              e.passport_issued_date,
              e.address,
              e.salary,
              d.name AS department_name,
              o.name AS organization_name,
              p.name AS position_name,
              f.file_name,
              f.file_path
          FROM 
              employees e
          LEFT JOIN 
              hr_operations ho ON e.employee_id = ho.employee_id
          LEFT JOIN 
              departments d ON ho.department_id = d.department_id
          LEFT JOIN 
              organizations o ON d.organization_id = o.organization_id
          LEFT JOIN 
              positions p ON ho.position_id = p.position_id
          LEFT JOIN 
              files f ON e.employee_id = f.employee_id;
      `;

      const result = await pool.query(query);

      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Ошибка при выполнении запроса' });
  }
};

// Добавление записи в change_history
const addChangeHistory = async (req, res) => {
    try {
        const { operationObject, changeFields, userId } = req.body;
        const operationTimestamp = new Date().toISOString();
        const query = `
            INSERT INTO change_history (
                operation_timestamp, operation_object, change_fields, user_id
            ) VALUES ($1, $2, $3, $4);
        `;

        await pool.query(query, [operationTimestamp, operationObject, changeFields, userId]);

        res.status(201).json({ message: 'Запись успешно добавлена в историю изменений' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Ошибка при добавлении записи в историю изменений' });
    }
};

const getEmployeeByFullName = async (req, res) => {
  const { lastName, firstName, middleName } = req.params;
  try {
    const query = `
      SELECT 
        e.employee_id,
        e.last_name,
        e.first_name,
        e.middle_name,
        e.date_of_birth,
        e.passport_details,
        e.passport_issued_date,
        e.address,
        e.salary,
        d.name AS department_name,
        o.name AS organization_name,
        p.name AS position_name,
        f.file_id,
        f.file_name,
        f.file_path
      FROM 
        employees e
      LEFT JOIN 
        hr_operations ho ON e.employee_id = ho.employee_id
      LEFT JOIN 
        departments d ON ho.department_id = d.department_id
      LEFT JOIN 
        organizations o ON d.organization_id = o.organization_id
      LEFT JOIN 
        positions p ON ho.position_id = p.position_id
      LEFT JOIN 
        files f ON e.employee_id = f.employee_id
      WHERE 
        e.last_name = $1 
        AND e.first_name = $2 
        AND (e.middle_name = $3 OR e.middle_name IS NULL);
    `;

    const result = await pool.query(query, [lastName, firstName, middleName]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка при выполнении запроса' });
  }
};

const getEmployeesByPosition = async (req, res) => {
  const { positionName } = req.params;
  try {
    const query = `
      SELECT 
        e.employee_id,
        e.last_name,
        e.first_name,
        e.middle_name,
        e.date_of_birth,
        e.passport_details,
        e.passport_issued_date,
        e.address,
        e.salary,
        d.name AS department_name,
        o.name AS organization_name,
        p.name AS position_name,
        f.file_id,
        f.file_name,
        f.file_path
      FROM 
        employees e
      LEFT JOIN 
        hr_operations ho ON e.employee_id = ho.employee_id
      LEFT JOIN 
        departments d ON ho.department_id = d.department_id
      LEFT JOIN 
        organizations o ON d.organization_id = o.organization_id
      LEFT JOIN 
        positions p ON ho.position_id = p.position_id
      LEFT JOIN 
        files f ON e.employee_id = f.employee_id
      WHERE 
        p.name = $1;
    `;

    const result = await pool.query(query, [positionName]);

    res.status(200).json(result.rows);
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка при выполнении запроса' });
  }
};

const getEmployeesByOrganization = async (req, res) => {
  const { organizationName } = req.params;
  try {
    const query = `
      SELECT 
        e.employee_id,
        e.last_name,
        e.first_name,
        e.middle_name,
        e.date_of_birth,
        e.passport_details,
        e.passport_issued_date,
        e.address,
        e.salary,
        ho.status,  -- Заменили на поле status из hr_operations
        d.name AS department_name,
        o.name AS organization_name,
        p.name AS position_name,
        f.file_id,
        f.file_name,
        f.file_path
      FROM 
        employees e
      LEFT JOIN 
        hr_operations ho ON e.employee_id = ho.employee_id
      LEFT JOIN 
        departments d ON ho.department_id = d.department_id
      LEFT JOIN 
        organizations o ON d.organization_id = o.organization_id
      LEFT JOIN 
        positions p ON ho.position_id = p.position_id
      LEFT JOIN 
        files f ON e.employee_id = f.employee_id
      WHERE 
        o.name = $1;
    `;

    const result = await pool.query(query, [organizationName]);

    res.status(200).json(result.rows);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка при выполнении запроса' });
  }
};

const updateEmployeeStatus = async (req, res) => {
  const { employeeId, status, userId } = req.body;
  try {
    const result = await pool.query(`
      UPDATE hr_operations
      SET status = $1
      WHERE employee_id = $2
      RETURNING employee_id;
    `, [status, employeeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Пользователь не найден или операция не существует' });
    }

    await addChangeHistory({
      operationObject: `Employee ${employeeId}`,
      changeFields: `status updated to ${status}`,
      userId
    });

    res.status(200).json({ message: 'Статус пользователя обновлен' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { lastName, firstName, middleName, address, salary, departmentId, positionId, status, userId } = req.body;

  try {
    const result = await pool.query(`
      UPDATE employees
      SET 
        last_name = $1,
        first_name = $2,
        middle_name = $3,
        address = $4,
        salary = $5,
        department_id = $6,
        position_id = $7
      WHERE employee_id = $8
      RETURNING employee_id;
    `, [lastName, firstName, middleName, address, salary, departmentId, positionId, employeeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const statusResult = await pool.query(`
      UPDATE hr_operations
      SET status = $1
      WHERE employee_id = $2
      RETURNING employee_id;
    `, [status, employeeId]);

    if (statusResult.rowCount === 0) {
      return res.status(404).json({ message: 'Статус для пользователя не найден' });
    }

    await addChangeHistory({
      operationObject: `Employee ${employeeId}`,
      changeFields: `Updated fields: ${JSON.stringify(req.body)}`,
      userId
    });

    res.status(200).json({ message: 'Данные пользователя успешно обновлены' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const registerUser = async (req, res) => {
//   const { lastName, firstName, middleName, login, password, roleId } = req.body;

//   const bcrypt = require('bcrypt');
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(password, saltRounds);

//   try {
//       const existingUser = await pool.query(`
//           SELECT * FROM users WHERE login = $1
//       `, [login]);

//       if (existingUser.rowCount > 0) {
//           return res.status(400).json({ message: 'Логин уже существует' });
//       }
 
//       const result = await pool.query(`
//           INSERT INTO users (last_name, first_name, patronymic, login, password, role_id)
//           VALUES ($1, $2, $3, $4, $5, $6)
//           RETURNING user_id, login;
//       `, [lastName, firstName, middleName, login, hashedPassword, roleId]);

//       const newUser = result.rows[0];
//       res.status(201).json({
//           message: 'Пользователь зарегистрирован',
//           user: {
//               user_id: newUser.user_id,
//               login: newUser.login
//           }
//       });

//   } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ error: 'Ошибка при выполнении запроса' });
//   }
// };


module.exports = {
  getEmployees,
  getEmployeeByFullName,
  // registerUser,
  getEmployeesByPosition,
  getEmployeesByOrganization,
  updateEmployeeStatus,
  updateEmployee,
  verifyUser,
};
  