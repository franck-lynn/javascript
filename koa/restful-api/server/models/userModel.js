import { model, Schema } from 'mongoose'

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    mobile: { type: Number, required: true },
    isAdmin: { type: Boolean, default: true },

})

const User = model('User', userSchema)

export {  User }