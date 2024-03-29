const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (name, group, phone, ID, password) {
    try {

        // const userRows = await userProvider.userCheck(name);
        // if (userRows.length <= 0)
        // return errResponse({ "isSuccess": false, "code": 0, "message":"이미 가입한 정보입니다" })

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [name, ID,hashedPassword, phone, group];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1, "message":"회원가입에 성공하였습니다." });


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":`DB 에러:${err.message}` 
        });
    }
};

/** 
// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (ID, password) {
    try {
        // ID 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const loginInfoParams = [ID,hashedPassword]

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
**/
exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 유저 로그인 Logic
exports.userLogin = async function(ID,password){
    const connection = await pool.getConnection(async (conn)=>conn);
  
    console.log("JWT 토큰 생성해야해요. 로그인 했어요");
    
  
    const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  
  
    const [checkUserInfo] = await userDao.checkUserLoginInfo(connection,ID,hashedPassword);
    console.log(checkUserInfo)
    console.log(checkUserInfo.UserID)
    // console.log(checkUserInfo)

    //토큰 생성 Service
    let accessToken = await jwt.sign(
       {
           userId: checkUserInfo.UserID,
           name: checkUserInfo.Name
        }, // 토큰의 내용(payload)
        secret_config.jwtsecret, // 비밀키
        {
            expiresIn: "1h",
            subject: "userInfo",
        } // 유효 기간 1시간
    );

    // refreshToken 저장 Logic
    let refreshToken = jwt.sign(
        {}, 
        secret_config.jwtsecret, 
        { // refresh token은 payload 없이 발급
          algorithm: 'HS256',
          expiresIn: '2h',
        });
    // Refresh Token 저장
    const saveRefreshToken = await userDao.saveRefreshToken(connection,[refreshToken,checkUserInfo.UserID]);
    
    connection.release();
    
    return response({ 
        "isSuccess": true, 
        "code": 1, 
        "message":"로그인에 성공하였습니다."
    },
        {
            "AccessToken":accessToken, 
            "RefreshToken":refreshToken
        });

  }