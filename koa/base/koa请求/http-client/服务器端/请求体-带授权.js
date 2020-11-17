// import path from 'path'
import Koa from 'koa'
import {} from 'casbin'
import Router from 'koa-router'
import bodyParser from 'koa-body'


const app = new Koa()
const router = new Router()

// body parser 请求解析要放在注册路由的前面?
app.use(bodyParser());

router.post('/comments', async ctx => {
    // 获取 token
    const authoriztion = ctx.get('Authorization')
    console.log(authoriztion)
    
    console.log(ctx.request.body)
    
    const html = {
        authoriztion,
        body: ctx.request.body
    }
    ctx.body = html
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})

// nodemon -r esm 请求体-带授权.js  

