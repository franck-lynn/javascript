
import path from 'path'
// import http from 'http'
import https from 'https'
import fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

router.get('/', async ctx => {
    ctx.body = "hello https"
})

app.use(router.routes())
app.use(router.allowedMethods())

// http.createServer(app.callback()).listen(3000, () => console.log(
//     `http服务器运行在 3000端口: http://localhost:3000`
// ))
const options = {
    key: fs.readFileSync(path.join(__dirname, './cert/lynn_server.key'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname, './cert/lynn_server.cert'), 'utf-8')
}
https.createServer(options, app.callback()).listen(443, () => console.log(
    `https服务器运行在 443端口: https://localhost:443`
))
// 执行命令 nodemon -r esm https-app.js 启动服务器
// https://localhost/