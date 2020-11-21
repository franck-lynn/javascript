import { Event } from '../model/event';
import { User } from '../model/user'

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => transformEvent(event))
    } catch (err) {
        console.log(err)
    }
}
const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event)
    } catch (err) {
        console.log(err)
    }
};
const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: userId,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (e) {
        console.log(e)
    }
}

const dateToString = date => new Date(date).toISOString()

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

export { /* events, singleEvent, user */ transformBooking, transformEvent }