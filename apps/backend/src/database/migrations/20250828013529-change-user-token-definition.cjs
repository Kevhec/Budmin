// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn({ tableName: 'users', schema: 'budmin' }, 'token', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addIndex({ tableName: 'users', schema: 'budmin' }, ['token'], {
      name: 'users_token_index',
      where: {
        token: {
          [Sequelize.Op.ne]: null,
        },
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeIndex({ tableName: 'users', schema: 'budmin' }, 'users_token_index');

    await queryInterface.changeColumn({ tableName: 'users', schema: 'budmin' }, 'token', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: Sequelize.UUIDV4,
    });
  },
};
