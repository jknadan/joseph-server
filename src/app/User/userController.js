const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: name, group, phone, ID, password
     */

    console.log(req.body);
    const {name, group, phone, ID, password} = req.body;
    console.log(`${name}, ${group}, ${phone}, ${ID}, ${password}`);

    // 빈 값 체크
    if (!name)
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"이름을 입력해주세요" },));
    if (!group) return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"소속을 입력해주세요" },));
    if (!phone) 
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"전화번호를 입력해주세요" },));
    if (!ID) 
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"아이디를 입력해주세요" },));
    if (!password) 
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"비밀번호를 입력해주세요" },));
    
    // 만약 name,ID,group,phone에서 특수문자가 있다면 특수문자 제거 Validation
    const regExp = /[~!@#$%^&*()_+|<>?:{}]/;

    if (regExp.test(name))
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"이름에 특수문자를 포함할 수 없습니다." },));

    if (regExp.test(ID))
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"아이디에 특수문자를 포함할 수 없습니다." },));

    if (regExp.test(group))
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"소속에 특수문자를 포함할 수 없습니다." },));

    if (regExp.test(phone))
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"전화번호에 특수문자를 포함할 수 없습니다." },));

    const signUpResponse = await userService.createUser(
        name,
        group, 
        phone, 
        ID, 
        password
    );

    return res.send(signUpResponse);
};


exports.userLogin = async function(req,res){

    const {ID, password} = req.body;
    console.log(ID, password)

    // 빈 값 체크
if (!ID) return res.send(errResponse({
    "isSuccess": false,
    "code": 0,
    "message": "아이디를 입력해주세요"
},));
if (!password) return res.send(errResponse({
    "isSuccess": false,
    "code": 0,
    "message": "비밀번호를 입력해주세요"
},));

const responseLoginInfo = userProvider.userLogin(ID,password);

return responseLoginInfo;

}

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
