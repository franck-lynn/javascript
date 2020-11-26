import path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
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
const router = new Router()

// body parser 要在路由注册之前调用
app.use(bodyParser());

const users = [{username: 'zs', password: '123'}]

router.post('/register', async (ctx) => {
    // 注册路由. 获取注册请求的信息
    // console.log(ctx.request.body)
    const {username, password} = ctx.request.body
    // 保存用户名和密码
    users.push({username, password})
    // 跳转到登录页面
    ctx.redirect('/index.html')
})
// router.get('/login', async(ctx) => {
    
// })
router.post('/login', async (ctx, next) => {
    // 登录请求
    const { username, password } = ctx.request.body
    console.log(username, password)
    return ctx.body = "sdkjdweewihwfe834r349878"
    // 登录成功后向客户端返回 token
    // ctx.redirect('/profile')
})
router.get('/profile', async(ctx) => {
    ctx.body = "欢迎光临"
})
const routers = [router]
// 批量注册路由函数
const routes = app => {
    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })
}
// 批量注册路由
routes(app)

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})