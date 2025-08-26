// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

const userId = crypto.randomUUID();
const preferencesId = crypto.randomUUID();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('A00348237', salt);

    await queryInterface.bulkInsert({ tableName: 'users', schema: 'budmin' }, [
      {
        id: userId,
        username: 'admin',
        email: 'admin@budmin.com',
        password: hashedPassword,
        role: 'user',
        token: null,
        confirmed: true,
        birthday: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert({ tableName: 'user_preferences', schema: 'budmin' }, [
      {
        id: preferencesId,
        language: 'es',
        currency: 'COP',
        dateFormat: 'DD-MM-YYYY',
        timeFormat: '12',
        theme: 'dark',
        timezone: 'UTC',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      username: 'admin',
      email: 'admin@admin.com',
    });

    await queryInterface.bulkDelete('user_preferences', {
      id: preferencesId,
    });
  },
};
