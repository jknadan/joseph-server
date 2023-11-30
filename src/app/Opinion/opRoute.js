module.exports = function(app){
    const opi = require('./oPController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/opinion/test', opi.getTest);

    // 1. 의견 수렴 API
    app.post('/opinion', opi.getOpinion);



};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API
