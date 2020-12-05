import path from 'path'
import Koa from 'koa'
import { Base64 } from 'js-base64'
import { ApolloServer } from 'apollo-server-koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'
// import Router from 'koa-router'
import { /* defaultFieldResolver, */ GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { /*  SchemaDirectiveVisitor ,*/ gql } from 'apollo-server'

// 连接 mongodb 数据库
import mongoose from 'mongoose'
// 代表有很多的数据
import datum from '../github-response-data.json'

const app = new Koa()
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const typeDefs = gql `
    # 定义一个游标的标量类型
    scalar Cursor 
    
    type Post {
        # 这些是帖子的数据字段, 是一个列表数据
        name: String!
        kind: String!
        description: String
        fields: [Field] # fields 是帖子字段下的子字段, 也是一个列表数据
    }
    # 子数据 schema
    type Field {
        name: String
    }
    # 下面定义的是一些分页查询所需要的信息
    type PageInfo {
        hasNextPage: Boolean! # 是不是有下一页
        hasPreviousPage: Boolean! # 是不是有上一页
        startCursor: Cursor # 开始游标, 是自定义标量 Cursor 类型
        endCursor: Cursor # 结束游标, , 是自定义标量 Cursor 类型
    }
    type PostEdge {
        cursor: Cursor!
        node: Post!
    }
    type PostConnection {
        # 把上面的 2 个类型集中在一起.
        edges: [PostEdge]!
        pageInfo: PageInfo! 
        count: Int # 在加上 总数量 这个字段
    }
    type PostsResult {
        posts: [Post]
        totalCount: Int
    }
    type Query {
        # 按数量进行查询
        allPosts(first: Int, offset: Int): PostsResult
        # 进行分页查询, 
        postsPagination(
            first: Int# 返回条目的数量, 最小值是1, 如果没有指定, 就返回全部数据
            # 只是要先返回哪个, 从指定后的 first 个条目都返回, 
            # 如果没指定, 就从第1个开始返回
            after: String 
            # PostConnection 返回一个 edges, postEdge 由一个节点和游标组成, 
            # 游标本质上是一个只与分页相关的条目标识符
            # PostConnection 返回一个 pageInfo, pageInfo 中 endCursor 是结果中最后一个条目的游标
            # pageInfo 还包括 hasNextPage 等指示是否还有另外的一页数据可用.
            # pageInfo 还包括 count 总数.
        ): PostConnection
        #过滤
        feed(filter: String): [Post!] !
    }
    
    # 定义新的指令 directive, 定义语句如下:
    # directive @upper on FIELD_DEFINITION 
    # 定义查询 schema, schema 不能为空
`
// 定义的标量
const CursorType = new GraphQLScalarType({
    name: 'CursorType',
    description: '自定义的游标类型',
    // 序列化
    serialize: value => {
        return Base64.encode(value)
    },
    // 校验与解析 variables 的参数
    parseValue: value => {
        return Base64.decode(value)
    },
    // 校验与解析 query 的参数
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return Base64.decode(ast.value)
        } else {
            return null;
        }
    },
})

// https://codeburst.io/graphql-pagination-by-example-part-2-2803802ef23a
const resolvers = {
    Cursor: CursorType, // 定义的标量在 resolvers 里使用
    Query: {
        allPosts: async (root, { first, offset = 0 }) => {
            const totalCount = datum.data.length
            console.log("前端传过来的数据:", first, offset)
            const posts = first === undefined ? datum.data.slice(0, offset) : datum.data.slice(offset, offset + first)
            const result = { posts, totalCount }
            return result
        },
        postsPagination: async (root, { first = 1, after }) => {
            console.log("输入的参数: ", first, after)
            // first 要返回多少条数据. after: 从哪里开始, 没有指定就从第1条数据开始
            if (first < 0) {
                throw new Error("first 参数必须是正数")
            }
            const totalCount = datum.data.length // 总的数据条目
            // 条目数默认从第1条数据开始, 根据 传入参数 after (数据库中的条目名称字段的名称)
            // 找到后计算出是第几条数据, 就从这一条开始数, 加上 first 条记录
            let start = 0
            if (after !== undefined) {
                const index = datum.data.findIndex(val => val.name === after)
                if (index === -1) {
                    throw new Error("after 参数不存在")
                }
                start = index + 1
            }
            // 如果 first 不指定, 就返回全部数据, 否则, 就以 start 开始(指定name的位置的地方) + first 条记录
            // 这里构造的是 edge 字段要的 pageEdge 数组
            // 这个数组 里面由 Post 和 cursor 组成. cursor 成为其中的一个属性, node 属性是 Post
            let posts = first === undefined ? datum.data : datum.data.slice(start, start + first)

            let endCursor = undefined
            // 构造 edges
            const edges = posts.map(post => {
                endCursor = post.name
                return { cursor: endCursor, node: post }
            })
            // 构造 pageInfo
            const hasNextPage = start + first < totalCount
            const hasPreviousPage = start - first > 1
            const pageInfo = { endCursor, hasNextPage, hasPreviousPage, startCursor: after }
            const result = { edges, pageInfo, count: totalCount }
            return result
        }
    }
}


// 定义 directive
// class 自定义指令名称 extends SchemaDirectiveVisitor {
//     // ! 2-1. 复写字段
//     visitFieldDefinition(field) {
//         const { resolve = defaultFieldResolver } = field;
//         // ! 2-2. 更改 field 的 resolve function
//         field.resolve = async function(...args) {
//             // ! 2-3. 取得原先的 field resolver 的计算结果, 因为 field resolver 
//             // ! 传回来的有可能是 promise 故使用 await
//             const result = await resolve.apply(this, args)
//             // ! 2-4. 将取得的结果再做预取的计算
//             if (typeof result === 'string') {
//                 // 要做的事情
//             }
//             //! 2-5. 回传给前端最终值
//             return result
//         }
//     }
// }

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // schemaDirectives: {
    //    typeDefs @后的指令名称: 自定义指令名称
    // }
})
server.applyMiddleware({ app })

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// body parser  要在路由注册之前调用
app.use(bodyParser());


// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000${server.graphqlPath}`)
})