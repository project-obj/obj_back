const Sequelize = require('sequelize');

module.exports = class Place extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true, //자동 생성
        },
        userid: {
          type: Sequelize.BIGINT,
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
        roadAddress: {
          type: Sequelize.STRING(255),
        },
        lat: {
          type: Sequelize.STRING(255),
        },
        lng: {
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
    Place.associate = (models) => {
      /**
       * Place안에 있는 "id값"을 "place_id 라는 컬럼 이름"으로 Place모델에 새로운 컬럼으로 추가한다.
       */
      db.Place.hasOne(db.User, {
        foreignKey: 'place_id',
        sourceKey: 'id',
      });

      /**
       *  Place모델 안에 "user_id라는 컬럼 이름"으로 Place모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */
      db.Place.belongsTo(db.User, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        //       as: 'User',
      });
    };
    // db.Place.hasMany(db.Visit, {
    //   foreignKey: 'place_name',
    //   sourceKey: 'id',
    // });
  }
};
