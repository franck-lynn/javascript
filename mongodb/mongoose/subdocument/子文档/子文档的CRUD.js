// https://blog.csdn.net/chaoyangsun/article/details/79829368
// https://blog.csdn.net/weixin_30788619/article/details/97343416

// 查询子文档
import mongoose, { Schema, model } from "mongoose";

//url 带上复制集, 一般放在配置文件 config.js 中
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log("数据库连接成功"))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const hobbySchema = new Schema({
    hobby: { type: [String], required: true },
    relation: {type: [Object]}
})

const userSchema = new Schema({
    child: hobbySchema,
    children: [], 
    name: { type: String, required: true },
    email: { type: String, },
    mobile: { type: Number, required: true },
    is_admin: { type: Boolean, required: false },
})
const User = model('User', userSchema)

// 更新子文档
// 步骤:
// 1. 查找文档
;(async () => {
    // 查找一个名称为 任盈盈 的文档
    const ryy = await User.findOne({name: '任盈盈'})
    // 拿到 children 的字段
    const children = ryy.children
    // 这是一个常规的 javascript 的数组
    // console.log(Array.isArray(children))
    // [{"hobby":["唱歌","跳舞"],"relation":[{"husband":"令狐冲","father":"任天行"}],"_id":"5eef141bf3ddf82fa422019c"},
    //  {"hobby":["武术"],"relation":[],"_id":"5eef141bf3ddf82fa422019d"}]
    console.log(children)
    // 从数组里面删除 一项
    ryy.children = null
    // 保存 父文档
    const updated = await ryy.save()
    console.log(updated)
    mongoose.disconnect()
})()



