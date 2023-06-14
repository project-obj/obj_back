const { User } = require('../models/index');

const dao = {
  //회원가입
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
  //아이디 체크
  idcheck(params) {
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ['userid'],
        where: { userid: params.userid },
      })
        .then((selectOne) => {
          resolve(selectOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //로그인
  selectUser(params) {
    return new Promise((resolve, reject) => {
      User.findOne({
        attributes: ['userid', 'password'],
        where: { userid: params.userid },
      })
        .then((selectOne) => {
          resolve(selectOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

module.exports = dao;
