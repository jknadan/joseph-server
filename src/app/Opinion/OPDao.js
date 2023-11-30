// 의견 저장
exports.insertData = async function insertData(connection, opinionData){
    const insertDataQuery = 
    `INSERT INTO josephDB.Opinion(message) values (?);`;

    const insertDataQueryResult = await connection.query(insertDataQuery,opinionData);

    return insertDataQueryResult;

}

