import { Decimal128 } from 'mongodb';
import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
})

const User = model('user', userSchema)

const eventSchema = new Schema({
    title: { type: String },
    description: { type: String },
    price: { type: Decimal128 },
    date: { type: Date, default: Date.now },
    creator: { type: Schema.Types.ObjectId, ref: 'User' }
})
const Event = model('event', eventSchema)


export { User, Event}