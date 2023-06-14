const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const tokenUtil = require('../lib/tokenUtil');

// 등록
router.post('/join', async (req, res) => {
  try {
    const params = {
      userid: req.body.userid,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
    };
    console.log(`(userRoute.add.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.userid) {
      const err = new Error('Not allowed null (userid)');
      console.log(err.toString());

      res.status(500).json({ err: err.toString() });
    }

    // 비즈니스 로직 호출
    const result = await userService.add(params);
    console.log(`(userRoute.add.result) ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

//아이디 중복 체크
router.post('/idcheck', async (req, res) => {
  try {
    const params = {
      userid: req.body.userid,
    };
    const result = await userService.idcheck(params);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

//로그인
router.post('/login', async (req, res) => {
  try {
    const params = {
      userid: req.body.userid,
      password: req.body.password,
    };
    console.log(`(userRoute.login.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.userid || !params.password) {
      const err = new Error('아이디 비번 입력');
      logger.error(err.toString());

      res.status(500).json({ err: err.toString() });
    }

    // 비즈니스 로직 호출
    const result = await userService.login(params);
    console.log(`(userRoute.login.result) ${JSON.stringify(result)}`);

    // 토큰 생성
    const token = tokenUtil.makeToken(result);
    console.log('토큰' + token);
    res.set('token', token); // header 세팅
    res.cookie('jwt', token, { maxAge: 3600000 });

    // 최종 응답
    res.status(200); //.redirect('/');
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
//로그 아웃
router.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'login=true; Max-age=0');
  //  res.redirect('/');
  console.log('로그아웃');
});
module.exports = router;
