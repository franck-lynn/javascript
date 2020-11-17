import { model, Schema } from 'mongoose'


const orderSchema = new Schema({
    // 这里的 id 类型不是 mongodb 里的 ObjectId 类型? types 是大写
    // id: { type: Schema.types.ObjectId, required: true },
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, require: true },
    catalog_number: { type: String, require: true },
    amount: { type: Number, require: true },
})
const Order = model('Order', orderSchema)


export { Order }