const Sequelize = require('sequelize');

module.exports = class BookMark extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        place_name: {
          type: Sequelize.STRING(200),
          primaryKey: false,
        },
        cnt: {
          type: Sequelize.STRING(50),
        },
      },
      {
        sequelize,
        // tableName: 'tableName', // table명을 수동으로 생성 함
        // freezeTableName: true, // true: table명의 복수형 변환을 막음
        underscored: false, // true: underscored, false: camelCase
        timestamps: false, // createAt, updatedAt
        paranoid: false, // deletedAt
      },
    );
  }
};
