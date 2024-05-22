const express = require("express");
const app = express();
const axios = require('axios')
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const config = require('../config')
const usersRouter = require('./src/routes/users')

const corsOptions = {
    origin: '*', // 해당 URL 주소만 요청을 허락함 
    credentials: true // 사용자 인증이 필요한 리소스를 요청할 수 있도록 허용함
}

// MONGODB_URI : VERCEL Settings -> Integrations 에서 MongoDB Atlas 연동하면 자동으로 설정되는 환경변수
console.log("출력: ", process.env.MONGODB_URI) 
mongoose.connect(process.env.MONGODB_URI) 
.then(() => console.log("데이터베이스 연결 성공!!!"))
.catch(e => console.log(`데이터베이스 연결 실패 !!!: ${e}`))

/******************** 공통 미들웨어 **********************************/
app.use(cors(corsOptions)) // cors 설정 미들웨어 
app.use(express.json()) // 요청본문 (request body) 파싱(해석)을 위한 미들웨어
app.use(logger('tiny')) // 로거설정
/* ****************************************************************** */

app.use('/api/users', usersRouter) // User 라우터

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get('/children', async (req, res) => {
    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
    const open_url = 'https://e-childschoolinfo.moe.go.kr/api/notice/basicInfo2.do?key=ff96b6a8a0a04839b3a6e5974cecd3d7&sidoCode=27&sggCode=27140'
    const result = await fetch(open_url)
    const data = await result.json()
    // console.log(data)
    res.json({msg: '연결성공', data})
})

app.get('/fetch', async (req, res) => {
    // OPEN API 데이터 요청 
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    console.log(response)
    res.send({todos: response.data})
})

app.get('/error', (req, res) => {
    throw new Error('서버에 치명적인 에러가 발생하였습니다.')
})

app.get('/hello', (req, res) => {
    res.json('서버에서 보낸 응답!!!')
})

// 폴백 핸들러 (fallback handler)
app.use((req, res, next) => {
    res.status(404).send("페이지를 찾을수 없습니다!")
})
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send("서버에러 발생!")
})

app.listen(5001, () => {
    console.log("서버접속 성공 !")
});

module.exports = app;