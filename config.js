const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config() // process.env 객체에 .env 에 정의한 환경변수 추가 
// console.log(process.env)

module.exports = {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET
}

