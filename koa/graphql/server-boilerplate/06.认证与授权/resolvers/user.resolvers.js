import { authenticated } from '../auth/authentication/authenticated-guard'
import { validateRole } from '../auth/authorization/validate-role'
const userResolver = {
    Query: {
        // me: async(root, args, context) => {
        //     const id = context.currentUser
        //     if(!id) {
        //         throw new Error('没有授权')
        //     }
        //     return await User.findById(id)
        // },
        me: authenticated((root, args, context) => ({_id: context.currentUser.id})),
        serverTime: () => new Date()
    },

    Mutation: {
        publishArticle: authenticated(
            // authenticated() 函数的参数是下一个函数 next
            // valiedateRole() 函数参数是 role, 返回一个函数, 这个返回
            // 函数参数是 next
            validateRole('EDITOR')((root, { title, content }, context) => {
                // createNewArticle(title, content, context.currentUser)
                return {
                    _id: "100",
                    title, content,
                    author: context.currentUser
                }
            })
        )
    }
}
export default userResolver