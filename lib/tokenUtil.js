const jwt = require('jsonwebtoken');

const secretKey =
  '2B4D6251655468566D597133743677397A24432646294A404E635266556A586E';
const options = {
  expiresIn: '9000h', // 만료시간
};

const tokenUtil = {
  // 토큰 생성
  makeToken(user) {
    const payload = {
      userid: user.userid,
      loginid: user.loginid,
    };

    const token = jwt.sign(payload, secretKey, options);

    return token;
  },
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, secretKey);

      return decoded;
    } catch (err) {
      return null;
    }
  },
};

module.exports = tokenUtil;
