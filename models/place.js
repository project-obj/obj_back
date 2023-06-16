const Sequelize = require('sequelize');

module.exports = class Place extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        place_id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true, //자동 생성
        },

        category_id: {
          type: Sequelize.STRING(255),
        },
        place_name: {
          type: Sequelize.STRING(255),
        },
        address: {
          type: Sequelize.STRING(255),
        },
        cnt: {
          type: Sequelize.INTEGER,
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

  static associate(db) {
    db.Place.belongsToMany(db.User, {
      through: 'place_sign',
    });
  }
};
