// 仿知乎 restfil api
// https://github.com/Hikari1149/Zhihu-RESTfulAPI/tree/master/app

import mongoose,  { Schema, model } from "mongoose";
//url 带上复制集, 一般放在配置文件 config.js 中
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, {useUnifiedTopology: true},  () => console.log("数据库连接成功"))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const userSchema = new Schema({
    name: {type: String, required: true },
    email: {type: String},
    mobile: {type: Number},
    is_admin: {type: Boolean}
})

// 给schema 加了方法, 就相当于在原型上加了方法
// 方法的定义一定要放在 类 或者说类似构造函数的之前定义, 
userSchema.methods.sing = function() {
    console.log(this.name + " 唱的 '风含情, 水含笑'")
}
// 还可以定义静态方法
userSchema.statics.findByName = function (name, cb){
    return this.find({name: new RegExp(name, 'i')}, cb)
}

const User = model('User', userSchema)

console.log(userSchema.path('_id'))

// const yyy = new User({
//     name: "杨钰莹",
//     email: "yyy@163.com",
//     mobile: 13912345678,
//     is_admin: true
// })

// yyy.sing()

// yyy.save((err, yyy) => {
//     if (err) return console.log(err) 
//     try {
//         console.log(yyy)
//         // yyy.sing()
//     } catch (e) {
//         console.log(e)
//     }finally{
//         mongoose.disconnect()
//     }
// })


// User.find().then(v => {
//     console.log(v)
//     mongoose.disconnect()
// })

// User.findOne({name: "杨钰莹"}).then(
//     user => {
//         try {
//             user.sing()
//            console.log(user)
//         } catch (e) {
//             console.log(e)
//         }finally{
//             mongoose.disconnect()
//         }
        
//         mongoose.disconnect()
//     }
// ).catch(e => console.log(e))


User.findByName("杨钰莹", (err, data) => {
    console.log(data)
    mongoose.disconnect()
})

// User.findOneAndUpdate({name: 'Maryian'}, {name: 'mary'}).then(v => console.log(v))





