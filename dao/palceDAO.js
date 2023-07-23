const { Place, Visit } = require('../models/index');
const sequelize = require('sequelize');
const Op = require('sequelize');
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
  /////////////////////////////// tag테이블 등록 DAO 시작  ///////////////////////////////////
  tagADD(data) {
    console.log('tag테이블 등록 DAO : ' + data);
    const newData = {
      userid: data.userid,
      place_name: data.place_name,
      tag: '',
      visit: '가고 싶어요!',
    };
    console.log('tag테이블 등록 DAO' + JSON.stringify(newData));
    return new Promise((resolve, reject) => {
      Visit.create(newData)
        .then((inserted) => {
          console.log('tag테이블 등록 DAO 성공');
          resolve(inserted);
        })
        .catch((err) => {
          console.log('tag테이블 등록 DAO 실패 : ' + err);
          reject(err);
        });
    });
  },
  /////////////////////////////// tag테이블 등록 DAO 끝  ///////////////////////////////////

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
  /////////// 내가 등록한 장소 count 시작//////
  myPalceCount(params) {
    console.log(`장소 DAO : ${params}`);

    return new Promise((resolve, reject) => {
      Place.findAll({
        attributes: ['place_name', 'cnt'],
        where: { userid: params },
      })
        .then((selectPlace) => {
          resolve(selectPlace);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /////////// 내가 등록한 장소 count 끝 //////
  /////////////////////////////// 등록시 내꺼 중복된 곳 확인 DAO 시작  ////////////////////////////////
  my(params) {
    console.log(`장소 DAO : ${params}`);
    return new Promise((resolve, reject) => {
      Place.findAndCountAll({
        attributes: ['userid'],
        where: { place_name: params.place_name, userid: params.userid },
      })
        .then((selectPlace) => {
          resolve(selectPlace);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /////////////////////////////// 등록시 내꺼 중복된 곳 확인 DAO 시작  ////////////////////////////////
  /////////////////////////////// 장소 삭제 DAO 시작  ////////////////////////////////
  placeDelete(params) {
    return new Promise((resolve, reject) => {
      Place.destroy({
        where: { id: params },
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
  /////////////////////////////// tagDelete DAO 시작  ////////////////////////////////
  tagDelete(data) {
    console.log('tagDelete DAO' + JSON.stringify(data));
    return new Promise((resolve, reject) => {
      Visit.destroy({
        where: {
          userid: data.userid,
          place_name: data.placeName,
        },
      })
        .then((deleted) => {
          resolve({ deletedCount: deleted });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /////////////////////////////// tagDelete DAO 끝  ////////////////////////////////

  /////////////////////////////// 삭제 할 데이터 DAO 시작  /////////////////////////
  deleteData(data) {
    console.log('삭제 할 데이터 DAO : ' + data);
    return new Promise((resolve, reject) => {
      Place.findOne({
        attributes: ['place_name', 'userid'],
        where: { id: data },
      })
        .then((selectOne) => {
          resolve(selectOne);
        })
        .catch((err) => {
          console.log('삭제 할 데이터 DAO : ' + err);
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
  ///////////////////////////// 잴 많이 등록된 곳 DAO 시작  /////////////////////////////
  placeMax() {
    return new Promise((resolve, reject) => {
      // Place.max('cnt')   //최대값 하나만
      //   .then((maxValue) => {
      //     let maxName = Place.findAll({
      //       attributes: [
      //         sequelize.fn('distinct', sequelize.col('place_name')), //중복제거
      //         'place_name',
      //         'cnt',
      //         'address',
      //         'roadAddress',
      //         'lat',
      //         'lng',
      //       ],
      //       where: { cnt: maxValue },
      //       order: [['cnt', 'desc']],
      //     });
      //     resolve(maxName);
      //   })
      //   .catch((err) => {
      //     reject(err);
      //   });

      Place.findAll({
        attributes: [
          sequelize.fn('distinct', sequelize.col('place_name')), //중복제거
          'place_name',
          'cnt',
          'address',
          'roadAddress',
          'lat',
          'lng',
        ],
        order: [['cnt', 'desc']],
      })
        .then((selectPlace) => {
          resolve(selectPlace);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  ///////////////////////////// 잴 많이 등록된 곳 DAO 끝  //////////////////////////////
};

module.exports = dao;
