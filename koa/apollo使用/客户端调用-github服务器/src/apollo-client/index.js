// import ApolloClient, {} from 'apollo-client'
// import { createHttpLink } from 'apollo-link-http'
// import { InMemoryCache } from 'apollo-cache-inmemory'

// // 与 API 的 HTTP 连接
// // https://www.npmjs.com/package/apollo-link-http
// const httpLink = createHttpLink({
//     // 你需要在这里使用绝对路径
//     // uri: 'http://localhost:3000/graphql',
//     uri: 'https://api.github.com/graphql',
//     headers: {
//         authorization: 'Bearer xxx'
//     }
// })
// // 缓存实现
// const cache = new InMemoryCache()
// // 创建 apollo 客户端
// const apolloClient = new ApolloClient({
//     link: httpLink,
//     cache
// })

// ! https://github.com/IamManchanda/vue3-apollo-client/blob/main/package.json
// 使用 @apollo/client 要安装 react, 很奇怪的想法
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
// 获取环境变量中定义的 令牌, 密码等重要信息
// 改在 webpack 里面获取
// import dotenv from 'dotenv'
// const result = dotenv.config()
// console.log("获取的环境变量---> ", result)

const httpLink = createHttpLink({
    // 你需要在这里使用绝对路径
    // uri: 'http://localhost:3000/graphql',
    uri: 'https://api.github.com/graphql',
    // uri: 'https://developer.github.com/v4/explorer',
    headers: {
        authorization: process.env.TOKEN
    }
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
    link: httpLink,
    cache
})

export { apolloClient }