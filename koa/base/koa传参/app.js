
/**
* Created by franck.lynn on 2020-06-24.
* lry_demry@163.com 
* filename:  app 
* koa 传参
*/

import path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import views from 'koa-views'


const app = new Koa()
const router = new Router()

let user = 'zs'

router.all('/', async (ctx, next) => {
    ctx.state.name = "global"
    await next()
})

router.get('/', async ctx => {
    ctx.state.user = "Alice"
    //! 利用 ctx.state, 再在 rende 里将数据刷到 客户端, 可以实现数据的传递
    // console.log(ctx.state)
    // { name: 'global', user: 'Alice' }
    await ctx.render('index.html', ctx.state)
})

// 路由跳转时传值
router.get('/source', async (ctx) => {
    // 在 源对象 上 附加的值
    // ctx.state.redirect = "跳转时传的值"
    // 跳转时无法实现传值, 可以在全局定义一个变量, 在这里修改变量, 
    // 跳转时再拿这个变量
    user = '张三'
    ctx.redirect('/target')
})

router.get('/target', async ctx => {
    ctx.state.name = user
    await ctx.render('target.html', ctx.state)
})
//! 如何从 session 中获取数据?


app.use(views(path.join(__dirname, "./views"), { map: { html: 'ejs' } }))

app.use(bodyParser());
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})
