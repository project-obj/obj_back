const { where } = require('sequelize');
const { User, Place } = require('../models/index');

const dao = {
  ////////////////////////////////// 회원가입 DAO 시작  ///////////////////////////
  userAdd(params) {
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
          resolve(selectOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  ////////////////////////////////// 아이디 체크 DAO 끝  //////////////////////
  ////////////////////////////////// 로그인 DAO 시작  ////////////////////////
  selectUser(params) {
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ['id', 'loginid', 'password', 'name', 'email'],
        where: { loginid: params.loginid },
      })
        .then((selectOne) => {
          resolve(selectOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  ////////////////////////////////// 로그인 DAO 끝  ////////////////////////
  ////////////////////////////////// myDate DAO 시작  /////////////////////
  getMyData(data) {
    // console.log('dao' + data);
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ['id', 'loginid', 'name', 'email'],
        where: { loginid: data },
      })
        .then((selectOne) => {
          resolve(selectOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  ////////////////////////////////// myDate DAO 시작  /////////////////////
  ////////////////////////////// 내정보 업뎃 DAO 시작  ////////////////////
  myDateUP(data) {
    console.log(data.name);
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
    console.log(`유저 dao :  ${data}`);
    try {
      const myPlace = await User.findByPk(data, {
        attributes: ['loginid', 'name'], // 내 테이블 데이터
        include: [
          {
            model: Place,
            as: 'Places', //디비에 있는 테이블명 모델 만들때 복수형 안되게 설정
            where: { userid: data },
            attributes: ['place_name'], // join 테이블 데이터
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
};

module.exports = dao;
