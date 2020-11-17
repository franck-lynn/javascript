import { gql } from "apollo-server"
// Define your GraphQL schema
const typeDefs = gql `
    type Book {
        title: String,
        author: String
    }
    type Query{
        books: [Book]
    }
`
// import path from "path";
// import { loadSchemaSync } from "@graphql-tools/load";
// import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

// const typeDefs = loadSchemaSync(path.join(__dirname, './bookType.gql'), {
//     loaders: new GraphQLFileLoader()
// })




// 编写语法指南
// https://www.prisma.io/blog/graphql-sdl-schema-definition-language-6755bcb9ce51
// 语法速查表
// http://caibaojian.com/scb/graphql.html
// console.log("类型的定义", Book)

export { typeDefs }