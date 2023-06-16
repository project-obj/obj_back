const { sequelize } = require('./connection');
const User = require('./user');
const Category = require('./category');
const Place = require('./place');

const db = {};

db.sequelize = sequelize;

// model 생성
db.User = User;
db.Category = Category;
db.Place = Place;

// model init
User.init(sequelize);
Category.init(sequelize);
Place.init(sequelize);

//관계설정
User.associate(db);
Place.associate(db);

module.exports = db;
