const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const userDAO = require('../dao/userDAO');
const secretKey =
  '2B4D6251655468566D597133743677397A24432646294A404E635266556A586E';
const refresKey = 'NYQ1Gv8kezZ5rXYmLl%qXHF6M@2*v#446$1d0as*R2f%15^n1^';
const options = {
  expiresIn: '1000h', // 만료시간
};
const refresOption = {
  expiresIn: '10h', // 만료시간
};

const tokenUtil = {
  // 토큰 생성
  //jwt.sign({JWT 데이터}, 비밀키, { expiresIn: '7d' }7일 뒤에 만료);
  makeToken(user) {
    const payload = {
      userid: user.userid,
      loginid: user.loginid,
    };
    const token = jwt.sign(payload, secretKey, options);
    return token;
  },
  refresToken() {
    // refresh token은 payload 없이 발급
    const refresToken = jwt.sign({}, refresKey, refresOption);

    return refresToken;
  },
  //access token 검증
  verifyToken(token) {
    console.log('access token : ' + token);
    try {
      const decoded = jwt.verify(token, secretKey);
      console.log('access token 검증 : ' + JSON.stringify(decoded));
      return decoded;
    } catch (err) {
      console.log('access token : ' + err);
      //유효기간이 만료
      return null;
    }
  },
  // refresh token 검증
  async refresVerify() {
    let refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODc3NTI2NDYsImV4cCI6MTY4Nzc4ODY0Nn0.k8pCFRwljSLUY625upsFxcWsn56LbX14vfGzrxZ26m8';
    try {
      // JWT 토큰 검증
      //   const decoded = jwt.verify(refreshToken, 'refresKey');
      // DB에서 해당 유저의 리프레시 토큰 조회 - 토큰 보내지 말고 id 보내서 토큰 가져오게
      let isExistToken = await userDAO.serchToken(refreshToken);
      console.log('isExistToken :' + JSON.stringify(isExistToken));

      if (isExistToken != null) {
        jwt.verify(refreshToken, refresKey);
        console.log(
          '리프레시 토큰 조회 tokenUtil : exist' + JSON.stringify(isExistToken),
        );
      } else {
        console.log('로그인 하세요.');
      }

      //   return decoded;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = tokenUtil;
