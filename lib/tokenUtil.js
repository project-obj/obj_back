const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const secretKey =
  '2B4D6251655468566D597133743677397A24432646294A404E635266556A586E';
const refresKey = 'NYQ1Gv8kezZ5rXYmLl%qXHF6M@2*v#446$1d0as*R2f%15^n1^';
const options = {
  expiresIn: '1h', // 만료시간
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
    //발급 받고 디비 저장 User.update().then().catch();
    return refresToken;
  },
  //access token 검증
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, secretKey);

      return decoded;
    } catch (err) {
      //유효기간이 만료
      return null;
    }
  },
  // refresh token 검증
  refresVerify() {
    // try {
    //   // JWT 토큰 검증
    //   const decoded = jwt.verify(refreshToken, 'secret_key');
    //   // DB에서 해당 유저의 리프레시 토큰 조회
    //   const [rows, fields] = await connection.execute(
    //     'SELECT * FROM refresh_tokens WHERE user_id = ? AND refresh_token = ?',
    //     [decoded.userId, refreshToken]
    //   );
    //   if (rows.length === 0) {
    //     throw new Error('Invalid refresh token');
    //   }
    //   console.log(`Successfully verified refresh token for user ${decoded.userId}`);
    //   return decoded.userId;
    // } catch (err) {
    //   console.error(err);
    // }
  },
};

module.exports = tokenUtil;
