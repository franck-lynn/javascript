import Router from 'koa-router'
const router = new Router()
// import users from '../db/users'
import passport from 'passport'

router.get('/', async ctx => {
    await ctx.render('home.html')
})

// 登录 路由
router.get('/login', async ctx => {
    console.log(ctx.state)
    // const {name, passport} = ctx.body
    await ctx.render('login.html', { user: ctx.body })
})

// 登录提交路由
router.post('/login', async (ctx, next) => {
    // console.log('经过一些列的准备, 终于可以在这里进行认证授权了')
    return await passport.authenticate(
        'local', 
        async(err, user, info, status) => {
            if(err) return ctx.body = '服务器错误' 
            if(info){
                // info 是 验证器返回的 键值对信息
                const {message} = info
                
                // 把这些信息放进 ctx.state 中 传到下一个路由
                ctx.state.message = message
                // console.log(ctx.state)
                return ctx.redirect('/login')
            }
            if(user){
                ctx.login(user)
                // 把数据放到 ctx.state 传给客户端
                ctx.state.user = user
                ctx.redirect('/profile')
            }else{
                ctx.status  = status
                ctx.body = '404页面'
            }
        }
    )(ctx, next)
})

// 验证路由
router.get('/github', async ctx => {
    ctx.body = "github 验证"
})
// 登出路由
router.get('/logout', async ctx => {
    ctx.body = '退出登录'
})



const routes = app => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}

export default routes