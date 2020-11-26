// import path from 'path'
import Koa from 'koa'

import Router from 'koa-router'
import bodyParser from 'koa-body'


const app = new Koa()
const router = new Router()


// body parser 处理post请求
app.use(bodyParser())

// TODO
router.post('/login', async ctx => {
    console.log("x-www-form-urlencoded请求--> ", ctx.request.body)
    ctx.body = ctx.request.body
})


app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})

// nodemon -r esm 不支持二进制的x-www-form-urlencoded.js  