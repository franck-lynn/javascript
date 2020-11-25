import path from 'path'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'

//! 这个 index.js 文件可以将本目录下的所有类型定义的 xx.gql 文件合并在一起, 支持递归调用
const typeArray = loadFilesSync(path.join(__dirname, './'), { extensions: ['gql'], recursive: true })
const typeDefs = mergeTypeDefs(typeArray)

export { typeDefs }


// 一般类型定义文件如下 xx.gql : 
// type 第1个字母大写的类型名称{ 
//      _id: ID!
//      name: String!
// }