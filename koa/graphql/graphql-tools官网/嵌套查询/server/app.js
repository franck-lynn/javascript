import path from 'path'
import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
//! 要建立这2个文件夹， 并各新建index.js文件
// import { typeDefs } from './graphql'
// import { resolvers } from './resolvers'
import bodyParser from 'koa-body'
import session from 'koa-session'
// 处理静态文件, 静态文件夹一般放是项目文件根目录下的 public
import koaStatic from 'koa-static'

// 连接 mongodb 数据库
import mongoose from 'mongoose'
import { gql } from 'apollo-server'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const typeDefs = gql `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    """
    the list of Posts by this author
    """
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
    postsById(id: Int!): [Post]
  }

  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
  # 扩展类型定义
  type Foo {
      id: String!
  }
  extend type Query {
     foo: [Foo]!
  }  
`;
const authors = [
    { id: 1, firstName: 'Tom', lastName: 'Coleman' },
    { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
    { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
]

const posts = [
    { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
    { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3 },
    { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
    { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 },
]

const resolvers = {
    Query: {
        // 获取整个贴子, 客户端查询 { posts{ id title votes } }
        //! 查询关联时 parent 参数才不为 null
        posts: () => posts,
        // 查询: { author(id: 1){ firstName } }
        author: (parent, { id }, context, info) => {
            console.log(parent, context, info)
            return authors.find(author => author.id === id)
        },
        // 根据 id 查询 posts
        postsById: (_, { id }) => posts.filter(post => post.id === id)
    },
    Mutation: {
        // mutation{ upvotePost(postId: 1) { votes } }
        upvotePost: (_, { postId }) => {
            // 找到 贴子的 id, 进行点赞
            const post = posts.find(post => post.id === postId)
            if (!post) throw new Error(`Couldn't find post with id ${postId}`)
            post.votes += 1;
            return post;
        }
    },
    Author: {
        // 根据 作者 id 查贴子, author 下面增加了 posts 表的字段
        /*
        {
            author(id: 1) {
                firstName
                posts {
                    title
                }
            }
        }
        */
        posts: author => posts.filter(post => post.authorId === author.id)
    },
    Post: {
        // 根据 post 找作者, post 保存了作者的 id, 所以可以找到作者
        /*
        {
            posts {
                title
                author {
                    firstName
                }
            }
        }
        */
        author: (post) => {
            return authors.find(author => author.id === post.authorId)
        }
    }
}



const server = new ApolloServer({
    typeDefs,
    resolvers
})

const app = new Koa()

// 设置session
app.keys = ['super-secret-key']
app.use(session(app))

// body parser
app.use(bodyParser());



// apollo 服务器注册到 koa app
server.applyMiddleware({ app })

// 在这个目录下的文件都可以通过服务器对外提供服务, 前端项目也会使用这个html文件, 是做为浏览器的入口文件
app.use(koaStatic(path.join(__dirname, '../public'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    index: 'index.html'
}))

app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000${server.graphqlPath}`)
})