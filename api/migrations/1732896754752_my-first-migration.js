exports.up = (pgm) => {
    //Таблица статусов
    pgm.createTable('status', {
        status_id: 'id',
        name: { type: 'varchar(100)', notNull: true },
    });

    //Таблица организаций
    pgm.createTable('organizations', {
        organization_id: 'id',
        name: { type: 'varchar(100)', notNull: true },
        comment: { type: 'text' },
    });

    // Таблица отделов 
    pgm.createTable('departments', {
        department_id: 'id',
        organization_id: { type: 'integer', notNull: true, references: 'organizations' },
        name: { type: 'varchar(100)', notNull: true },
        parent_id: { type: 'integer', references: 'departments' },
        comment: { type: 'text' },
    });

    //Таблица позиций
    pgm.createTable('positions', {
        position_id: 'id',
        name: { type: 'varchar(100)', notNull: true },
    });

    //Таблица сотрудников
    pgm.createTable('employees', {
        employee_id: 'id',
        last_name: { type: 'varchar(100)', notNull: true },
        first_name: { type: 'varchar(100)', notNull: true },
        middle_name: { type: 'varchar(100)' },
        date_of_birth: { type: 'date', notNull: true },
        passport_details: { type: 'text', notNull: true },
        passport_issued_date: { type: 'date', notNull: true },
        address: { type: 'text', notNull: true },
        salary: { type: 'numeric(10, 2)', notNull: true },
        status_id: { type: 'integer', notNull: true, references: 'status' },
    });

    //Таблица файлов
    pgm.createTable('files', {
        file_id: 'id',
        file_name: { type: 'varchar(255)', notNull: true },
        file_path: { type: 'varchar(255)', notNull: true },
        employee_id: { type: 'integer', notNull: true, references: 'employees' },
    });

    //Таблица HR операций
    pgm.createTable('hr_operations', {
        operation_id: 'id',
        employee_id: { type: 'integer', notNull: true, references: 'employees' },
        department_id: { type: 'integer', notNull: true, references: 'departments' },
        position_id: { type: 'integer', notNull: true, references: 'positions' },
    });

    //Таблица ролей
    pgm.createTable('roles', {
        role_id: 'id',
        name: { type: 'varchar(100)', notNull: true },
    });

    //Таблица пользователей
    pgm.createTable('users', {
        user_id: 'id',
        last_name: { type: 'varchar(100)', notNull: true },
        first_name: { type: 'varchar(100)', notNull: true },
        patronymic: { type: 'varchar(100)' },
        login: { type: 'varchar(50)', notNull: true, unique: true },
        password: { type: 'varchar(255)', notNull: true },
        role_id: { type: 'integer', notNull: true, references: 'roles' },
    });

    //Таблица истории изменений
    pgm.createTable('change_history', {
        history_id: 'id',
        operation_timestamp: { type: 'timestamptz', notNull: true },
        operation_object: { type: 'varchar(100)', notNull: true },
        change_fields: { type: 'text', notNull: true },
        user_id: { type: 'integer', notNull: true, references: 'users' },
    });
};
  
  //удаление всех таблиц
exports.down = (pgm) => {
    pgm.dropTable('change_history');
    pgm.dropTable('users');
    pgm.dropTable('roles');
    pgm.dropTable('hr_operations');
    pgm.dropTable('files');
    pgm.dropTable('employees');
    pgm.dropTable('positions');
    pgm.dropTable('departments');
    pgm.dropTable('organizations');
    pgm.dropTable('status');
};
  