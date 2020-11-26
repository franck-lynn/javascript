// import path from 'path'
import passport from 'koa-passport'
// import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
// import dotenv from 'dotenv'

import { Strategy as LocalStrategy } from 'passport-local'
import { Base64 } from 'js-base64'

// 环境变量中设置口令
// F:\working\study\javascript\koa\passport\passport验证流程\passport-initialize.js
// const SECRET = dotenv.config({ path: path.resolve('../../../', '.env') }).parsed.SECRET


// 模拟的数据库和数据库的获取函数
const users = [{ _id: "5fbcd0964d888212bc1c4ce9", username: "赵敏", email: "zhaomin@163.com", password: "$2b$12$5pVPGQNFbdLDPgBKg9nSS.81RD3yXX.HFQJcICBeoAXOw6orvKoI2" }]
const getUserByEmail = async (email) => users.find(user => user.email === email)
const getUserById = async (id) => users.find(user => user._id === id)

// 使用的是邮箱进行注册, 邮箱有唯一性, initialize 是 passport 的配置部分
const initialize = (app) => {
    app.use(passport.initialize())
    app.use(passport.session())
    // 验证用户邮箱和密码的函数
    const authenticateEmail = async (email, password, done) => {
        // console.log("02, 初始化时获取的值", email, password)
        const user = await getUserByEmail(email)
        // console.log("03, 数据库中获取的值: ", user)
        if (user === null || user === undefined) {
            return done(null, false, { message: '没有此邮箱' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: '密码错误' })
            }
        } catch (e) {
            return done(e)
        }
    }
    //! passport 使用本地验证策略, 使用 email 字段和验证邮箱和密码的函数
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateEmail))



    // 序列化
    // 序列化后才有 ctx.login() 方法, 序列号是在session时进行的
    passport.serializeUser((user, done) => {
        console.log('01, 序列化--> ', user._id)
        done(null, user._id)
    })
    // 反序列化
    passport.deserializeUser((id, done) => {
        console.log("07. 调用反序列化的方法", id);
        (async () => {
            try {
                const user = await getUserById(id)
                done(null, user);
            } catch (error) {
                done(error);
            }
        })();
    })

}


// 登录时进行授权的函数, 在登录时使用
const authenticated = async (ctx, next) => {
    // console.log("01, 客户端传过来的参数", ctx.request.body)
    //! 1. 当登录时, 调用了这个验证函数, 首先进入这个函数
    //! 2. 接着, 进入 passport 的初始化程序, 进行邮箱和密码的验证.
    //!    邮箱, 密码验证是先通过邮箱在数据库中查找, 找到邮箱说明邮箱正确, 在比对密码, 都正确, 返回相应信息
    return await passport.authenticate('local', async (err, user, info, status) => {
        // 传入 authenticate, 这里是 authenticateEmail 函数
        //! 3. 验证正确时传过来的只有 user, 第1个参数是 error 必须要有, user 作为第2个参数
        // console.log(`验证正确时传过来的参数只有 user--> ${user._id}-${user.username}--${user.email}-${user.password}`)
        //! 这里还需要增加一些错误处理的逻辑, 给客户端以提示.
        // https://blog.csdn.net/weixin_43352901/article/details/109132357
        //! 4. 如果有 user, 序列化 user 到session
        // console.log("05, 通过认证后返回的user", user)
        if (user) {
            // 认证成功后返回 user, 调用 ctx.login(user), 把 user._id 进行序列化, 
            // 调用序列化的方法
            ctx.login(user)
            return await next()
        }
        if (info) {
            ctx.body = { info }
        } else {
            ctx.status = 400
            ctx.body = { status }
        }
    })(ctx)
}


const checkAuthenticated = (ctx, next) => {
    // 这里会调用反序列化的方法
    console.log("06.---> ", ctx.cookies.get('koa.sess'))
    console.log("07.---> ", ctx.cookies.get('koa.sess.sig'))
    console.log(Base64.decode(ctx.cookies.get('koa.sess')))
    console.log(Base64.decode(ctx.cookies.get('koa.sess.sig')))
    if (ctx.isAuthenticated()) {
        return next()
    }
    ctx.body = "没有通过授权"
}
const checkNotAuthenticated = (ctx, next) => {
    if (ctx.isAuthenticated()) {
        return ctx.redirect('/profile')
    }
    //! 要 return next() 才能有下一步的结果
    return next()
}
export { initialize, authenticated, checkAuthenticated, checkNotAuthenticated }