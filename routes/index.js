const express = require('express');
const router = express.Router();
const userRouter = require('./user');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/user', userRouter);

module.exports = router;
