const { pool } = require('../db/database');
const multer = require('multer');
const path = require('path');
const argon2 = require('argon2');

// Проверка логина и пароля пользователя
const verifyUser = async (req, res) => {
  try {
    const { login, password } = req.body;
    const query = `
      SELECT user_id, role_id, password
      FROM users
      WHERE login = $1;
    `;

    const result = await pool.query(query, [login]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const { user_id: userId, role_id: roleId, password: storedPassword } = result.rows[0];

    const isValidPassword = await argon2.verify(storedPassword, password);

    if (isValidPassword) {
      res.status(200).json({ message: 'Успешная авторизация', userId, roleId });
    } else {
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка при проверке логина и пароля' });
  }
};

// Получение сотрудника по ID
const getEmployee = async (req, res) => {
  try {
      const { employeeId } = req.params;
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
              files f ON e.employee_id = f.employee_id
          WHERE e.employee_id = $1;
      `;

      const result = await pool.query(query, [employeeId]); 

      if (result.rows.length > 0) {
          res.status(200).json(result.rows[0]); 
      } else {
          res.status(404).json({ error: 'Сотрудник не найден' });
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Ошибка при выполнении запроса' });
  }
};

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
              files f ON e.employee_id = f.employee_id
          WHERE 
              ho.status != 'Уволен';
      `;

      const result = await pool.query(query);

      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Ошибка при выполнении запроса' });
  }
};

const addChangeHistory = async ({ operationObject, changeFields, userId }) => {
  try {
      const operationTimestamp = new Date().toISOString();
      const query = `
          INSERT INTO change_history (
              operation_timestamp, operation_object, change_fields, user_id
          ) VALUES ($1, $2, $3, $4);
      `;

      await pool.query(query, [operationTimestamp, operationObject, changeFields, userId]);

      console.log('Запись успешно добавлена в историю изменений');
  } catch (err) {
      console.error('Ошибка при добавлении записи в историю изменений:', err.message);
      throw new Error('Ошибка записи в историю изменений');
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
  const { 
    last_name,
    first_name, 
    middle_name,
    date_of_birth,
    passport_details,
    passport_issued_date,
    address,
    salary,
    status_name,
    department_name,
    organization_name,
    position_name,
    userId
    } = req.body;

  const file = req.file;
  const filePath = file ? `/img/${file.filename}` : null;
  try {

    let organizationId = await getOrCreateOrganization(organization_name);

    let departmentId = await getOrCreateDepartment(department_name, organizationId);

    let positionId = await getOrCreatePosition(position_name);

    const result = await pool.query(
      `
      UPDATE employees
      SET 
        last_name = $1,
        first_name = $2,
        middle_name = $3,
        date_of_birth = $4,
        passport_details = $5,
        passport_issued_date = $6,
        address = $7,
        salary = $8
      WHERE employee_id = $9
      RETURNING employee_id;
      `,
      [
        last_name,
        first_name,
        middle_name,
        date_of_birth,
        passport_details,
        passport_issued_date,
        address,
        salary,
        employeeId
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Сотрудник не найден' });
    }

    const hrOperationResult = await pool.query(
      `
      SELECT operation_id 
      FROM hr_operations
      WHERE employee_id = $1 AND department_id = $2;
      `,
      [employeeId, departmentId]
    );

    if (hrOperationResult.rowCount === 0) {
      await pool.query(
        `
        INSERT INTO hr_operations (employee_id, department_id, position_id, status)
        VALUES ($1, $2, $3, $4);
        `,
        [employeeId, departmentId, positionId, status_name]
      );
    } else {
      await pool.query(
        `
        UPDATE hr_operations
        SET 
          position_id = $1,
          status = $2
        WHERE employee_id = $3 AND department_id = $4;
        `,
        [positionId, status_name, employeeId, departmentId]
      );
    }

    if (filePath) {
      await pool.query(
        `
        UPDATE files
        SET 
          file_name = $1,
          file_path = $2
        WHERE employee_id = $3;
        `,
        [file.originalname, filePath, employeeId]
      );
    }

    await addChangeHistory({
      operationObject: `Employee ${employeeId}`,
      changeFields: `Updated fields: ${JSON.stringify(req.body)}`,
      userId
    });

    res.status(200).json({ message: 'Данные сотрудника успешно обновлены' });
  } catch (err) {
    console.error("Ошибка в updateEmployee:", err);
    res.status(500).json({ error: err.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../../files'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage }).single('file');

const addEmployee = async (req, res) => {
  const {
    last_name,
    first_name,
    middle_name,
    date_of_birth,
    passport_details,
    passport_issued_date,
    address,
    salary,
    department_name,
    organization_name,
    position_name,
    userId,
  } = req.body;

  const file = req.file; 
  const filePath = file ? `/img/${file.filename}` : null;

  const client = await pool.connect();

  try {
    let organizationId = await getOrCreateOrganization(organization_name);
    let departmentId = await getOrCreateDepartment(department_name, organizationId);
    let positionId = await getOrCreatePosition(position_name);

    const employeeResult = await client.query(
      `INSERT INTO employees (
        last_name, first_name, middle_name, date_of_birth, 
        passport_details, passport_issued_date, address, salary
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING employee_id`,
      [
        last_name, first_name, middle_name, date_of_birth,
        passport_details, passport_issued_date, address, salary,
      ]
    );

    const employeeId = employeeResult.rows[0].employee_id;

    await client.query(
      `INSERT INTO hr_operations (employee_id, department_id, position_id, status)
      VALUES ($1, $2, $3, 'Работает')`,
      [employeeId, departmentId, positionId]
    );

    if (filePath) {
      await client.query(
        `INSERT INTO files (employee_id, file_name, file_path)
        VALUES ($1, $2, $3)`,
        [employeeId, file.originalname, filePath]
      );
    }

    await addChangeHistory({
      operationObject: `Employee ${employeeId}`,
      changeFields: `Added new employee: ${JSON.stringify(req.body)}`,
      userId,
    }, client);

    await client.query('COMMIT');

    res.status(201).json({ message: 'Сотрудник успешно добавлен', employeeId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Ошибка в addEmployee:", err);
    res.status(500).json({ error: 'Ошибка при добавлении сотрудника' });
  } finally {
    client.release();
  }
};

const getOrCreateOrganization = async (organization_name) => {
  const result = await pool.query(
    `SELECT organization_id FROM organizations WHERE name = $1`,
    [organization_name]
  );

  if (result.rowCount > 0) {
    return result.rows[0].organization_id;
  }

  const insertResult = await pool.query(
    `INSERT INTO organizations (name) VALUES ($1) RETURNING organization_id`,
    [organization_name]
  );
  return insertResult.rows[0].organization_id;
};

const getOrCreateDepartment = async (department_name, organizationId) => {
  const result = await pool.query(
    `SELECT department_id FROM departments WHERE name = $1 AND organization_id = $2`,
    [department_name, organizationId]
  );

  if (result.rowCount > 0) {
    return result.rows[0].department_id;
  }

  const insertResult = await pool.query(
    `INSERT INTO departments (name, organization_id) VALUES ($1, $2) RETURNING department_id`,
    [department_name, organizationId]
  );
  return insertResult.rows[0].department_id;
};

const getOrCreatePosition = async (position_name) => {
  const result = await pool.query(
    `SELECT position_id FROM positions WHERE name = $1`,
    [position_name]
  );

  if (result.rowCount > 0) {
    return result.rows[0].position_id;
  }

  const insertResult = await pool.query(
    `INSERT INTO positions (name) VALUES ($1) RETURNING position_id`,
    [position_name]
  );
  return insertResult.rows[0].position_id;
};

const registerUser = async (req, res) => { 
  const { login, password, roleId, lastName, firstName, middleName } = req.body;

  try {
      const existingUser = await pool.query(`
          SELECT * FROM users WHERE login = $1
      `, [login]);

      if (existingUser.rowCount > 0) {
          return res.status(400).json({ message: 'Логин уже существует' });
      }

      const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

      const result = await pool.query(`
          INSERT INTO users (login, password, role_id, last_name, first_name, middle_name)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING user_id, role_id;
      `, [login, hashedPassword, roleId, lastName, firstName, middleName]);

      const newUser = result.rows[0];
      res.status(201).json({
          message: 'Пользователь зарегистрирован',
          user: {
              user_id: newUser.user_id,
              role_id: newUser.role_id
          }
      });

  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Ошибка при выполнении запроса' });
  }
};

module.exports = {
  getEmployees,
  getEmployeeByFullName,
  registerUser,
  getEmployeesByPosition,
  getEmployeesByOrganization,
  updateEmployeeStatus,
  updateEmployee,
  verifyUser,
  getEmployee,
  addEmployee,
  upload,
};
  