const express = require('express')
const User = require('../models/User') // 데이터 CRUD 용도
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')
const { validationResult, oneOf } = require('express-validator')
const { 
    validateUserName, 
    validateUserEmail,
    validateUserPassword 
} = require('../../validator')

const router = express.Router() // 라우터 모듈

router.post('/register', (req, res, next) => {
    req.type = "register"
    next()
}, [ // 폼검증을 위한 미들웨어 
    validateUserName(),
    validateUserEmail(),
    validateUserPassword()
], expressAsyncHandler(async (req, res, next) => { // /api/users/regisWter
    const errors = validationResult(req)
    if(!errors.isEmpty()){ // 폼 검증에 실패한 경우
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invalid Form data for user',
            error: errors.array()
        })
    }else{
        console.log(req.body)
        const user = new User({
            name: req.body.name, 
            email: req.body.email, 
            userId: req.body.userId, 
            password: req.body.password
        })
        user.save() // 사용자정보 DB 저장 
        .then(() => {
            const {name, email, userId, isAdmin, createdAt } = user
            res.json({
                code: 200,
                token: generateToken(user), // 사용자 식별 + 권한검사를 위한 용도 
                name, email, userId, isAdmin, createdAt, // 사용자에게 보여주기 위한 용도
                status: user.status, 
                createdAgo: user.createdAgo,
                lastModifedAgo: user.lastModifiedAgo 
            })
        })
        .catch(e => {
            console.log(e)
            res.status(400).json({ code: 400, message: 'Invalid User Data'})
        })
    }
}))

module.exports = router 