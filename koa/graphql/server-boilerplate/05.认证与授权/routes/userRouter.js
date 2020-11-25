import path from 'path'
import Router from 'koa-router'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../model/user'
import dotenv from 'dotenv'

// 环境变量 中设置 口令
const SECRET = dotenv.config({ path: path.resolve('../../../../', '.env') }).parsed.SECRET

const userRouter = new Router()

userRouter.post('/login', async (ctx) => {
    // 登录时判断用户名和密码
    const { name, password } = ctx.request.body
    const user = await User.findOne({ name: name })
    if (!user) {
        ctx.status = 422
        return ctx.body = { err: '用户名不存在' }
    }
    const isPasswordValid = await bcrypt.compare(
        password, user.password
    )
    if (!isPasswordValid) {
        ctx.status = 422
        return ctx.body = { err: '密码无效' }
    }
    // 5秒后 token 失效
    const token = jwt.sign({ id: String(user._id) }, SECRET, { expiresIn: '1h' })
    // ctx.header.authorization = token 
    ctx.body = { user, token } // 是给页面用的的
    // return { user, token }
})

userRouter.post('/register', async (ctx) => {
    // 注册的时候, 客户端要传过来用户信息, 通过 ctx.request.body
    const { username, email, password } = ctx.request.body
    // 在数据库里查找
    const hasEmail = await User.findOne({ email })

    if (hasEmail) { // 要用return, 否则继续往下走
        return ctx.body = { msg: '已经注册过了' }
    }

    // 如果没有注册过, 对密码明文进行加密加盐
    const pwd = await bcrypt.hash(password, 12)
    // 生成用户对象
    const user = new User({
        username,
        email,
        password: pwd
    })
    ctx.body = await user.save()
})


export { userRouter }