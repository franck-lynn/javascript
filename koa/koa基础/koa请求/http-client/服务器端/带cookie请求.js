// import path from 'path'
import Koa from 'koa'

import Router from 'koa-router'
import bodyParser from 'koa-body'


const app = new Koa()
const router = new Router()


// body parser 处理post请求
app.use(bodyParser())

// TODO
router.get('/cookie', async ctx => {
    // 读取上下文中的cookie
    ctx.cookies.set('username', 'this is a cookie')
    const cookie =  ctx.cookies.get("username")
    ctx.body = cookie
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000/cookie")
})

// nodemon -r esm 带cookie请求.js