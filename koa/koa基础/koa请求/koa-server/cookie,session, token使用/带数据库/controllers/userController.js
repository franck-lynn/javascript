import {User} from '../models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const getAllUsers = async (ctx) => {
    console.log("请求字符串", ctx.request.query)
    const {name, age} = ctx.query
    console.log(name, age)
    const res = await User.find()
    ctx.body = res
} 

const findById = async (ctx) => {
    const {id} = ctx.params
    const res = await User.findOne({_id: id})
    console.log(res)
    ctx.body = res
}

const login = async (ctx) => {
    const { name, password } = ctx.request.body
    const user = await User.findOne({name: name})
    console.log("数据库中查到的用户名是: ", user, user._id)
    if(!user){
        ctx.status = 422
        return ctx.body = {err: '用户名不存在'}
    }
    const isPasswordValid = await bcrypt.compare(
        password, user.password
    )
    if(!isPasswordValid){
        ctx.status = 422
        return ctx.body = { err: '密码无效' }
    }
    const token = jwt.sign({ id: String(user._id) }, 'secretkey')
    console.log("token是 ", token)
    ctx.body = {user, token}
}
const register = async (ctx) => {
    // 注册的时候, 客户端要传过来用户信息
    const { name, email, password, mobile } = ctx.request.body
    // 在数据库中查找 下 name, 如果有, 说明注册过了
    const hasThisUser = await User.findOne({name: name})
    // console.log("查看是否已经注册过了", hasThisUser)
    if(hasThisUser){
        return ctx.body = '已经注册过了'
    }
    // 如果没有注册过
    // 对密码明文进行加密加盐
    const pwd = await bcrypt.hash(password, 10)
    // 把数据写入数据库
    const user = new User({
        name: name,
        email, 
        password: pwd,
        mobile
    })
    await user.save()
    return ctx.body = "注册成功"
}




const auth = async (ctx, next) => {
    // console.log(ctx)
    console.log(ctx.header.authorization)
    // 对请求头进行分割
    const raw = ctx.header.authorization.split(' ').pop()
    console.log("01, raw---------> ", raw)
    // // 解密
    const { id } = jwt.verify(raw, 'secretkey')
    console.log("02, 解析出来的周芷若的id ", id)
    
    const user = await User.find({_id: id})
    // console.log(user)
    // // 把user保存在 ctx.state.user 为后面的中间件使用
    ctx.state.user = user
    next()
}

const getProfile = async ctx => {
    ctx.body = 'welcome, 欢迎你, 已经登陆进来了'
}



export { getAllUsers, findById, login, register, auth, getProfile }