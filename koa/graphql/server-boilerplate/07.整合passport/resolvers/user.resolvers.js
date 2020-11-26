import { composeResolvers } from '@graphql-tools/resolvers-composition'
import { isAuthenticated } from '../passport/authenticated-guard'
import { hasRole } from '../passport/has-role'

const userResolver = {
    Query: {
        // me: authenticated((root, args, context) => ({ _id: context.currentUser.id })),
        // 组合方式, 这里是单纯的查询逻辑
        me: (root, args, context) => ({_id: context.currentUser.id}),
        serverTime: () => new Date()
    },

    Mutation: {
        // publishArticle: authenticated(
        //     // authenticated() 函数的参数是下一个函数 next
        //     // valiedateRole() 函数参数是 role, 返回一个函数, 这个返回
        //     // 函数参数是 next
        //     validateRole('EDITOR')((root, { title, content }, context) => {
        //         // createNewArticle(title, content, context.currentUser)
        //         return {
        //             _id: "100",
        //             title, content,
        //             author: context.currentUser
        //         }
        //     })
        // )
        // 采用组合的方式, 这里就是单纯的查询逻辑
        publishArticle: (root, { title, content }, context) => {
            return {
                _id: "100",
                title, content,
                author: context.currentUser
            }
        }
    }
}
// 这里改在 authenticated-guard.js 文件的导出
// const isAuthenticated = () => next => async (root, args, context, info) => {
//     if (!context.currentUser) {
//         throw new Error('You are not authenticated!');
//     }
//     return next(root, args, context, info);
// }

// 组合认证和授权
const resolversComposition = {
    "Query.me": [isAuthenticated()],
    'Mutation.publishArticle': [isAuthenticated(), hasRole('EDITOR')]
}
// 组合解析器, 变量名是过去式
const composedResolvers = composeResolvers(userResolver, resolversComposition)

// export default userResolver
export default composedResolvers