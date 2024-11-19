const { pool } = require('./database');

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
    e.employee_id,
    e.last_name,
    e.first_name,
    e.middle_name,
    e.date_of_birth,
    e.passport_details,
    e.address,
    e.salary,
    d.name AS department_name,
    p.name AS position_name,
    s.name AS status_name
    FROM 
        employees e
    LEFT JOIN 
        hr_operations ho ON e.employee_id = ho.employee_id
    LEFT JOIN 
        departments d ON ho.department_id = d.department_id
    LEFT JOIN 
        positions p ON ho.position_id = p.position_id
    LEFT JOIN 
        status s ON e.status_id = s.status_id;

    `);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserByFullName = async (req, res) => {
  const { lastName, firstName, middleName } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        e.employee_id,
        e.last_name,
        e.first_name,
        e.middle_name,
        e.date_of_birth,
        e.passport_details,
        e.address,
        e.salary,
        d.name AS department_name,
        p.name AS position_name,
        s.name AS status_name
      FROM 
        employees e
      LEFT JOIN 
        departments d ON e.department_id = d.department_id
      LEFT JOIN 
        positions p ON e.position_id = p.position_id
      LEFT JOIN 
        status s ON e.status_id = s.status_id
      WHERE 
        e.last_name = $1 
        AND e.first_name = $2 
        AND (e.middle_name = $3 OR e.middle_name IS NULL);
    `, [lastName, firstName, middleName]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsersByPosition = async (req, res) => {
  const { positionName } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        e.employee_id,
        e.last_name,
        e.first_name,
        e.middle_name,
        e.date_of_birth,
        e.passport_details,
        e.address,
        e.salary,
        d.name AS department_name,
        p.name AS position_name,
        s.name AS status_name
      FROM 
        employees e
      LEFT JOIN 
        positions p ON e.position_id = p.position_id
      WHERE 
        p.name = $1;
    `, [positionName]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователи с указанной должностью не найдены' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsersByOrganization = async (req, res) => {
  const { organizationName } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        e.employee_id,
        e.last_name,
        e.first_name,
        e.middle_name,
        e.date_of_birth,
        e.passport_details,
        e.address,
        e.salary,
        d.name AS department_name,
        o.name AS organization_name,
        p.name AS position_name,
        s.name AS status_name
      FROM 
        employees e
      LEFT JOIN 
        departments d ON e.department_id = d.department_id
      LEFT JOIN 
        organizations o ON d.organization_id = o.organization_id
      LEFT JOIN 
        positions p ON e.position_id = p.position_id
      WHERE 
        o.name = $1;
    `, [organizationName]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователи с указанной организацией не найдены' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserStatus = async (req, res) => {
  const { employeeId, statusId } = req.body;
  try {
    const result = await pool.query(`
      UPDATE employees
      SET status_id = $1
      WHERE employee_id = $2
      RETURNING employee_id;
    `, [statusId, employeeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json({ message: 'Статус пользователя обновлен' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
  updateUserStatus,
  deleteUser,
  updateUser,
};
