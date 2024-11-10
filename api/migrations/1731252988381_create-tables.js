/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    pgm.createTable('organizations', {
      organization_id: { type: 'serial', primaryKey: true },
      name: { type: 'varchar(255)', notNull: true },
      comment: { type: 'text' },
    });

    pgm.createTable('departments', {
      department_id: { type: 'serial', primaryKey: true },
      organization_id: { type: 'integer', notNull: true, references: 'organizations', onDelete: 'cascade' },
      name: { type: 'varchar(255)', notNull: true },
      parent_id: { type: 'integer', references: 'departments' },
      comment: { type: 'text' },
    });
 
    pgm.createTable('positions', {
      position_id: { type: 'serial', primaryKey: true },
      name: { type: 'varchar(255)', notNull: true },
    });

    pgm.sql(`
      CREATE OR REPLACE FUNCTION insert_organization(name varchar, comment text)
      RETURNS void AS $$
      BEGIN
        INSERT INTO organizations (name, comment) VALUES (name, comment);
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION update_organization(id integer, name varchar, comment text)
      RETURNS void AS $$
      BEGIN
        UPDATE organizations SET name = name, comment = comment WHERE organization_id = id;
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION delete_organization(id integer)
      RETURNS void AS $$
      BEGIN
        DELETE FROM organizations WHERE organization_id = id;
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION get_organizations()
      RETURNS TABLE (organization_id integer, name varchar, comment text) AS $$
      BEGIN
        RETURN QUERY SELECT organization_id, name, comment FROM organizations;
      END; $$ LANGUAGE plpgsql;
    `);

    pgm.sql(`
      CREATE OR REPLACE FUNCTION insert_department(organization_id integer, name varchar, parent_id integer, comment text)
      RETURNS void AS $$
      BEGIN
        INSERT INTO departments (organization_id, name, parent_id, comment) VALUES (organization_id, name, parent_id, comment);
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION update_department(id integer, name varchar, parent_id integer, comment text)
      RETURNS void AS $$
      BEGIN
        UPDATE departments SET name = name, parent_id = parent_id, comment = comment WHERE department_id = id;
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION delete_department(id integer)
      RETURNS void AS $$
      BEGIN
        DELETE FROM departments WHERE department_id = id;
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION get_departments()
      RETURNS TABLE (department_id integer, organization_id integer, name varchar, parent_id integer, comment text) AS $$
      BEGIN
        RETURN QUERY SELECT department_id, organization_id, name, parent_id, comment FROM departments;
      END; $$ LANGUAGE plpgsql;
    `);

    pgm.sql(`
      CREATE OR REPLACE FUNCTION insert_position(name varchar)
      RETURNS void AS $$
      BEGIN
        INSERT INTO positions (name) VALUES (name);
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION update_position(id integer, name varchar)
      RETURNS void AS $$
      BEGIN
        UPDATE positions SET name = name WHERE position_id = id;
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION delete_position(id integer)
      RETURNS void AS $$
      BEGIN
        DELETE FROM positions WHERE position_id = id;
      END; $$ LANGUAGE plpgsql;

      CREATE OR REPLACE FUNCTION get_positions()
      RETURNS TABLE (position_id integer, name varchar) AS $$
      BEGIN
        RETURN QUERY SELECT position_id, name FROM positions;
      END; $$ LANGUAGE plpgsql;
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      DROP FUNCTION IF EXISTS insert_organization;
      DROP FUNCTION IF EXISTS update_organization;
      DROP FUNCTION IF EXISTS delete_organization;
      DROP FUNCTION IF EXISTS get_organizations;
      
      DROP FUNCTION IF EXISTS insert_department;
      DROP FUNCTION IF EXISTS update_department;
      DROP FUNCTION IF EXISTS delete_department;
      DROP FUNCTION IF EXISTS get_departments;
      
      DROP FUNCTION IF EXISTS insert_position;
      DROP FUNCTION IF EXISTS update_position;
      DROP FUNCTION IF EXISTS delete_position;
      DROP FUNCTION IF EXISTS get_positions;
    `);

    pgm.dropTable('positions');
    pgm.dropTable('departments');
    pgm.dropTable('organizations');
};
