const userDAO = require('../dao/userDAO');
const hashUtil = require('../lib/hashUtil');

const service = {
  ////////////////////////////////// 회원가입 서비스 시작  ////////////////////////////////
  async add(params) {
    let inserted = null;

    //비번 암호화
    let hashPassword = null;
    try {
      hashPassword = await hashUtil.makePasswordHash(params.password);
      console.log(
        `(userService.makePassword) ${JSON.stringify(params.password)}`,
      );
    } catch (err) {
      console.log(`(userService.makePassword) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    //암호화 된거로 등록
    const newParams = {
      ...params,
      password: hashPassword,
    };

    try {
      inserted = await userDAO.userAdd(newParams);
      console.log(`(userService.add) ${JSON.stringify(inserted)}`);
    } catch (err) {
      console.log(`(userService.add) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    // 결과값 리턴
    return new Promise((resolve) => {
      resolve(inserted);
    });
  },
  ////////////////////////////////// 회원가입 서비스 끝  ////////////////////////////////
  ////////////////////////////////// 아이디 체크 서비스 시작  ///////////////////////////
  async idcheck(params) {
    let inserted = null;
    let yesNO = null;
    try {
      inserted = await userDAO.idcheck(params);
      console.log(`아이디 확인 ${JSON.stringify(inserted)}`);
      if (inserted.count > 0) {
        console.log('있는 아이디');
        yesNO = 'no';
      } else if (inserted.count == 0) {
        yesNO = 'ok';
      }
    } catch (err) {
      console.log(`아이디 체크 ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    // 결과값 리턴
    return new Promise((resolve) => {
      resolve(yesNO);
    });
  },
  ////////////////////////////////// 아이디 체크 서비스 끝  /////////////////////////
  ////////////////////////////////// 로그인 서비스 시작  ///////////////////////////
  async login(params) {
    let user = null;
    try {
      user = await userDAO.selectUser(params);
      console.log(`(userService.login) ${JSON.stringify(user)}`);
      // console.log(params.pwd);
      // console.log(user);
      //패스워드 일치여부 비교
      if (!user) {
        const err = new Error('아이디, 비번 확인');

        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    } catch (err) {
      console.log(`(userService.login) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    /////비번 비교  ////
    try {
      const checkPassword = await hashUtil.checkPasswordHash(
        params.password,
        user.password,
      );
      console.log(`(userService.checkPassword) ${checkPassword}`);

      if (!checkPassword) {
        const err = new Error('비번 확인');

        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    } catch (err) {
      console.log(`(userService.checkPassword) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    return new Promise((resolve) => {
      resolve(user);
    });
  },
  ////////////////////////////////// 로그인 서비스 끝  ///////////////////////////
  ////////////////////////////////// myDate 서비스 시작  ////////////////////////
  async getMyData(data) {
    let result = null;

    try {
      result = await userDAO.getMyData(data);
      console.log(result);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    return new Promise((resolve) => {
      resolve(result);
    });
  },
  ////////////////////////////////// myDate 서비스 끝  ////////////////////////
};

module.exports = service;
