// https://www.jianshu.com/p/8d6f51fb0055
// https://www.npmjs.com/package/apollo-server-koa
// https://www.apollographql.com/docs/tutorial/schema/
import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import {typeDefs} from './graphql'
import { resolvers } from "./resolves";
const server = new ApolloServer({
    typeDefs,
    resolvers
})

const app = new Koa()
server.applyMiddleware({app})

app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000${server.graphqlPath}`)
})


// import Koa from 'koa'
// // import { ApolloServer } from 'apollo-server-koa'
// import { addResolversToSchema } from '@graphql-tools/schema';
// import  graphqlHTTP from "koa-graphql";
// import {typeDefs} from './graphql'
// import { resolvers } from "./resolves";

// const schemaWithResolvers = addResolversToSchema({
//     typeDefs,
//     resolvers,
// });


// const app = new Koa()
// app.use(
//     graphqlHTTP({
//         schema: schemaWithResolvers,
//         graphiql: true
//     })
// )

// app.listen(3000, _ => {
//     console.log(`Server is running at http://localhost:3000/graphql`)
// })
