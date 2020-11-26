// https://www.bilibili.com/video/BV1Nb411j7AC/?spm_id_from=333.788.videocard.4
// import path from 'path'
import Koa from 'koa'
// import views from 'koa-views'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const app = new Koa()
const router = new Router({ prefix: '/api' })

// body parser 处理post请求
app.use(bodyParser())

// TODO
const users = [{
    _id: '1604542335561',
    name: '周芷若',
    email: "zhouzhiruo@163.com",
    password: "$2b$10$x9Yd3d7XH1DRG7SQYPF1Ue/PS4Z.aEmzwx0LQk7UcvJ8uWAK9rqju",
    mobile: 13616611561
}]
// 查看所有用户
router.get('/users', async ctx => {
    ctx.body = users
})
// 根据 id 查找用户
router.get('/path/:id', async ctx => {
    const { id } = ctx.params
    console.log("获取请求参数传过来的id----> ", id)
    // find(user 这里的 user  是数据里的
    const user = users.find(user => user._id === id)
    ctx.body = user
})
// 注册请求, 加密, 限制重复 后期需要加上
router.post('/register', async ctx => {
    const { name, email, password, mobile } = ctx.request.body
    // 用这个 传过来的 username 在数据库里查找, 看看数据库里有没有这个人
    const hasThisUser = users.find(user => user.name === name)
    console.log(hasThisUser)
    if (!hasThisUser) {
        const id = new Date().getTime() + ''
        const pwd = await bcrypt.hash(password, 10)
        const user = { _id: id, name, email, password: pwd, mobile }
        users.push(user)
        // 对密码进行加密
        ctx.body = user
    } else {
        ctx.body = '已经注册过了, 数组里面有这个数据'
    }

})


router.post('/login', async (ctx, next) => {
    const { name, password } = ctx.request.body

    // 先看看数据库中用户名存不存在, 如果 用户名都不存在, 后面就不用处理了
    const user = users.find((user) => user.name === name)

    console.log(user)
    if (!user) {
        ctx.status = 422
        return ctx.body = { err: '用户名不存在' }
    }
    // 否则用户存在, 比较 密码 是否有效
    const isPasswordValid = await bcrypt.compare(
        password, // 客户端传过来并进行密码,
        user.password
    )
    if (!isPasswordValid) {
        ctx.status = 422
        return ctx.body = { err: '密码无效' }
    }
    // 返回用户对象
    // 生成 token
    const token = jwt.sign({ id: String(user.id) }, 'secretkey')
    // 35:37
    ctx.body = { user, token }
    next()
})

const auth = async (ctx, next) => {
    // console.log(ctx.header.authorization)
    // 对请求头进行分割
    const raw = ctx.header.authorization.split(' ').pop()
    // console.log("01, raw---------> ", raw)
    // 解密
    const { id } = jwt.verify(raw, 'secretkey')
    // console.log("02, id----------> ", id)
    // console.log("03, users----------> ", users)
    const user = users.find(user => user.id === id)
    // console.log(user)
    // 把user保存在 ctx.state.user 为后面的中间件使用
    ctx.state.user = user
    next()
}


router.get('/profile', auth, async ctx => {
    ctx.body = ctx
})




app.use(router.routes())
app.use(router.allowedMethods())

// app.use(views(path.join(__dirname, "./views"), { map: { html: 'ejs' } }))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})

// nodemon -r esm 后端有返回值的请求.js  