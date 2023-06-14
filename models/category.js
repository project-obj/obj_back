const Sequelize = require('sequelize');

module.exports = class Category extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        category_id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true, //자동 생성
        },
        category_name: {
          type: Sequelize.STRING(200),
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
