import { ApolloServer } from 'apollo-server-koa'
import { auth } from '../auth/auth'

import { typeDefs } from '../graphql'
import { resolvers } from '../resolvers'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ ctx }) => {
        // 当客户端访问 graphql 接口时, 带来了 auth 请求头
        let authToken = null
        let currentUser = null
        authToken = ctx.headers.authorization
        // console.log(authToken)
        currentUser = await auth(ctx)
        return { authToken, currentUser }
    }
})

export { server }