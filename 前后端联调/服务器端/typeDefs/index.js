// 这个 schema 文件夹命名为 typeDefs 是为了和 mongodb 有区分
import  { gql } from "apollo-server"

// Define your GraphQL schema
const typeDefs = gql`
    # 定义的数据类型, 注释用的是 #
    type Book {
        title: String,
        author: String
    }
    # 查询语句, 要向服务器查询什么
    type Query{
        books: [Book]
    }
`

export {typeDefs}



