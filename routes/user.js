const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const tokenUtil = require('../lib/tokenUtil');
const { loginCheck } = require('../lib/middleware');
//////////////////////////////////// 회원가입 시작  //////////////////////////////////////
router.post('/join', async (req, res) => {
  let result = null;
  try {
    const params = {
      loginid: req.body.loginid,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
    };
    console.log(`가입 정보 ${JSON.stringify(params)}`);
    //중복 아뒤 체크
    const idDouble = await userService.idcheck(params.loginid);
    console.log(idDouble);
    // 입력값 null 체크
    if (!params.loginid || !params.password || !params.name || !params.email) {
      const err = new Error('아이디, 비번, 이름, 메일 확인');
      console.log(err.toString());

      res.status(500).json({ err: err.toString() });
    } else if (idDouble != 'no') {
      // 중복 아뒤 아니면 등록
      result = await userService.add(params);
      console.log(`유저 등록 ${JSON.stringify(result)}`);
    } else {
      console.log('아이디 중복');
    }

    // 최종 응답
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
//////////////////////////////////// 회원가입 끝  //////////////////////////////////////
//////////////////////////////////// 아이디 중복 체크 시작  /////////////////////////////
router.post('/idcheck', async (req, res) => {
  try {
    const params = req.body.loginid;

    const result = await userService.idcheck(params);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
//////////////////////////////////// 아이디 중복 체크 끝  /////////////////////////////
//////////////////////////////////// 로그인 시작  ////////////////////////////////////
router.post('/login', async (req, res) => {
  try {
    const params = {
      loginid: req.body.userid,
      password: req.body.password,
    };
    console.log(`(userRoute.login.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.loginid || !params.password) {
      const err = new Error('아이디 비번 입력');
      console.log(err.toString());

      res.status(500).json({ err: err.toString() });
    }

    // 비즈니스 로직 호출
    const result = await userService.login(params);
    console.log(`(userRoute.login.result) ${JSON.stringify(result)}`);

    // 토큰 생성
    const token = tokenUtil.makeToken(result);
    const name = result.name;
    // res.set('token', token); // header 세팅
    //  res.cookie('jwt', token, { maxAge: 3600000 });

    // 최종 응답
    res
      .cookie('jwt', token, { maxAge: 3600000 })
      .status(200)
      .json({ success: true, token: token, name: name });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
//////////////////////////////////// 로그인 끝  ////////////////////////////////////
//////////////////////////////////// 로그아웃 시작  ////////////////////////////////
router.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'login=true; Max-age=0');
  //  res.redirect('/');
  console.log('로그아웃');
});
//////////////////////////////////// 로그아웃 끝  ////////////////////////////////
/////////////////////////////////// 내정보 조회 시작  ////////////////////////////
// loginCheck
router.get('/detail?:id', async (req, res) => {
  let myData = null;
  try {
    let data = req.body.loginid;
    //    console.log(data);
    myData = await userService.getMyData(data);
    console.log(`내정보 조회 :  ${JSON.stringify(myData)}`);
    res.status(200).json(myData);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////////////// 내정보 조회 끝  /////////////////////////////
/////////////////////////////////// 내정보 업뎃 시작  ///////////////////////////
router.put('/update?:id', async (req, res) => {
  try {
    const myData = {
      loginid: req.query.userid,
      name: req.query.name,
      email: req.query.email,
    };
    console.log(myData.loginid);
    const result = await userService.myDateUP(myData);
    console.log(`정보 업뎃 ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////////////// 내정보 업뎃 끝  ////////////////////////////
/////////////////////////////// 내가 등록한 곳 시작 ////////////////////////////
router.get('/myPlace?:id', async (req, res) => {
  let myPlace = null;
  //유저 pk userid 가져오기
  let userPK = null;

  try {
    userPK = await userService.getMyData(req.body.loginid);
    // console.log(`유저 라우터 :  ${userPK.id}`);

    myPlace = await userService.myPlace(userPK.id);
    console.log(`내가 등록한 곳 :  ${JSON.stringify(myPlace)}`);
    res.status(200).json(myPlace);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////////// 내가 등록한 곳 끝 /////////////////////////////

module.exports = router;
