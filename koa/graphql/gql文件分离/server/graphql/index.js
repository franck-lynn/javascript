// import { gql } from "apollo-server"
// // Define your GraphQL schema
// const typeDefs = gql `
//     type Book {
//         title: String,
//         author: String
//     }
//     type Query{
//         books: [Book]
//     }
// `


//! 第2种方法 https://www.graphql-tools.com/docs/schema-loading
// import { Book } from "./Book";
// import { Query } from "./Query";
// import { mergeTypeDefs } from "@graphql-tools/merge";

// const types = [Book, Query]

// const typeDefs = mergeTypeDefs(types)

//! 第3种方法 https://www.graphql-tools.com/docs/schema-loading
import path from "path";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

// 递归调用也可以
const typeArray = loadFilesSync(path.join(__dirname, './'), { extensions: ['gql'], recursive: true })
const typeDefs = mergeTypeDefs(typeArray)

// console.log("类型的定义", typeDefs)

export { typeDefs }