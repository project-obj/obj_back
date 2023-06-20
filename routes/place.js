const express = require('express');
const router = express.Router();
const placeService = require('../service/placeService');
const userService = require('../service/userService');
const { isLoggedIn } = require('../lib/middleware');

///////////////////////////////  장소 등록 시작 /////////////////////////////
router.post('/add', isLoggedIn, async (req, res) => {
  console.log(`장소등록  : ${JSON.stringify(req.body.userid)}`);
  let userPK = null;

  try {
    //유저 pk userid 가져오기
    userPK = await userService.getMyData(req.body.userid);
    console.log('console.log(userPK);' + userPK);
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
    const my = await placeService.my(params.place_name);
    console.log('중복 저장' + my.count);
    if (my.count != 0) {
      console.log('중복 저장');
      res.send({ success: false });
      return;
    }
    //장소 등록
    const result = await placeService.placeAdd(params);

    //장소 등록시 중복 장소 확인
    const placeCount = await placeService.palceCount(params.place_name);
    console.log(`중복장소 : ${placeCount.place_name}`);

    //중복 장소 카운트 증가
    const data = {
      cnt: placeCount.count,
      place_name: params.place_name,
    };
    await placeService.addCount(data);

    res.status(200).json({ success: true });
  } catch (err) {
    console.log('라우터 : ' + err);
    res.status(500).json({ err: err.toString() });
  }
});
////////////////////////////////  장소 등록 끝 /////////////////////////////////
////////////////////////////////  장소 삭제 시작 ///////////////////////////////
router.delete('/delete?:id', isLoggedIn, async (req, res) => {
  console.log(`장소삭제 라우터 : ${req.body.place_id}`);
  try {
    const params = {
      id: req.body.place_id,
    };
    //    console.log(`장소삭제 할거 : ${JSON.stringify(params)}`);
    //삭제 정보 받아옴(카운트 업뎃하려고)
    const deleteData = await placeService.deleteData(params);
    //    console.log('삭제할거 정보' + deleteData.place_name);
    //서비스로 전달
    const result = await placeService.placeDelete(params);
    //삭제시 중복 장소 갯수 받아옴
    const placeCount = await placeService.palceCount(deleteData.place_name);
    //삭제후 카운트 업뎃
    const data = {
      cnt: placeCount.count,
      place_name: deleteData.place_name,
    };
    await placeService.countDown(data);

    //최종 응답
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
///////////////////////////////  장소 삭제 끝 ///////////////////////////////
/////////////////////////// 잴 많이 등록된 곳 시작 //////////////////////////
router.get('/rank', async (req, res) => {
  let placeRank = null;
  try {
    placeRank = await placeService.placeMax();
    res.status(200).json(placeRank);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////// 잴 많이 등록된 곳 끝 ///////////////////////////
module.exports = router;
