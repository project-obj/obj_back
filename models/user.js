const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true, //자동 생성
        },
        loginid: {
          type: Sequelize.STRING(50),
        },
        password: {
          type: Sequelize.STRING(255),
        },
        name: {
          type: Sequelize.STRING(255),
        },
        email: {
          type: Sequelize.STRING(255),
        },
        refres_token: {
          type: Sequelize.STRING(255),
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
    /**
     * User안에 있는 "id값"을 "userid 라는 컬럼 이름"으로 Place모델에 새로운 컬럼으로 추가한다.
     */
    User.hasMany(db.Place, {
      foreignKey: 'userid',
      sourceKey: 'id',
      //     as: 'Place',
    });
    User.hasMany(db.Visit, {
      foreignKey: 'userid',
      sourceKey: 'id',
      as: 'Visit',
    });
  }
};
