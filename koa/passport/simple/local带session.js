// https://www.w3cschool.cn/passport_js_note/xiysfozt.html
import path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import passport from 'koa-passport'
import { Strategy as LocalStrategy } from 'passport-local'
import koaStatic from 'koa-static'
import session from 'koa-session'
import views from 'koa-views'

const app = new Koa()
const router = new Router()

// body parser, 要在路由之后执行
app.use(bodyParser());


// 这个要在 路由之前定义, 才能在路由中加载 render 方法
app.use(views(path.join(__dirname), { map: { html: 'ejs' } }))

const users = { id: 1, username: 'zs', password: '123', mobile: 123456789 }
const fetchUser = (() => {
    const user = users
    return async () => {
        return user;
    }
})()
// 配置策略
passport.use(
    new LocalStrategy(
        // 第1个参数选型的设定
        // 第2个参数是验证函数
        (username, password, done) => {
            // console.log(`03, 客户端的数据: username = ${username}--- password=${password} ---  ${done}`)
            // 从数据库中查找 username, 
            const user = users
            if (username === user.username && password === user.password) {
                return done(null, user)
            }else{
                return done(null, false, { message: '用户名或密码不匹配' })
            }
        }
    )
)
/*
手动解码
{ "passport": { "user": { "username": "zs", "password": "123" } }, "_expire": 1592963002336, "_maxAge": 86400000 }
koa.sess.sig  -session前面
koa.session -session
用id进行序列化的结果
04, 序列化-- - > user = { "id": 1, "username": "zs", "password": "123" }-- - function serialized(e, o) {
    pass(i + 1, e, o);
}--userID = 1
*/
passport.serializeUser((user, done) => {
    console.log(`04, 序列化 ---> user = ${JSON.stringify(user)} --- ${done} --userID = ${user.mobile}`)
    // 只有登录 成功时才进行序列化和反序列化的操作, 是将数据库 中找到的 user 进行序列化
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    console.log("05, 反序列化 ---> ", id, done.toString())
    // 反序列化也是在登录成功时才进行的操作, 反序列化是拿序列化时的 键 去数据库里找 user, 找到说明操作成功, 
    // 只是这个键 是进行加密的
    const user = fetchUser()
    done(null, user)
})

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

app.use(passport.initialize())
//! 带上session
app.use(passport.session())


router.get('/success', async ctx => {
    await ctx.render('success.html')
})
router.get('/fail', async ctx => {
    await ctx.render('fail.html')
})
router.get('/login', async ctx => await ctx.render('local本地验证带session-测试.html'))

// 初始化完成, 现在可以进行验证了
router.post('/login', async (ctx, next) => {
    // console.log(ctx.request.body)
    // 自定义 回调函数
    passport.authenticate('local', (err, user /* , info */ ) => {
        // console.log("得到了 user", user)
        if (err) {
            // console.log("01, 出现了错误 ---> ", err)
            return next(err)
        }
        if (!user) {
            console.log('没有权限')
            return ctx.redirect('/login');
        }
        // console.log("通过验证!----")
        // ctx.redirect('/success')
        ctx.login(user)
        ctx.redirect('/success')
    })(ctx, next)
})
app.use(router.routes())
app.use(router.allowedMethods())


// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    // http://localhost:3000/index.html 通过这个网址可以访问
    index: 'local本地验证带session-测试.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})
