//! 顶层使用 await
//! 服务器端异步加载 .gql 文件, 
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
const schema = await loadSchema('./schema.gql', {
    loaders: [new GraphQLFileLoader()]
})
// console.log("schema: ", schema)
//! 运行的命令是 : nodemon schema委托示例.js --experimental_top_level_await
//! 需要在 package.json 里运行, 并且 package.json 里面设置: "type": "module",
console.log(schema)