/* Replace with your SQL commands */
-- Создание таблицы organizations
CREATE TABLE IF NOT EXISTS organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  comment TEXT
);

-- Создание таблицы departments
CREATE TABLE IF NOT EXISTS departments (
  department_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
  comment TEXT
);

-- Создание таблицы positions
CREATE TABLE IF NOT EXISTS positions (
  position_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Создание таблицы status
CREATE TABLE IF NOT EXISTS status (
  status_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Создание таблицы employees
CREATE TABLE IF NOT EXISTS employees (
  employee_id SERIAL PRIMARY KEY,
  last_name VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  date_of_birth DATE NOT NULL,
  passport_details VARCHAR(20) NOT NULL,
  passport_issue_date DATE NOT NULL,
  passport_division_code VARCHAR(10),
  passport_issued_by VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  salary NUMERIC(18,2) NOT NULL,
  status_id INTEGER NOT NULL REFERENCES status(status_id) ON DELETE SET NULL
);

-- Создание таблицы files
CREATE TABLE IF NOT EXISTS files (
  file_id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  passport_scan BYTEA,
  file_name VARCHAR(50) NOT NULL,
  file_path VARCHAR(255) NOT NULL
);

-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы change_history
CREATE TABLE IF NOT EXISTS change_history (
  history_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by VARCHAR(100) NOT NULL,
  field VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL
);

-- Создание таблицы hr_operations
CREATE TABLE IF NOT EXISTS hr_operations (
  operation_id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  operation_type VARCHAR(50) NOT NULL,
  department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
  position_id INTEGER REFERENCES positions(position_id) ON DELETE SET NULL,
  operation_date DATE NOT NULL
);
