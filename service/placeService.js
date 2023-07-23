const { error } = require('winston');
const palceDAO = require('../dao/palceDAO');

const service = {
  /////////////////////////////// 장소등록 서비스 시작  ///////////////////////////////////
  async placeAdd(params) {
    let inserted = null;
    const newParams = {
      ...params,
      cnt: 0,
    };
    console.log(`장소등록 서비스: ${JSON.stringify(newParams)}`);
    try {
      inserted = await palceDAO.placeAdd(newParams);
    } catch (err) {
      return new Promise((resolve, reject) => {
        console.log('서비스 : ' + err);
        reject(err);
      });
    }
    // 결과값 리턴
    return new Promise((resolve) => {
      resolve(inserted);
    });
  },
  /////////////////////////////// 장소등록 서비스 끝  ///////////////////////////////////
  /////////////////////////////// 등록시 중복장소 갯수 서비스 시작  //////////////////////
  async palceCount(data) {
    console.log(`중복장소 서비스 : ${data}`);
    let result = null;
    try {
      result = await palceDAO.palceCount(data);
      //      console.log(`장소 서비스 : ${data}`);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    // 결과값 리턴
    return new Promise((resolve) => {
      resolve(result);
    });
  },
  ////////////////////// 등록시 중복장소 갯수 서비스 끝  ////////////////////////
  ////////////////////// 등록시 내꺼 중복장소 갯수 서비스 시작  ///////////////////////
  async my(data) {
    console.log(`내꺼 중복장소 서비스 : ${data}`);
    let result = null;
    try {
      result = await palceDAO.my(data);
      //      console.log(`장소 서비스 : ${data}`);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    // 결과값 리턴
    return new Promise((resolve) => {
      resolve(result);
    });
  },

  ////////////////////// 등록시 내꺼 중복장소 갯수 서비스 끝  ////////////////////////
  ////////////////////// 중복저장 카운트 증가 서비스 시작  //////////////////////
  async addCount(data) {
    let result = null;
    //    console.log(`장소 서비스 카운트 : ${data.cnt}`);
    try {
      result = await palceDAO.addCount(data);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    // 결과값 리턴
    return new Promise((resolve) => {
      resolve(result);
    });
  },
  ////////////////////// 중복저장 카운트 증가 서비스 끝  ////////////////////////
  ////////////////////// 삭제할거 정보 받아옴 서비스 시작  //////////////////////
  async deleteData(params) {
    console.log(`삭제 데이터 : ${params}`);
    let data = null;
    try {
      data = await palceDAO.deleteData(params);
      console.log(`삭제 데이터 : ${data.place_name}`);
    } catch (err) {
      console.log(`삭제 데이터서비스 에러 : ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    // 결과값 리턴
    return new Promise((resolve) => {
      resolve(data);
    });
  },
  ////////////////////// 삭제할거 정보 받아옴 서비스 끝  ////////////////
  ////////////////////// 장소 삭제 서비스 시작  ////////////////////////
  async placeDelete(params) {
    let result = null;
    console.log(`장소삭제 서비스 : ${JSON.stringify(params)}`);
    try {
      result = await palceDAO.placeDelete(params);
      console.log(`삭제 서비스 : ${JSON.stringify(result)}`);
    } catch (err) {
      console.log(`삭제 서비스 에러 : ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    //결과 리턴
    return new Promise((resolve) => {
      resolve(result);
    });
  },
  ////////////////////// 장소 삭제 서비스 끝  ////////////////////////
  ////////////////////// 삭제카운트 감소 서비스 시작  ////////////////
  async countDown(params) {
    console.log(`삭제 서비스 카운트: ${params.cnt}`);
    let result = null;
    try {
      result = await palceDAO.countDown(params);
      console.log(`삭제 서비스 카운트: ${JSON.stringify(result)}`);
    } catch (err) {
      console.log(`삭제 서비스 카운트에러 : ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    //결과 리턴
    return new Promise((resolve) => {
      resolve(result);
    });
  },
  ////////////////////// 삭제카운트 감소 서비스 끝  ////////////////////////
  /////////////////// 잴 많이 등록된 곳 서비스 시작  ///////////////////////
  async placeMax() {
    let result = null;
    try {
      result = await palceDAO.placeMax();
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    //결과 리턴
    return new Promise((resolve) => {
      resolve(result);
    });
  },
  /////////////////// 잴 많이 등록된 곳 서비스 끝  ////////////////////////
};

module.exports = service;
