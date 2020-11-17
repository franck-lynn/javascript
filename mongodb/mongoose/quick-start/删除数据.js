import mongoose, { Schema, model } from "mongoose"
// 要用 mongodb 里的 Decimal128 来定义数字类型
import { Decimal128 } from "mongodb";
//url 带上复制集, 一般放在配置文件 config.js 中
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log("数据库连接成功"))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

// 创建 schema
const commoditySchema = new Schema({
    cexch_code: { type: String, default: 'cny' },
    isStandard: { type: Boolean, default: true },
    description: { type: String, required: true },
    catalog_number: { type: String, required: true },
    // price: {type: mongoose.Types.Decimal128, required: true},
    // decimal128 的运算
    // https://www.jianshu.com/p/37829c87faa9 
    price: { type: Decimal128, required: true },
    manufacturer: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

// 创建 model
const Commodity = model('Commodity', commoditySchema)

Commodity.deleteOne({ cexch_code: 'cny' }).then((data) => {
    console.log('删除成功', data)
    mongoose.disconnect()
})
