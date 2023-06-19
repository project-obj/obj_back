const { Place } = require('../models/index');

const dao = {
  /////////////////////////////// 장소등록 DAO 시작  ///////////////////////////////////
  placeAdd(params) {
    console.log(`장소등록 DAO: ${JSON.stringify(params)}`);
    return new Promise((resolve, reject) => {
      Place.create(params)
        .then((inserted) => {
          resolve(inserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /////////////////////////////// 장소등록 DAO 끝  ///////////////////////////////////
  /////////////////////////////// 중복저장 카운트 증가 DAO 시작  //////////////////////
  addCount(data) {
    console.log(`장소 카운트 dao: ${data.cnt}`);
    return new Promise((resolve, reject) => {
      Place.update(
        { cnt: data.cnt },
        { where: { place_name: data.place_name } },
      )
        .then(([updated]) => {
          console.log('등록수정 성공: ', updated);
          resolve({ updatedCount: updated });
        })
        .catch((err) => {
          console.log('등록수정 실패: ', err);
          reject(err);
        });
    });
  },
  /////////////////////////////// 중복저장 카운트 증가 DAO 끝  ///////////////////////////////////
  /////////////////////////////// 등록시 중복된 곳 확인 DAO 시작  ////////////////////////////////
  palceCount(params) {
    console.log(`장소 DAO : ${params}`);
    return new Promise((resolve, reject) => {
      Place.findAndCountAll({
        attributes: ['place_name'],
        where: { place_name: params },
      })
        .then((selectPlace) => {
          resolve(selectPlace);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /////////////////////////////// 등록시 중복된 곳 확인 DAO 끝  ///////////////////////
  /////////////////////////////// 장소 삭제 DAO 시작  ////////////////////////////////
  placeDelete(params) {
    return new Promise((resolve, reject) => {
      Place.destroy({
        where: { place_id: params.place_id },
      })
        .then((deleted) => {
          resolve({ deletedCount: deleted });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /////////////////////////////// 장소 삭제 DAO 끝  ////////////////////////////////
  /////////////////////////////// 삭제 할 데이터 DAO 시작  /////////////////////////
  deleteData(data) {
    return new Promise((resolve, reject) => {
      Place.findOne({
        attributes: ['place_name'],
        where: { place_id: data.place_id },
      })
        .then((selectOne) => {
          resolve(selectOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /////////////////////////////// 삭제 할 데이터 DAO 끝  ////////////////////////////////
  /////////////////////////////// 삭제 후 중복 갯수 DAO 시작  ///////////////////////////
  countDown(data) {
    console.log(`장소삭제 카운트DAO : ${data.cnt} ${data.place_name}`);
    return new Promise((resolve, reject) => {
      Place.update(
        { cnt: data.cnt },
        { where: { place_name: data.place_name } },
      )
        .then(([updated]) => {
          console.log('삭제 수정 성공: ', updated);
          resolve({ updatedCount: updated });
        })
        .catch((err) => {
          console.log('삭제 수정 실패: ', err);
          reject(err);
        });
    });
  },
  /////////////////////////////// 삭제 후 중복 갯수 DAO 끝  ////////////////////////////////
  ///////////////////////////// 잴 많이 등록된 곳 서비스 시작  /////////////////////////////
  placeMax() {
    return new Promise((resolve, reject) => {
      Place.max('cnt')
        .then((maxValue) => {
          let maxName = Place.findOne({
            attributes: ['place_name', 'cnt'],
            where: { cnt: maxValue },
          });
          resolve(maxName);
        })
        .catch((err) => {
          reject(err);
        });
      // Place.findAndCountAll({
      //   attributes: ['place_name'],
      // })
      //   .then((selectOne) => {
      //     resolve(selectOne);
      //     console.log(result.count);
      //     console.log(result.rows);
      //   })
      //   .catch((err) => {
      //     reject(err);
      //   });
    });
  },
  ///////////////////////////// 잴 많이 등록된 곳 서비스 끝  //////////////////////////////
};

module.exports = dao;
