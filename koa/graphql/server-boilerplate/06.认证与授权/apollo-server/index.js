import { ApolloServer } from 'apollo-server-koa'
import { tradeTokenForUser } from '../auth/authentication/auth-helps'

import { typeDefs } from '../graphql'
import { resolvers } from '../resolvers'

const HEADER_NAME = 'authorization'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ ctx }) => {
        // 当客户端访问 graphql 接口时, 带来了 auth 请求头
        let authToken = null
        let currentUser = null
        authToken = ctx.headers[HEADER_NAME]
        try {
            if (authToken) {
                currentUser = await tradeTokenForUser(authToken)
            }
        } catch {
            console.warn(`不能认证的口令: ${authToken}`);
        }
        return { authToken, currentUser }
    }
})

export { server }