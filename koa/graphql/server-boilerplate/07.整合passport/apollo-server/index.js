import { ApolloServer } from 'apollo-server-koa'
// import { tradeTokenForUser } from '../passport/auth-helps'

import { typeDefs } from '../graphql'
import { resolvers } from '../resolvers'
import { checkedToken } from '../passport/passport-initialize'

// const HEADER_NAME = 'authorization'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ ctx }) => {
        // 当客户端访问 graphql 接口时, 带来了 auth 请求头
        // let authToken = null
        // let currentUser = null
        // authToken = ctx.headers[HEADER_NAME]
        // try {
        //     if (authToken) {
        //         // 拿到用户 的id 和角色 放在 ctx 上下文
        //         currentUser = await tradeTokenForUser(authToken)
        //     }
        // } catch {
        //     console.warn(`不能认证的口令: ${authToken}`);
        // }
        // return { authToken, currentUser }
        await checkedToken(ctx)
        // // const currentUser = await checkedToken(ctx)
        // const currentUser = ctx.state.user
        // console.log("011当前用户", ctx.state.user)
        const currentUser = ctx.currentUser
        // console.log("currentUser = ", currentUser)
        return { currentUser }
    }
})

export { server }