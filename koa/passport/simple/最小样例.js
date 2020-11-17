
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()
// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// koa-passport学习笔记
// https://www.jianshu.com/p/622561ec7be2
// koa-passport 主页
// https://www.npmjs.com/package/koa-passport
// passport 官网
// http://www.passportjs.org/  
// passport 学习笔记
// https://www.w3cschool.cn/passport_js_note/xiysfozt.html
//! 1, 定义一个验证用户的策略，需要定义name作为标识
const naiveStrategy = {
    name: 'naive',
    // 策略的主体就是authenticate(req)函数，在成功的时候返回用户身份，失败的时候返回错误
    authenticate: function (ctx){
        // 通过请求字符串析构
        let {uid}= ctx.query
        console.log("客户端传过来的 uid=", uid)
        if(uid){
            //! 2, 策略很简单，就是从参数里获取uid，然后组装成一个user
            let user = {id: parseInt(uid), name: 'user' + uid}
            this.success(user)
        }else{
            // 如果找不到uid参数，认为鉴权失败
            this.fail(401)
        }
    }
}
import passport from 'koa-passport'
passport.use(naiveStrategy)
//! 需要初始化一下
app.use(passport.initialize())
// 添加一个koa的中间件，使用naive策略来鉴权。这里暂不使用session
app.use(passport.authenticate('naive', {session: false}))



router.get('/', async ctx => {
    if (ctx.isAuthenticated() ){
        // ctx.state.user就是鉴权后得到的用户身份
        ctx.body = 'hello ' + JSON.stringify(ctx.state.user)
    }else{
        ctx.throw(401)
    }
})



app.use(router.routes())
app.use(router.allowedMethods())

// body parser
app.use(bodyParser());
app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})

// 运行命令 
// nodemon -r esm 最小样例.js








