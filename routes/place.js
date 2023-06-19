const express = require('express');
const router = express.Router();
const placeService = require('../service/placeService');
const { loginCheck } = require('../lib/middleware');
//장소등록 로그인 미들웨어// ('/placeAdd', loginCheck, async (req, res) =>
///////////////////////////////  장소 등록 시작 /////////////////////////////
router.post('/add', async (req, res) => {
  try {
    const params = {
      userid: req.body.userid,
      category_id: req.body.category_id,
      place_name: req.body.place_name,
      address: req.body.address,
    };
    //장소 등록
    const result = await placeService.placeAdd(params);
    console.log(`장소등록 : ${JSON.stringify(result)}`);

    //장소 등록시 중복 장소 확인
    const placeCount = await placeService.palceCount(params.place_name);
    console.log(`중복장소 : ${placeCount.count}`);
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
router.delete('/delete?:id', async (req, res) => {
  try {
    const params = {
      place_id: req.body.place_id,
    };
    console.log(`장소삭제 할거 : ${JSON.stringify(params)}`);
    //삭제 정보 받아옴
    const deleteData = await placeService.deleteData(params);
    console.log('삭제할거 정보' + deleteData.place_name);
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
router.get('/max', async (req, res) => {
  let placeMax = null;
  try {
    placeMax = await placeService.placeMax();
    res.status(200).json(placeMax);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
/////////////////////////// 잴 많이 등록된 곳 끝 ///////////////////////////
module.exports = router;
