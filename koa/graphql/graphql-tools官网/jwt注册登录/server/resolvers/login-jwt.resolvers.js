import jwt from 'jsonwebtoken'
// graphql-tools 官网
// https://www.graphql-tools.com/docs/generate-schema
// apollo server 官网上的示例
// https://www.apollographql.com/docs/apollo-server/data/resolvers/
// 使用Apollo GraphQL服务器进行身份验证的JWT令牌
// https://www.teaspect.com/detail/5164
// jwt跨域身份验证_如何使用GraphQL Cookies和JWT进行身份验证
// https://blog.csdn.net/cuk0051/article/details/108340009
// https://flaviocopes.com/graphql-auth-apollo-jwt-cookies/    英文版
// 创建一些虚拟数据, 一个用户
const users = [
    { id: '5fa2799c0b4d230cdcbedd24', name: '周芷若', email: 'zhouzhiruo@163.com', password: "$2b$10$B.ja8hEo0XCc7p/g6rkgEuAZgJRHBEW3MsxuqybHdxG.O62GHmFxq" }, // = 123}
]
// 一些待办事项
const todos = [
    { id: '1', userId: '5fa2799c0b4d230cdcbedd24', title: '与张无忌交谈' },
    { id: '2', userId: '5fa2799c0b4d230cdcbedd24', title: '回峨眉山接任掌门' },
    { id: '3', userId: '5fa2dsff4344230cdcbedd99', title: '小昭与张无忌在光明顶找化功大法' },
]
const SECRET_KEY = 'secretkey'

const loginJwtResolvers = {
    Query: {
        todos: (root, args, context) => {
            // console.log("上下文中根据 token 解密后的 id =", context.authScope)
            // const contextId = context.authScope
            // return todos.filter(todo => todo.userId === contextId)
            // 客户端通过 app.js 里的 context 对象 传过来的 koa ctx 上下文
            const raw = context.header.authorization.split(' ').pop() || ''
            try {
                const { id } = jwt.verify(raw, SECRET_KEY)
                return todos.filter(todo => todo.userId === id)
            } catch {
                throw new Error('授权token不可用, 请重新登录')
            }
        },
        users: () => users
    },
    Mutation: {
        addUser: (root, args,/*  context, info */) => {
            // console.log(context)
            const { id, name, email, password } = args
            // 通过 id 在数据库中查找 user
            const user = users.find(user => user.id === id)
            if (user) {
                throw new Error('用户名已存在, 请重新选择用户名注册!')
            } else {
                users.push({ id, name, email, password })
                // 把这些数据加入数据库
                return { id, name, email, password }
            }
        }
    }
}

export default loginJwtResolvers