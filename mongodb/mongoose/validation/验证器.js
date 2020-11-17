import mongoose, { Schema, model } from "mongoose";

//url 带上复制集, 一般放在配置文件 config.js 中
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log("数据库连接成功"))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))
// MongoDB弃用警告
// https://blog.csdn.net/qq_42760049/article/details/98593923
mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);

const userSchema = new Schema({
    phone: { 
        type: String, 
        validate: {
            validator: (v) =>  /\d{3}-\d{3}-\d{4}/.test(v),
            message: '{VALUE} is not a valid phone number!', 
            required: [true, 'User phone number required']
        }
    }
})
var User = model('user', userSchema);
var user = new User()
user.phone = '555.0123';

user.save()





