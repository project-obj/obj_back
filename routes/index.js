const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const placeRouter = require('./place');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/user', userRouter);
router.use('/place', placeRouter);

module.exports = router;
