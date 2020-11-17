import path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import session from 'koa-session'
import views from 'koa-views'
import passport from 'koa-passport'
import { Strategy as localStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

const app = new Koa()
const router = new Router()
// body parser
app.use(bodyParser())
app.use(views(path.join(__dirname), { map: { html: 'ejs' } }))
// 设置session
app.keys = ['super-secret-key']
app.use(session(app))


const users = [{ id: "123456789abc", name: "zs", email: "zs@163.com", password: "$2b$10$o3A/8SXZPKeJaXYDGwN9bOFCJTLuyMsTmTI0qW0D9c813FZSvapgC" }]
const getUserByName = name => users.find(user => user.name === name)
const getUserById = id => users.find(user => user.id === id)

// 配置验证策略
passport.use(new localStrategy(
    async (username, password, done) => {
        const user = getUserByName(username)
        if(user === null) {
            return done(null, false, {message: '没有此用户'})
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {message: '密码错误'})
            }
        }catch(e){
            return done(e)
        }
    }
))
// 序列化
passport.serializeUser((user, done) => done(null, user.id))
// 反序列化
passport.deserializeUser((id, done) => done(null, getUserById(id)))
app.use(passport.initialize())
app.use(passport.session())


router.get('/', async ctx => await ctx.render('local带session,bcrypy-测试.html'))
router.post('/login', async (ctx) => {
    return await passport.authenticate('local', (err, user) => {
        if(user){
            console.log("验证通过", user)
            ctx.login(user)
            ctx.body = '验证通过'
        }else{
            ctx.status = 400
            ctx.body = {status: 'error'}
        }
    })(ctx)
})


app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})

// 执行命令
// nodemon -r esm 'local带session,bcrypt.js'




