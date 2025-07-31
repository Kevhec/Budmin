// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

const userId = crypto.randomUUID();
const preferencesId = crypto.randomUUID();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    await queryInterface.bulkInsert('users', [
      {
        id: userId,
        username: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'user',
        token: null,
        confirmed: true,
        birthday: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('user-preferences', [
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

    await queryInterface.bulkDelete('user-preferences', {
      id: preferencesId,
    });
  },
};
