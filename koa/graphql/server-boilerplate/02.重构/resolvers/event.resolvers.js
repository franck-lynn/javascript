 
import { ObjectId } from 'mongodb'

// 数据库的 schema
import { User } from '../model/User'
import { Event } from '../model/Event'

// 自定义标量
import { DecimalType } from '../scalar/DecimalType'
import { DateType } from '../scalar/DateType'

const eventResolver = {
    DecimalType,
    DateType: DateType,
    Query: {
        // 解析器函数或者分开定义指令解析器, 查询解析器resolvers也可以分开定义
        events: async () => {
            try {
                const events = await Event.find()
                return events.map(e => ({ ...e._doc, _id: e.id }))
            } catch (error) {
                console.log(error)
            }
        }
    },
    Mutation: {
        createEvent: async (_, args) => {
            console.log('打印出时间" ', args.eventInput.date)
            const event = new Event({
                // _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                // 日期字符串通过 Date 自定义标量解析成日期格式, 给数据库使用
                // 数据库取出日期格式时, 转化成日期字符串给客户端使用
                date: args.eventInput.date,
                creator: args.eventInput.creator // 事件的创建者
            })
            let result
            try {
                result = await event.save()
            } catch (error) {
                console.log("1---> ", error)
            }
            // 重新组装 event
            let createdEvent = { ...result._doc, _id: result._doc._id.toString() }
            // 根据 userId 朝朝 user, 如果没找到, 抛出错误, 找到了, 在 user 里增加 event
            let user
            try {
                user = await User.findById(ObjectId(args.eventInput.creator))
            } catch (error) {
                console.log("2---> ", error)
            }
            if (!user) {
                throw new Error('用户没找到')
            }
            // console.log("user是: ----> ", user)
            // 将 event 加入 user 的 createEvent 字段
            user.createEvents.push(event)
            try {
                await user.save()
            } catch (error) {
                console.log("3---> ", error)
            }
            return createdEvent
        },
        
    }
}
// 需要默认导出, 不能 export {}
export default eventResolver 