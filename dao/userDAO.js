const { Sequelize, Op } = require('sequelize');
const { User, Place, Visit } = require('../models/index');

const dao = {
  ////////////////////////////////// 회원가입 DAO 시작  ///////////////////////////
  userAdd(params) {
    console.log(`회원가입 DAO :  ${JSON.stringify(params)}`);
    return new Promise((resolve, reject) => {
      User.create(params)
        .then((inserted) => {
          resolve(inserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  ////////////////////////////////// 회원가입 DAO 끝  ///////////////////////////
  ////////////////////////////////// 아이디 체크 DAO 시작  //////////////////////
  idcheck(params) {
    return new Promise((resolve, reject) => {
      User.findAndCountAll({
        attributes: ['loginid'],
        where: { loginid: params },
      })
        .then((selectOne) => {
          console.log('아이디 체크 DAO : ' + JSON.stringify(selectOne.count));
          resolve(selectOne.count);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  ////////////////////////////////// 아이디 체크 DAO 끝  //////////////////////
  ////////////////////////////////// 로그인 DAO 시작  ////////////////////////
  selectUser(params) {
    console.log('로그인 DAO : ' + JSON.stringify(params));
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ['id', 'loginid', 'password', 'name', 'email'],
        where: {
          loginid: params.loginid,
        },
      })
        .then((selectOne) => {
          console.log('로그인 DAO 정보 없음' + JSON.stringify(selectOne));
          resolve(selectOne);
        })
        .catch((err) => {
          console.log(`로그인 DAO err : ${err}`);

          reject(err);
        });
    });
  },
  ////////////////////////////////// 로그인 DAO 끝  ////////////////////////
  ////////////////////////////////// myDate DAO 시작  /////////////////////
  getMyData(data) {
    console.log('마이 데이터 dao : ' + JSON.stringify(data));
    return new Promise((resolve, reject) => {
      // User.findAll({
      //   attributes: ['id', 'loginid', 'name', 'email'],
      //   where: { loginid: data.loginid },
      //   include: [
      //     {
      //       model: Place,
      //       as: 'Places',
      //       attributes: [
      //         'id',
      //         'cnt',
      //         'place_name',
      //         'address',
      //         'roadAddress',
      //         'lat',
      //         'lng',
      //       ],
      //       where: { userid: data.id },
      //     },
      //     {
      //       model: Visit,
      //       as: 'Visit',
      //       attributes: ['tag', 'visit'],
      //       where: { userid: data.id },
      //     },
      //   ],
      // })
      //   .then((selectOne) => {
      //     console.log('마이 데이터 dao 성공: ' + JSON.stringify(selectOne));
      //     resolve(selectOne);
      //   })
      //   .catch((err) => {
      //     console.log('마이 데이터 dao : ' + err);
      //     reject(err);
      //   });
      //디비 버전에 따라서 쿼리문 되는게 있고 안되는게 있음 //GROUP_CONCAT(DISTINCT visit.tag) 그룹화해서 중복 데이터 제거
      const sqlQuery = ` 
      SELECT places.id as placeId, places.place_name, places.cnt, places.address, places.roadAddress, places.lat, places.lng,
            GROUP_CONCAT(DISTINCT visit.tag) as tags,
            GROUP_CONCAT(DISTINCT visit.visit) as visits, users.id as userId, users.loginid, users.name, users.email
      FROM users
      JOIN visit ON users.id = visit.userid
      JOIN places ON users.id = places.userid
      WHERE users.id = ${data.id} AND places.place_name = visit.place_name
      GROUP BY places.id`;

      User.sequelize
        .query(sqlQuery, { type: Sequelize.QueryTypes.SELECT })
        .then((results) => {
          console.log('myDate DAO');
          console.log(results);
          resolve(results);
        })
        .catch((error) => {
          console.error('Error:', error);
          reject(error);
        });
    });
  },
  ////////////////////////////////// myDate DAO 끝  /////////////////////
  ////////////////////////////////// UserId DAO 시작  /////////////////////
  getUserId(data) {
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ['id', 'loginid'],
        where: { loginid: data },
      })
        .then((selectOne) => {
          console.log('UserId dao 성공: ' + JSON.stringify(selectOne));
          resolve(selectOne);
        })
        .catch((err) => {
          console.log('UserId dao : ' + err);
          reject(err);
        });
    });
  },
  ////////////////////////////////// UserId DAO 끝  /////////////////////

  ////////////////////////////// MyPage-tag update 시작  ////////////////////
  myTagUpdate(data) {
    console.log(`MyPage-tag update DAO :  ${JSON.stringify(data)}`);
    return new Promise((resolve, reject) => {
      Visit.update(
        { tag: data.tag, visit: data.visit },
        {
          where: {
            userid: data.id,
            place_name: data.placeName,
          },
        },
      )
        .then(([updated]) => {
          console.log('MyPage-tag 수정 성공: ', updated);
          resolve({ updatedCount: updated });
        })
        .catch((err) => {
          console.log('MyPage-tag 수정 실패: ', err);
          reject(err);
        });
    });
  },
  ////////////////////////////// MyPage-tag update 끝  ////////////////////

  ////////////////////////////// 내정보 업뎃 DAO 시작  ////////////////////
  myDateUP(data) {
    console.log(`내정보 업뎃 DAO :  ${JSON.stringify(data)}`);
    return new Promise((resolve, reject) => {
      User.update(
        { name: data.name, email: data.email },
        { where: { loginid: data.loginid } },
      )
        .then(([updated]) => {
          console.log('내정보 수정 성공: ', updated);
          resolve({ updatedCount: updated });
        })
        .catch((err) => {
          console.log('내정보 수정 실패: ', err);
          reject(err);
        });
    });
  },
  ////////////////////////////// 내정보 업뎃 DAO 끝  /////////////////////
  //////////////////////// 내가 등록한 곳 DAO 시작 ///////////////////////
  async myPlace(data) {
    console.log(`내가 등록한 곳 dao :  ${data}`);
    try {
      const myPlace = await User.findByPk(data, {
        attributes: ['loginid', 'name'], // 내 테이블 데이터
        include: [
          {
            model: Place,
            as: 'Places', //디비에 있는 테이블명 모델 만들때 복수형 안되게 설정
            attributes: [
              'id',
              'cnt',
              'place_name',
              'address',
              'roadAddress',
              'lat',
              'lng',
            ], // join 테이블 데이터
            where: { userid: data },
          },
        ],
      });
      console.log(`유저 dao :  ${myPlace}`);
      return myPlace;
    } catch (err) {
      throw err;
    }
  },
  //////////////////////// 내가 등록한 곳 DAO 끝 ////////////////////////
  //////////////////////// refresToken 저장 DAO 시작 /////////////////////////
  async refresTokenSave(data) {
    console.log('refresToken 저장 DAO' + JSON.stringify(data));
    console.log('refresToken 저장 DAO' + data.refresToken);
    return new Promise((resolve, reject) => {
      User.update(
        { refres_token: data.refresToken },
        { where: { loginid: data.loginid } },
      )
        .then(([updated]) => {
          console.log('내정보 수정 성공: ', updated);
          resolve({ updatedCount: updated });
        })
        .catch((err) => {
          console.log('내정보 수정 실패: ', err);
          reject(err);
        });
    });
  },
  //////////////////////// refresToken 저장 DAO 끝 /////////////////////////
  //////////////////////// refresToken 조회 DAO 시작 ///////////////////////
  async serchToken(refres_token) {
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ['loginid'],
        where: { refres_token: refres_token },
      })
        .then((selectOne) => {
          console.log('리프레시 토큰 조회 dao : ', JSON.stringify(selectOne));
          resolve(selectOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //////////////////////// refresToken 조회 DAO 끝 /////////////////////////
};

module.exports = dao;
