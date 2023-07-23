const express = require('express');

const router = express.Router();
const userService = require('../service/userService');
const userDAO = require('../dao/userDAO');
const palceDAO = require('../dao/palceDAO');
const tokenUtil = require('../lib/tokenUtil');
const { isLoggedIn } = require('../lib/middleware');
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
    console.log(`가입 라우터  : ${JSON.stringify(params)}`);
    //중복 아뒤 체크
    const idDouble = await userService.idcheck(params.loginid);
    console.log('id 중복체크' + idDouble);
    // 입력값 null 체크
    if (!params.loginid || !params.password || !params.name || !params.email) {
      const err = new Error('아이디, 비번, 이름, 메일 확인');
      console.log('회원 가입 라우터 에러 : ' + err.toString());

      res.status(400).json({ err: err.toString() });
    } else if (idDouble != 'no') {
      // 중복 아뒤 아니면 등록
      result = await userService.add(params);
      console.log(`유저 등록 성공`);
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
router.get('/signup', async (req, res) => {
  console.log('아이디 중복 체크 : ' + req.query.loginid);
  try {
    let result = await userDAO.idcheck(req.query.loginid);
    console.log(`중복 체크 : ${JSON.stringify(result)}`);
    if (result !== 0) {
      console.log('아뒤 있음');
      return res.status(200).json({ success: true });
    } else {
      console.log('아뒤 없음');
      return res.status(200).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
//////////////////////////////////// 아이디 중복 체크 끝  /////////////////////////////
//////////////////////////////////// 로그인 시작  ////////////////////////////////////
router.get('/users', (req, res, next) => {
  return res.json(req.user || false);
});
router.post('/login', async (req, res) => {
  try {
    const params = {
      loginid: req.body.userid,
      password: req.body.password,
    };
    console.log(`로그인 라우터 입력값 확인 :  ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.loginid || !params.password) {
      const err = new Error('아이디 비번 입력');
      //      console.log(err.toString());

      res.status(500).json({ err: err.toString() });
    }

    // 비즈니스 로직 호출, id, pwd체크
    const result = await userService.login(params);
    console.log(`로그인 라우터 결과 : ${result}`);

    // 토큰 생성
    const token = tokenUtil.makeToken(result);
    console.log('로그인 토큰 : ' + token);
    const refresToken = tokenUtil.refresToken();
    console.log('리프래시토큰 : ' + refresToken.toString());
    //리프래시토큰 디비 저장
    const data = {
      loginid: req.body.userid,
      refresToken: refresToken,
    };
    await userService.refresTokenSave(data);
    const name = result.name;
    // res.set('token', token); // header 세팅
    //  res.cookie('jwt', token, { maxAge: 3600000 });

    // 최종 응답 refresToken 추가
    res
      .cookie('jwt', token, { maxAge: 3600000 })
      .status(200)
      .json({ success: true, token: token, name: name });
  } catch (err) {
    console.log(err.toString());
    console.log('로그인 라우터 err : ' + JSON.stringify(res.body));
    if (!res.body) {
      console.log('sdfgsdff');
      res.status(204).send('입력 정보를 확인 하세요.!');
      return;
      //express는 204상태코드에 대해 response body를 보여주지 않고 넘어간다
    }
    res.status(500).json({ err: err.toString() });
  }
});
//////////////////////////////////// 로그인 끝  ////////////////////////////////////

/////////////////////////////////// 내정보 조회 시작  ////////////////////////////
// loginCheck
router.get('/detail?:id', isLoggedIn, async (req, res) => {
  let myData = null;
  try {
    let data = req.body.loginid;
    console.log('내 정보 라우터 : ' + data);
    myData = await userService.getMyData(data);
    //    console.log(`내정보 조회 :  ${JSON.stringify(myData)}`);
    res.status(200).json(myData);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////////////// 내정보 조회 끝  /////////////////////////////
/////////////////////////////////// 내정보 업뎃 시작  ///////////////////////////
router.put('/update?:id', isLoggedIn, async (req, res) => {
  try {
    const myData = {
      loginid: req.query.userid,
      name: req.query.name,
      email: req.query.email,
    };
    console.log('내 정보 업뎃 : ' + JSON.stringify(myData));
    const result = await userService.myDateUP(myData);
    //    console.log(`정보 업뎃 ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////////////// 내정보 업뎃 끝  ////////////////////////////
/////////////////////////////// 내가 등록한 곳(MyPage) 시작 ////////////////////////////
router.get('/:userid', async (req, res) => {
  let myPlace = null;
  let myData = null;
  console.log('내가 등록한곳 라우터 : ' + JSON.stringify(req.params));
  try {
    //userid 가져오기
    let userId = await userDAO.getUserId(req.params.userid);
    console.log(`유저 라우터 userid 가져오기 :  ${JSON.stringify(userId)}`);
    //내정보 가져오기
    myData = await userService.getMyData(userId);
    console.log('유저 내가 등록한곳 newPlace : ' + JSON.stringify(myData));
    if (!myData.length) {
      console.log('MyPage 등록된 정보가 없습니다');
      return res.status(204).send('등록된 정보가 없습니다.');
    }

    res.status(200).json(myData);
  } catch (err) {
    console.log('내가 등록한 곳 user 에러' + err);
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////////// 내가 등록한 곳 끝 /////////////////////////////
/////////////////////////////// MyPage-tag update 시작 ////////////////////////////
router.put('/:userid', isLoggedIn, async (req, res) => {
  console.log('내 정보 tag update : ' + JSON.stringify(req.params));
  try {
    //user pk값 가져오기
    let userPK = await userDAO.getUserId(req.params.userid);
    console.log('내 정보 tag : ' + JSON.stringify(userPK.id));

    const myData = {
      id: userPK.id,
      placeName: req.body.placeName,
      tag: req.body.tag,
      visit: req.body.visit,
    };
    const result = await userDAO.myTagUpdate(myData);
    console.log(`정보 업뎃 결과 : ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////////// MyPage-tag update 끝 ////////////////////////////

module.exports = router;
