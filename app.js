let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
// 요청과 응답에 쿠키를 허용하고 싶을 경우 : "Credentials": true 서버, 프론트 둘다
let indexRouter = require('./routes/index');

const bodyParser = require('body-parser');
const cors = require('cors');
const corsConfig = require('./config/corsConfig.json');
const models = require('./models/index');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// DB 연결 확인 및 table 생성
//console.log('models', models);
models.sequelize
  .authenticate()
  .then(() => {
    console.log('DB connection success');

    // sequelize sync (table 생성)
    models.sequelize
      .sync()
      .then(() => {
        console.log('Sequelize sync success');
      })
      .catch((err) => {
        console.log('Sequelize sync error', err);
      });
  })
  .catch((err) => {
    console.log('DB Connection fail', err);
  });

app.use(cors(corsConfig)); //cors설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
