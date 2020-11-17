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
// https://www.v2ex.com/amp/t/498008
// 中间件, 调用 save, create 时会触发这个 pre 钩子
// commoditySchema.pre('save', function (next) {
//     if(this.isNew){
//         this.created_at = this.created_at = Date.now()
//     }else {
//         console.log('notnew')
//         this.created_at = Date.now()
//     }
//     console.log('save')
//     next()
// })
// commoditySchema.pre('findOneAndUpdate', function (next){
//     this.updated_at = Date.now()
//     console.log('findOneAndUpdate')
//     next()
// })

// 创建 model
const Commodity = model('Commodity', commoditySchema)
// https://itbilu.com/nodejs/npm/rk-kJ0P0m.html

// 常用操作,  https://www.jianshu.com/p/ad141d15947c
// 1, 测试数据
const commodityEntity01 = new Commodity({
    description: '刀片',
    catalog_number: 'SPGT110408DG CT4320',
    // https://mongodb.github.io/node-mongodb-native/3.6/api/Decimal128.html
    // Decimal128 的 2个方法: toString 和 fromString, 一个构造函数
    price: Decimal128.fromString('29.8'),
    manufacturer: 'Chaoer'
})
// 2, 添加数据1
commodityEntity01.save((err, data) => {
    if (err) console.log('插入数据失败', err)
    else {
        console.log('插入数据成功', data)
    }
    mongoose.disconnect()
})

// Entity是model的对象,用它来添加数据的时候会把隐藏属性一起存入数据库,有几率报错
// const commodityEntity02 = new Commodity({
//     description: '刀盘',
//     catalog_number: 'WEZ1705-63',
//     // https://mongodb.github.io/node-mongodb-native/3.6/api/Decimal128.html
//     // Decimal128 的 2个方法: toString 和 fromString, 一个构造函数
//     price: Decimal128.fromString('765'),
//     manufacturer: 'Yulong'
// })

// model只能添加纯净的json对象, 不能添加它创建的实体
// Commodity.create(commodityEntity02, (err, data) => {
//     if (err) console.log('插入数据失败', err)
//     else {
//         console.log('插入数据成功', data)
//         mongoose.disconnect()
//     }
// })
// 修改操作, update 已经 过时了, 使用 updateOne, updateMany, or bulkWrite 代替
// Commodity.updateOne({ catalog_number: 'SPGT110408-DG  CT5420' }, { $set: { catalog_number: 'SPGT110408-PM  CT5420', price: Decimal128.fromString('34.5') } },
//     (err, data) => {
//         if (err) console.log("更新失败", err)
//         else {
//             console.log("更新成功", data)
//             mongoose.disconnect()
//         }
//     })

// 查询一条数据
// Commodity.findOne({ catalog_number: 'SPGT110408-PM  CT5420' }).then(commodity => {
//     console.log(commodity)
//     mongoose.disconnect()
// }).catch(e => console.log(e))

// 查询全部
// Commodity.find().then(commodities => {
//     console.log(commodities)
//     mongoose.disconnect()
// }).catch(e => console.log(e))/* .finally(console.log("这个会先执行?所以关闭不了")) */


// Commodity.find({ catalog_number: 'SPGT110408-PM  CT5420' }).then(commodities => console.log(commodities))

// 链式查询
// Commodity.where('catalog_number')
//     .equals('WEZ1705-63').then(commodities => {
//         console.log("查询到的产品: ", commodities)
//         mongoose.disconnect()
//     }).catch(e => console.log(e))
// 删除操作, remove 已经过时, 改用 deleteOne, deleteMany
// Commodity.deleteOne({ _id: '5eece1dc79b16621e4375a0d' }).then((err, data) => {
//     if(err) console.log("删除失败", err)
//     else{
//         console.log('删除成功', data)
//         mongoose.disconnect()
//     }
// })

// Commodity.deleteMany({ cexch_code: 'cny' }).then((err, data) => {
//     if (err) console.log("删除失败", err)
//     else {
//         console.log('删除成功', data)
//     }
//     mongoose.disconnect()
// })