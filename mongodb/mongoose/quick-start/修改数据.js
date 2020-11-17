/*
Model.findOneAndUpdate()
Model.replaceOne()
Model.updateMany()
Model.updateOne()

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
// Model.findOneAndUpdate()
// Model.replaceOne()
// Model.updateMany()
// Model.updateOne()
User.findByIdAndUpdate('5ead0877aa15d01cccaf2473', {name: '周芷若', email: 'zzr@163.com'}, (err, data) => {
    if(err) console.log(err)
    else{
        console.log("原来的数据: ", data)
    }
    mongoose.disconnect()
})
// 修改多个
User.updateMany({is_admin: true}, {is_admin: false}, (err, data) => {
    if (err) console.log(err)
    else {
        console.log("修改了多少条数据: ", data.n)
    }
    mongoose.disconnect()
})
// 每次只修改一条数据
User.updateOne({ is_admin: false }, { is_admin: true }).then(data => console.log('只修改一条数据', data)).catch(e => console.log(e))

User.replaceOne({name: 'Alice'}, {name: '鸡排妹'}, (err, data) => {
    if (err) console.log(err)
    else {
        console.log("原来的数据: ", data)
    }
    mongoose.disconnect()
})


