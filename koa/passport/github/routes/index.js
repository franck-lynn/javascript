import Router from 'koa-router'

const router = new Router()

router.get('/', async ctx => {
    await ctx.render('home.html')
})

// 登录 路由
router.get('/login', async ctx => {
    await ctx.render('login.html', { user: ctx.body })
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