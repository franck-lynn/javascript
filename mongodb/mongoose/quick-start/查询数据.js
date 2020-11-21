/*
有这样一些CRUD的方法
Model.find()
Model.findById()
Model.findOne()
*/
import mongoose, { Schema, model } from "mongoose";

//url 带上复制集, 一般放在配置文件 config.js 中
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log("数据库连接成功"))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))
// 定义一个 Schema
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, },
    mobile: { type: Number, required: true },
    is_admin: { type: Boolean, required: false },
})

// 生成 model
const User = model('User', userSchema)
// Model.find()
// Model.findById()
// Model.findOne()
; (async () => {
    try {
        const users = await User.find()
        console.log(...users)
    } catch (e) {
        console.log(e)
    }/* finally{
        mongoose.disconnect()
    } */
})()

;(async () => {
    try {
        const user = await User.findById('5eaa26919e6c4313b4e8efb4')
        console.log(user)
    } catch (error) {
        console.log(error)
    }/* finally{
        mongoose.disconnect()
    } */
})()

;(async () => {
    try {
        const user = await User.findOne({ _id: '5eaa26919e6c4313b4e8efb4' })
        console.log("user: ", user)
    } catch (e) {
        console.log(e)
    } finally {
        mongoose.disconnect()
    }
})()



