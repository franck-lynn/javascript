passport-kyle 教程总结
======================
### 目录结构
    |--- db
    |    |---user.js // 模拟数据库获取用户数据
    |--- passport-config
    |    |---initialize.js // passport初始化
    |---routes
    |    |---index.js // 各种跳转的路由
    |---views
    |    |---index.html // 主页面
    |    |---login.html // 登录页面
    |    |---register.html // 注册页面
    |---server.js // 服务器
### 服务器文件 server.js 
    import path from 'path'
    import Koa from 'koa'
    // ./routes 是路由文件夹, 该文件夹下index.js打包处理所有路由
    import routes from './routes'
    import bodyParser from 'koa-body'
    import session from 'koa-session'
    // 加入模板引擎
    import views from 'koa-views'
    import passport from 'koa-passport'
    import { initialize } from './passport-config/passport-config'
    
    const app = new Koa()
    const router = new Router()
    
    // body parser 解析 post 请求参数
    app.use(bodyParser())
    app.use(views(path.join(__dirname), { map: { html: 'ejs' } }))
    // 设置session
    app.keys = ['super-secret-key']
    app.use(session(app))
    // --------------------------------------------------------
    // passport 初始化, 3个参数
    initialize(
        passport,
        email =>{ 
            // console.log("传给验证器的函数", email)
            return users.find(user => user.email === email)
        },
        id => {
            return users.find(user => {
                // console.log("user.id是否与 id 相等? ", user.id === id)
                return user.id === id
            })
        }
    )
    // 加入 passport 中间件
    app.use(passport.initialize())
    // 启用 passport session
    app.use(passport.session())
    // --------------------------------------------------------
    // 批量注册路由
    routes(app)
    app.listen(3000, _ => {
        console.log("Server is running at http://localhost:3000")
    })
    
### passport 初始化文件 initialize.js   

    import { Strategy as localStrategy } from 'passport-local'
    import bcrypt from 'bcrypt'

    const initialize = (passport, getUserByEmail, getUserById) => {
        const authenticateEmail = async (email, password, done) => {
            const user = getUserByEmail(email)
            // console.log("02, 策略验证器: ", user)
            // 已经 根据客户端传过来的 Email 从数据库拿到了 user
            // id: '123456789abc',
            // name: 'zs',
            // email: 'zs@163.com',
            // password: '$2b$10$Zq2ZwVamVSi0X/RM0ROYOOQAAi4dv9T2DRcawW2wnwGsaddu2XXA2'
            if (user === null || user === undefined) {
                return done(null, false, { message: '没有此邮箱' })
            }
            // const isPasswordEquals = await bcrypt.compare(password, user.password)
            // console.log("密码是否相等?", isPasswordEquals)
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
        
        passport.use(new localStrategy({ usernameField: 'email' }, authenticateEmail))
        
        // 序列化和反序列化
        passport.serializeUser((user, done) => {
            // console.log('01, 序列化--> ', user.id)
            done(null, user.id)
        })
        
        passport.deserializeUser((id, done) => {
            // 根据id恢复用户
            // console.log("02, 反序列化, id=", id)
            // return done(null, getUserById(id))
            done(null, getUserById(id))
        })
    }
    export { initialize }
        
 ### routes/index.js 路由文件
    get '/' 根路由, 谁都可以进来, 不设权限
    get '/login' 登录, 没有授权时需要导航到这个页面
    get '/register' 注册 页面, 登录时没有显示没有注册导航到注册页面
    
    post '/login' 登录提交页面
    post '/register' 注册提交页面
    get '/porfile' // 有授权时到这个页面
<hr>   
    
    利用 ctx.state 可以传递参数, 详细参见 koa传参
    
<hr>

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
 
    
    
    
    
    
    
    
    
    
    
    
    