const Sequelize = require('sequelize');

module.exports = class Visit extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        place_name: {
          type: Sequelize.STRING(255),
        },
        tag: {
          type: Sequelize.STRING(255),
        },
        visit: {
          type: Sequelize.STRING(255),
        },
        userid: {
          type: Sequelize.INTEGER,
        },
      },
      {
        sequelize,
        // tableName: 'tableName', // table명을 수동으로 생성 함
        freezeTableName: true, // true: table명의 복수형 변환을 막음
        underscored: false, // true: underscored, false: camelCase
        timestamps: false, // createAt, updatedAt
        paranoid: false, // deletedAt
      },
    );
  }
  //FK설정후 테이블에 컬럼 추가 해야됨
  static associate(db) {
    db.Visit.belongsTo(db.User, {
      foreignKey: 'userid',
      targetKey: 'id',
      as: 'User',
    });
    // db.Visit.belongsTo(db.Place, {
    //   foreignKey: 'place_name',
    //   targetKey: 'id',
    // });
  }
};
