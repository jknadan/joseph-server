const jwtMiddleware = require("../../../config/jwtMiddleware");
const OPProvider = require("./opProvider");
const OPService = require("./opService");
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

exports.getOpinion = async function(req,res) {
    const opinionData = req.body.data;
    const text = opinionData.opinion;

    if (opinionData.length === 0){
        return res.send(
            errResponse({ 
                "isSuccess": false, 
                "code": 0, 
                "message":"빈 내용을 보낼 수는 없습니다." },));
    } 

    // opinionData를 Provider와 Dao를 거쳐서 DB에 입력되도록 해야함
    const insertOpinion = await OPService.insertOpinion(text);

    if (insertOpinion.isSuccess === true){
        return res.send(response(baseResponse.SUCCESS));
    }else{
        return res.send(errResponse({ 
            "isSuccess": false, 
            "code": 0, 
            "message":"작업에 실패하였습니다." },));
    }

}