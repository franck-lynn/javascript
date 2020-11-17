/*
有这样一些CRUD的方法
Model.deleteMany()
Model.deleteOne()
Model.find()
Model.findById()
Model.findByIdAndDelete()
Model.findByIdAndRemove()
Model.findByIdAndUpdate()
Model.findOne()
Model.findOneAndDelete()
Model.findOneAndRemove()
Model.findOneAndReplace()
Model.findOneAndUpdate()
Model.replaceOne()
Model.updateMany()
Model.updateOne()
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

//  定义实例方法, 不能用箭头函数
userSchema.methods.getNameAndEmail = function() { return this.name + "---" + this.email }
// 定义虚拟属性方法
userSchema.virtual('nameAndEmail').get(function() { return this.name + "***" + this.email })
// 生成 model
const User = model('User', userSchema)
// 比较两种方法所用时间
console.time(1)
// 查询数据
User.findById('5eaa26919e6c4313b4e8efb4').then(
    user => {
        // 虚拟属性
        console.log(user.getNameAndEmail())
        // mongoose.disconnect()
    }
).catch(e => console.log(e))
console.timeEnd(1)

console.time(2)
User.findById('5eaa26919e6c4313b4e8efb4').then(
    user => {
        // 虚拟属性
        // console.log(user)
        console.log(user.nameAndEmail)
        mongoose.disconnect()
    }
).catch(e => console.log(e))
console.timeEnd(2)