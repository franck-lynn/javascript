import {User} from '../models/userModel'

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


export { getAllUsers, findById }