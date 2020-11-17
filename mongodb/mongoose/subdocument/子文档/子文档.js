import mongoose, { Schema, model } from "mongoose";

//url 带上复制集, 一般放在配置文件 config.js 中
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log("数据库连接成功"))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const hobbySchema = new Schema({
    hobby: { type: [String], required: true },
    relation: { type: [Object] }
})

const userSchema = new Schema({
    child: hobbySchema,
    children: [hobbySchema],
    name: { type: String, required: true },
    email: { type: String, },
    mobile: { type: Number, required: true },
    is_admin: { type: Boolean, required: false },
})
const User = model('User', userSchema)
const user01 = new User({
    child:{ hobby: ['唱歌', '跳舞']},
    name: '鸡排妹',
    email: '深夜保健室@',
    mobile: 12912345678,
    is_admin: true
})
console.log(user01)
const user02 = new User({
    child: { hobby: ['唱歌', '江湖'] },
    children: [{hobby: ['唱歌', '跳舞'], relation: {husband: '令狐冲', father: '任天行'}}, {hobby: '武术'}], 
    name: '任盈盈',
    email: 'ryy@163.com',
    mobile: 12912345678,
    is_admin: true
})
// 保存了子文档
user02.save((err, data) => {
    if(err) console.log(err)
    else{
        console.log(data)
    }
    mongoose.disconnect()
})

