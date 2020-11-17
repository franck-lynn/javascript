
// https://www.bilibili.com/video/BV16J41117y4?from=search&seid=11924879180365735748
// 91:38
import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLList } from 'graphql';
import { find, propEq, filter } from 'ramda';
import { books, authors } from '../db/books'

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLInt },
        author: { 
            type: AuthorType,
            resolve(parent){
                console.log("parent", parent)
                return find(propEq('id', parent.authorId))(authors)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent){
                return filter(propEq('authorId', parent.id))(books)
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            // 约定查询参数的类型 id的类型为整型
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                console.log(find(propEq('id', 2))(books))
                return find(propEq('id', args.id))(books)
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLInt}},
            resolve(parent, args){
                return find(propEq('id', args.id))(authors)
            }
        }, 
        books: {
            type: new GraphQLList(BookType),
            resolve(/* parent, args */){
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(/* parent, args */){
                return authors
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQuery
})

export { schema }