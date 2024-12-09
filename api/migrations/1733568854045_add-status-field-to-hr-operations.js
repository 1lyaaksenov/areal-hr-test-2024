exports.up = (pgm) => {
    pgm.dropTable('status');

    pgm.addColumn('hr_operations', {
        status: { type: 'varchar(100)', notNull: true },
    });
};

exports.down = (pgm) => {
    pgm.createTable('status', {
        status_id: 'id',
        name: { type: 'varchar(100)', notNull: true },
    });

    pgm.dropColumn('hr_operations', 'status');
};
