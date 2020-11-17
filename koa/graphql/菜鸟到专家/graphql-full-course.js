// https://www.bilibili.com/video/BV16J41117y4?from=search&seid=11924879180365735748

import Koa from 'koa'
import graphqlhttp from 'koa-graphql'
import {schema} from './schema/schema'
import Router from 'koa-router'
import bodyParser from 'koa-body'

const app = new Koa()
const router = new Router()

router.all('/graphql', graphqlhttp({
    schema,
    // 是否需要调试
    graphiql: true
}))


// body parser, post提交, 需要解析请求体
app.use(bodyParser());
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000/graphql")
})















