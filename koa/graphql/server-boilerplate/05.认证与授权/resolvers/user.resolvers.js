import { User } from '../model/user'

const userResolver = {
    Query: {
        me: async(root, args, context) => {
            // console.log("03. 走完认证流程后到这里...", context)
            // const { id } = context.body
            // if(!id) {
            //     throw new Error('没有授权')
            // }
            // const id = "5fbcd0964d888212bc1c4ce9"
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