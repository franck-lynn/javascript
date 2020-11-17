// const books = [{
//         title: 'Harry Potter and the Chamber of Secrets',
//         author: 'J.K. Rowling',
//     },
//     {
//         title: 'Jurassic Park',
//         author: 'Michael Crichton',
//     },
// ];
// const resolvers = {
//     Query: {
//         books: () => {
//             // console.log("参数执行", books)
//             return books
//         }
//     }
// }

// https://www.graphql-tools.com/docs/merge-resolvers
//! 第2种方法
// import {mergeResolvers} from '@graphql-tools/merge';
// import { bookQuery } from './bookQuery';
// const resolversArray = [bookQuery]
// const resolvers = mergeResolvers(resolversArray)
//! 第3种方法
import path from 'path'
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files'

const resolversArray = loadFilesSync(path.join(__dirname, "./**/*.resolvers.*"));

const resolvers = mergeResolvers(resolversArray);

export { resolvers }