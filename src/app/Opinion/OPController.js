const jwtMiddleware = require("../../../config/jwtMiddleware");
const OPProvider = require("../Opinion/OPProvider");
const OPService = require("../OPinion/OPService");
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
    console.log(req.body.data);

    return res.send(response(baseResponse.SUCCESS));
}