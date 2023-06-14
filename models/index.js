const { sequelize } = require('./connection');
const User = require('./user');
const Category = require('./category');
const Place = require('./place');
const BookMark = require('./bookMark');

const db = {};

db.sequelize = sequelize;

// model 생성
db.User = User;

// model init
User.init(sequelize);
Category.init(sequelize);
Place.init(sequelize);
BookMark.init(sequelize);

module.exports = db;
