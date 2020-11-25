import { User } from '../model/user'

const userResolver = {
    Query: {
        me: async(root, args, context) => {
            const id = context.currentUser
            if(!id) {
                throw new Error('没有授权')
            }
            return await User.findById(id)
        },
        serverTime: () => new Date()
    },

}
export default userResolver