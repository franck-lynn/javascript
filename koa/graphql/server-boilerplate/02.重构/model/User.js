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

export {User}