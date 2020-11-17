// https://www.jianshu.com/p/593a762249f5
// js-cookie
import path from 'path'
import Koa from 'koa'
// ./routes 是路由文件夹, 该文件夹下index.js打包处理所有路由

import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
// 连接 mongodb 数据库
import mongoose from 'mongoose'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, {useUnifiedTopology: true}, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const app = new Koa()

// 设置session
app.keys = ['super-secret-key']

const config = {
    key: 'koa:sess',
    maxAge: 1000 * 10,
}

app.use(session(config, app))

// body parser
app.use(bodyParser());
//! 路由设置开始
import Router from 'koa-router'
const router = new Router()
/*
    router.get('/cookie', async ctx => {
        //! 设置 cookie, 可以设置 中文的 cookie
        let encode = (Buffer.from('狗子')).toString('base64')
        // console.log("编码后的字符串---> ", encode)
        ctx.cookies.set('userInfo', encode, { maxAge: 1000 * 20})
        // https://cloud.tencent.com/developer/article/1732836
        //! cookie 获取不到? 用 js-cookie 插件看看
        // https://www.cnblogs.com/longchuqianyuan/p/13498302.html
        const cookie = ctx.cookies.get("userInfo")
        // console.log(cookie)
        const decode = Buffer.from(cookie, 'base64').toString()
        // console.log(decode)
        ctx.body = { decode }
    })
*/

router.get('/session', async ctx => {
    let n = ctx.session.views || 0
    ctx.session.views = ++n
    ctx.body = n + ' views'
})





const routes = app => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}
//! 路由设置结束

// 批量注册路由
routes(app)

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000/session")
})