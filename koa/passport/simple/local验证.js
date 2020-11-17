// https://www.w3cschool.cn/passport_js_note/xiysfozt.html
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import passport from 'koa-passport'
import { Strategy as LocalStrategy } from 'passport-local'

const app = new Koa()
const router = new Router()

// body parser, 要在路由之后执行
app.use(bodyParser());

const users = [
    { username: 'zs', password: '123' }
]
// 配置策略
passport.use(
    new LocalStrategy(
        // 第1个参数选型的设定
        // 第2个参数是验证函数
        (username, password, done) => {
            console.log(`03, 客户端的数据: username = ${username}--- password=${password} ---  ${done}`)
            // 从数据库中查找 username, 
            const user = users[0]
            if (username === user.username && password === user.password) {
                return done(null, user)
            }else{
                return done(null, false, { message: '用户名或密码不匹配' })
            }
        }
    )
)

// passport.serializeUser((user, done) => {
//     console.log(`04, 序列化 ---> user = ${JSON.stringify(user)} --- ${done} `)
//     done(null, user.id)
// })
// passport.deserializeUser((id, done) => {
//     console.log("03, 反序列化 ---> ")
//     users.findById(id, (err, user) => done(err, user))
// })

app.use(passport.initialize())

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
            ctx.body = "没有权限"
            return
            // return ctx.redirect('/login');
        }
        console.log("通过验证!----")
        ctx.body = "验证通过"
        // ctx.login(user, e => {
        //     if (e) return next(e)
        //     return ctx.redirect('/user')
        // })
    })(ctx, next)
})
app.use(router.routes())
app.use(router.allowedMethods())




app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})
