import Router from 'koa-router'
import bcrypt from 'bcrypt'
import passport from 'koa-passport'
const router = new Router()
// 模拟数据库
import users from '../db/users'


const checkAuthenticated = (ctx, next) => {
    if(ctx.isAuthenticated()) {
        return next()
    }
    ctx.redirect('/login')
}
const checkNotAuthenticated = (ctx, next) => {
    if(ctx.isAuthenticated()){
        return ctx.redirect('/profile')
    }
    //! 要 return next() 才能有下一步的结果
    return next()
}


router.get('/', async ctx => {
    await ctx.render('index.html', {name: 'Kyle'})
})
// 检查有没有得到授权, 没有, 就进行注册操作
router.get('/login', checkNotAuthenticated, async (ctx) => {
    //! 通过 请求字符串 来传递 信息
    // console.log(ctx.query)
    let {info} = ctx.query
    info = info? JSON.parse(info): {message: null}
    // console.log(info.message)
    // console.log(info.message) 
    console.log("没有授权是到了这里, 怎么不能跳转呢?")
    // {"message":"没有此邮箱"}
    return await ctx.render('login.html', info)
})

router.get('/profile', checkAuthenticated, async ctx => {
    console.log("获取请求的值: ", ctx.request)
    await ctx.render('profile.html')
})

router.post('/login', checkNotAuthenticated, async (ctx) => {
    //!!! 少写了 一个 return, 排查了很长时间
    return await passport.authenticate('local', async (err, user , info, status ) => {
        // 接收 验证策略 传过来的 参数 
        // 如果策略有错误, err 就是接收 策略验证器传过来的错误信息
        console.log(`验证传过来的参数--> user= ${user} -- info= ${info} --status=${status}--err=${err} `)
        // console.log(`验证传过来的参数--> user= ${JSON.stringify(user)} -- info= ${info} --status=${status}--err=${err} `)
        // console.log(`验证传过来的参数--> user= ${user} -- info= ${JSON.stringify(info)} --status=${status}--err=${err} `)
        // 验证传过来的参数--> 
        // user= { "id":"1592905003368","name":"zs","email":"zs@163.com",
        //         "password":"$2b$10$Zq2ZwVamVSi0X/RM0ROYOOQAAi4dv9T2DRcawW2wnwGsaddu2XXA2"} 
        //         -- info= undefined --status=undefined--err=null 
        if(info){
            console.log(info)
            // console.log(ctx.flushHeaders.toString())
            // function(){ return this[target][name].apply(this[target], arguments); }
            // info= {"message":"没有此邮箱"}
            return ctx.redirect('/login?info=' + JSON.stringify(info))
        }
        if(user){
            // console.log("验证通过....", ctx.login.toString())
            // ctx.login = 
            // function(user, options) {
            //     return new Promise((resolve, reject) => {
            //         login.call(req, user, options, err => {
            //             if (err) reject(err)
            //             else resolve()
            //         })
            //     })
            // }
            ctx.login(user)
            
            // ctx.body = '验证通过'
            ctx.redirect('/profile')
        }else{
            ctx.status = 400
            ctx.body = { status: 'error'}
        }
    })(ctx)
})


router.get('/register', async ctx => {
    await ctx.render('register.html')
})
router.post('/register', checkNotAuthenticated, async ctx => {
    // console.log("请求体的内容: ", ctx.request.body)
    const { name, email, password } = ctx.request.body
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        users.push({
            id: Date.now().toString(),
            name,
            email,
            password: hashPassword
        })
        // 注册成功, 跳转到登录页面
        ctx.redirect('/login')
    } catch {
        ctx.redirect('/register')
    }
    // console.log(users)
})



const routes = app => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}

export default routes