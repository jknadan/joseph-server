/** 
// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickname 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}
**/
// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {

  const insertUserInfoQuery = `
    INSERT INTO User(Name, ID, Password, PhoneNumber, GroupNum) 
    VALUES (?,?,?,?,?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

async function checkUserLoginInfo(connection, ID, password){
  const checkUserInfoQuery = `
  select UserID,Name
  from User 
  where ID= ? and Password = ?;
  `;
  const userInfoResult = await connection.query(checkUserInfoQuery,[ID,password]);
  return userInfoResult[0];

}

async function saveRefreshToken(connection,updateInfo){
  const saveRefreshTokenQuery = `
    UPDATE User 
    SET RefreshToken = ? 
    Where UserID = ?;
  `;

  const userSaveInfo = await connection.query(saveRefreshTokenQuery,updateInfo);
  return userSaveInfo[0];
}


module.exports = {
  checkUserLoginInfo,
  saveRefreshToken
};
