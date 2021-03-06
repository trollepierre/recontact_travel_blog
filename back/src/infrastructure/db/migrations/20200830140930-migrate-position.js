module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'Positions',
        'placeEn',
        {
          type: Sequelize.STRING,
        },
        { transaction },
      )
      await queryInterface.addColumn(
        'Positions',
        'timeEn',
        {
          type: Sequelize.STRING,
        },
        { transaction },
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('Positions', 'placeEn', { transaction })
      await queryInterface.removeColumn('Positions', 'timeEn', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
