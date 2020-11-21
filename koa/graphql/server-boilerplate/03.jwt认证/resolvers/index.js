import path from 'path'
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files'

//! 这个 index.js 文件可以将本目录下的所有类型定义的 xx.resolvers.js 文件合并在一起, 支持递归调用
//! 这里的文件命名方式用: xx.resolvers.js  形式
const resolversArray = loadFilesSync(path.join(__dirname, './**/*.resolvers.*'))

const resolvers = mergeResolvers(resolversArray)


export { resolvers }


// 一般resolver 解析器函数如: 
// import {  } from '../model/???'

// const 解析器名称Query = {
//     Query: {
//         函数名: async () => {
//             const ?? = await 数据库操作
//             return ??
//          }
//      }
//  }
// export default 解析器名称Query