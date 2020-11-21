import { Booking } from '../model/booking'
import { Event } from '../model/event'
import { transformBooking, transformEvent } from './helpers'
// https://github.com/academind/yt-graphql-react-event-booking-api/blob/07-bookings/graphql/resolvers/index.js
const bookingResolver = {
    Query: {
        bookings: async (root, args, context) => {
            // console.log("booking.resolver.js 文件里获取到了 token", context.headers.authorization)
            console.log("04, 查询程序运行", context.state)
            // if (!context.state.isAuth){
            //     throw new Error('没有授权认证')
            // }
            try {
                const bookings = await Booking.find()
                return bookings.map(booking => transformBooking(booking))
            } catch (error) {
                console.log(error)
            }
        }
    },
    Mutation: {
        bookEvent: async (_, args) => {
            // 多对多, user 有多个事件, bookEvent 是将 对应事件 与 user 关联起来
            // 一个事件也有多人参与.
            // 根据 客户端输入的 event id 查找 event
            const fetchedEvent = await Event.findOne({ _id: args.eventId })
            // 生成 booking 对象
            const booking = new Booking({
                user: '5fb86162739ebc1eb470612e',
                event: fetchedEvent
            })
            // 保存 booking
            const result = await booking.save()
            return transformBooking(result)
        },
        cancelBooking: async args => {
            try {
                const booking = await Booking.findById(args.bookingId).populate('event');
                const event = transformEvent(booking.event)
                await Booking.deleteOne({ _id: args.bookingId });
                return event;
            } catch (err) {
                console.log(err)
            }
        }
    }
}
export default bookingResolver