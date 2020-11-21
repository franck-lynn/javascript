import { model, Schema } from 'mongoose';

const bookingSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const Booking = model('Booking', bookingSchema)

export { Booking }