import { model, Schema } from 'mongoose'

const userSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, required: true}, 
    name: { type: String, required: true },
    email: { type: String },
    mobile: { type: Number, required: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: true }
    
})

const User = model('User', userSchema)

export {  User }