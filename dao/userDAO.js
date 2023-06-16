const { User } = require('../models/index');

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
        attributes: ['userid', 'loginid', 'password', 'name', 'email'],
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
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ['loginid', 'name', 'email'],
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
};

module.exports = dao;
