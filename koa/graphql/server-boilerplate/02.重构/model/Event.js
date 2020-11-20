import { Decimal128 } from 'mongodb';
import { model, Schema } from 'mongoose';


const eventSchema = new Schema({
    title: { type: String },
    description: { type: String },
    price: { type: Decimal128 },
    date: { type: Date, default: Date.now },
    creator: { type: Schema.Types.ObjectId, ref: 'User' }
})
const Event = model('event', eventSchema)


export { Event }