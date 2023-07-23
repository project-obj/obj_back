const express = require('express');
const router = express.Router();
const placeService = require('../service/placeService');
const userService = require('../service/userService');
const placeDAO = require('../dao/palceDAO');
const userDAO = require('../dao/userDAO');
const { isLoggedIn } = require('../lib/middleware');
const { json } = require('body-parser');

///////////////////////////////  장소 등록 시작 /////////////////////////////
router.post('/add', isLoggedIn, async (req, res) => {
  console.log(`장소등록  : ${JSON.stringify(req.body.userid)}`);
  let userPK = null;

  try {
    //유저 pk userid 가져오기
    userPK = await userDAO.getUserId(req.body.userid);
    console.log('console.log(userPK);' + userPK.id);
    const params = {
      userid: userPK.id,
      category_id: req.body.category_id,
      place_name: req.body.place_name,
      address: req.body.address,
      roadAddress: req.body.roadAddress,
      lat: req.body.lat,
      lng: req.body.lng,
    };
    //  console.log(`장소등록 라우터 : ${JSON.stringify(params)}`);
    //장소 등록시 내 장소 중복 확인
    // console.log('장소 등록시 내 장소 중복 : ' + req.body.userid);
    // console.log('장소 등록시 내 장소 중복 : ' + userPK.loginid);
    const check = {
      userid: params.userid,
      place_name: params.place_name,
    };
    //내가 등록한 곳 인지 확인
    const my = await placeService.my(check);
    console.log('이미 등록 : ' + my.count);
    if (my.count != 0) {
      console.log('중복 저장');
      res.send({ success: false });
      return;
    }
    //장소 등록
    const result = await placeService.placeAdd(params);

    //장소 등록시 총 갯수 확인
    const placeCount = await placeService.palceCount(params.place_name);
    console.log(`중복장소 : ${placeCount.place_name}`);

    //중복 장소 카운트 증가
    const data = {
      cnt: placeCount.count,
      place_name: params.place_name,
    };
    await placeService.addCount(data);

    //장소 등록 후 테그 테이블에 저장
    const tagData = {
      userid: userPK.id,
      place_name: params.place_name,
    };
    await placeDAO.tagADD(tagData);

    res.status(200).json({ success: true });
  } catch (err) {
    console.log('라우터 : ' + err);
    res.status(500).json({ err: err.toString() });
  }
});
////////////////////////////////  장소 등록 끝 /////////////////////////////////
////////////////////////////////  장소 삭제 시작 ///////////////////////////////
router.delete('/delete', isLoggedIn, async (req, res) => {
  console.log(`장소삭제 라우터 : ${JSON.stringify(req.body)}`);
  try {
    //삭제 정보 받아옴(카운트 업뎃하려고)
    const deleteData = await placeService.deleteData(req.body.place_id);
    console.log('삭제할거 정보' + deleteData.place_name);
    //서비스로 전달
    const result = await placeService.placeDelete(req.body.place_id);
    //삭제시 중복 장소 갯수 받아옴
    const placeCount = await placeService.palceCount(deleteData.place_name);
    console.log('삭제시 중복 장소 갯수 : ' + placeCount);
    //삭제후 카운트 업뎃
    const data = {
      cnt: placeCount.count,
      place_name: deleteData.place_name,
    };
    await placeService.countDown(data);
    //장소 삭제 하면 tag테이블에도 삭제
    const tagData = {
      userid: deleteData.userid,
      placeName: deleteData.place_name,
    };
    await placeDAO.tagDelete(tagData);
    //최종 응답
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: '일시적인 오류로 삭제에 실패했습니다.' });
  }
});
///////////////////////////////  장소 삭제 끝 ///////////////////////////////
/////////////////////////// 잴 많이 등록된 곳 시작 //////////////////////////
router.get('/rank', isLoggedIn, async (req, res) => {
  let placeRank = null;
  try {
    placeRank = await placeService.placeMax();
    //    console.log('핫플  : ' + JSON.stringify(placeRank));
    res.status(200).json(placeRank);
  } catch (err) {
    console.log('핫플 에러 : ' + err);
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////// 잴 많이 등록된 곳 끝 ///////////////////////////
////////////////////////////// 내가 등록한 곳 시작 ////////////////////////////
router.get('/', isLoggedIn, async (req, res) => {
  let myPlace = null;
  let userPK = null;
  console.log(
    '내가 등록한곳 place라우터 : ' + JSON.stringify(req.query.userid),
  );

  try {
    //유저 pk userid 가져오기
    userPK = await userDAO.getUserId(req.query.userid);
    console.log(`유저 라우터 :  ${userPK.id}`);

    myPlace = await userService.myPlace(userPK.id);
    //    myPlace = await userDAO.getMyData(userPK);
    console.log(`내가 등록한 곳 :  ${JSON.stringify(myPlace)}`);
    res.status(200).json(myPlace);
  } catch (err) {
    console.log('내가 등록한 곳 에러' + err);
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////////// 내가 등록한 곳 끝 /////////////////////////////
module.exports = router;
