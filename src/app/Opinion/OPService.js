const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

const OPProvider = require("./opProvider");
const opDao = require("./opDao"); // 이 오류는 무시해도 됨


exports.insertOpinion = async function(opinionData){
    try{
        
        const connection = await pool.getConnection(async (conn) => conn);

        const opinionResult = await opDao.insertData(connection, opinionData);
        // console.log(opinionResult);

        connection.release();
        
        return baseResponse.SUCCESS; 

    }catch(err){
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
