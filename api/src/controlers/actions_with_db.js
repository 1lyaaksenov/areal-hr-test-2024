const { pool } = require('../db/database');

const getUsers = async (req, res) => {
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

const getUserByFullName = async (req, res) => {
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

const getUsersByPosition = async (req, res) => {
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

const getUsersByOrganization = async (req, res) => {
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
        s.name AS status_name,
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

// const updateUserStatus = async (req, res) => {
//   const { employeeId, statusId } = req.body;
//   try {
//     const result = await pool.query(`
//       UPDATE employees
//       SET status_id = $1
//       WHERE employee_id = $2
//       RETURNING employee_id;
//     `, [statusId, employeeId]);

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: 'Пользователь не найден' });
//     }
//     res.status(200).json({ message: 'Статус пользователя обновлен' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const deleteUser = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM employees
      WHERE employee_id = $1
      RETURNING employee_id;
    `, [employeeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json({ message: 'Пользователь успешно удален' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { employeeId } = req.params;
  const { lastName, firstName, middleName, address, salary, departmentId, positionId, statusId } = req.body;

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
        position_id = $7,
        status_id = $8
      WHERE employee_id = $9
      RETURNING employee_id;
    `, [lastName, firstName, middleName, address, salary, departmentId, positionId, statusId, employeeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json({ message: 'Данные пользователя успешно обновлены' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  getUserByFullName,
  getUsersByPosition,
  getUsersByOrganization,
  // updateUserStatus,
  deleteUser,
  updateUser,
};
  