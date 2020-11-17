// 一对多的关系, 例如 一个文章分类下面有很多文章. trunk branch
// 一般地, 分支 branch 里有主干的 id, 也有自己的 id, 主干有自己的id, 通过主干 id 可以查到 有哪些分支
// 也可以 根据 分支的 id 查询属于哪个主干
import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'

import { GraphQLSchema, GraphQLObjectType, GraphQLID } from 'graphql'
import graphqlHTTP from 'koa-graphql'

// 准备的数据
const trunks = [
    { _id: 'A', name: '镗刀', description: '这个属于镗刀这一类的商品' },
    { _id: 'B', name: '钻头', description: '这个属于钻头类' },
]
const branches = [
    { _id: '1', trunk_id: 'A', name: 'EWN32-47CKB3', remark: 'BIG的镗刀' },
    { _id: '2', trunk_id: 'A', name: 'BT50-CKB3-95', remark: 'BIG的刀柄, 也属于镗刀类' },
    { _id: '3', trunk_id: 'A', name: 'EWN150', remark: '大径镗头' },
    { _id: '4', trunk_id: 'B', name: 'SMDH220L', remark: '住友钻头' },
    { _id: '5', trunk_id: 'B', name: 'SMDT2700MEL ACX70', remark: '皇冠钻' },
]

// https://segmentfault.com/a/1190000023017476
// https://segmentfault.com/a/1190000012720317
// https://segmentfault.com/a/1190000023017476
// https://www.cnblogs.com/wisewrong/p/13306994.html  🔶
// 用 buildSchema 定义只能是一整个字符串, 不是很方法, 推荐 使用 构建类型
/*
const schema = buildSchema(`
    type Trunk {
        # 主干在数据库中的字段
        _id: ID!
        name: String!
        description: String!
        # 根据主干 id 查分支的方法定义, 这是一个方法, 不需要传入参数
        # 但是在 resolver 的查询里面要定义这个方法
        branches: [Branch]
    }
    type Branch {
        _id: ID!
        trunk_id: ID!
        name: String!
        remark: String
    }
    # 定义查询 
    type Query {
        searchTrunk(_id: ID!): [Trunk] 
        branches: [Branch]
    }
`)
*/
const BranchType = new GraphQLObjectType({
    name: 'Branch',
    fields: () => ({
        _id: { type: GraphQLID },
        trunk_id: { type: GraphQLID },
        name: { type: GraphQLString },
        remark: { type: GraphQLString }
    })
})
const TrunkType = new GraphQLObjectType({
    name: "Trunk",
    fields: () => ({
        // 返回的字段
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        // 聚合查询的字段
        branches: {
            type: new GraphQLList(BranchType),
            resolve: async (parent) => {
                // 根据 主干的 id 过滤出 挂在主干上的分支
                // 在分支上查找
                return branches.filter(branch => branch.trunk_id === parent._id)
            }
        }
    })
})
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        searchTrunk: {
            type: new GraphQLList(TrunkType), // 这个返回的时一个列表的数据
            args: { _id: { type: GraphQLID } },
            resolve: async (parent, args) => {
                // console.log(args._id)
                // 查询主干
                // console.log(trunks.filter(trunk => trunk._id === args._id))
                return trunks.filter(trunk => trunk._id === args._id)
            }
        }
    }
})
const schema = new GraphQLSchema({
    query: RootQuery,
})

/*
   // 这个可以去掉了
    const root = {
        Query: {
            searchTrunk: (args) => {
                return trunks.filter(trunk => trunk._id === args._id)
            },
        }
    }
*/
// 连接 mongodb 数据库
import mongoose from 'mongoose'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const app = new Koa()

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// body parser
app.use(bodyParser());


import Router from 'koa-router'
import { GraphQLString } from 'graphql'
import { GraphQLList } from 'graphql'
const router = new Router()
router.all('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true // 是否需要调试
}))
const routes = app => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}


// 批量注册路由
routes(app)

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000/graphql")
})