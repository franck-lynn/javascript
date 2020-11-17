graphql 步骤:
=============

### 1. 当请求 graphql 时
     router('/graphql', graphqlhttp({
        schema, 
        // 是否需要调试
        graphiql: true
    }))

### 2. 首先找 schema
    // schema 定义了 根请求
    const schema = new GraphQLSchema({
        query: RootQuery
    })
### 3. 定义根请求
    const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            book: {
                type: BookType,
                // 约定查询参数的类型 id的类型为整型
                args: { id: { type: GraphQLInt } },
                resolve(parent, args) {
                    console.log(find(propEq( 'id', 2))(books))
                    return find(propEq('id', args.id ))(books)
                }
            }
        }
    })
### 根请求包含一定自定义的数据, 定义数据类型
    const BookType = new GraphQLObjectType({
        name: 'Book',
        fields: () => ({
            id: { type: GraphQLInt },
            name: { type: GraphQLString },
            genre: { type: GraphQLString }
        })
    })

### 服务器文件定义路由
    router.all('/graphql', graphqlhttp({
        schema,
        // 是否需要调试
        graphiql: true
    }))

### 浏览器请求数据
    {
      book(id: 3){
        name
        genre
      }
    }
### 联合查询的 schema
    // 从 books 表中根据 id 查询出 books, 顺便把 book 的作者
    // 也查出来
    book: {
            type: BookType,
            // 约定查询参数的类型 id的类型为整型
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                console.log(find(propEq('id', 2))(books))
                return find(propEq('id', args.id))(books)
            }
        },

### 从上面的操作过程可以看出, 重点是 schema:
    //  schema 定义了查询的几个要素:
    // 1. 要查询哪个, 就写哪个, 如要查询 book, 就写 book, books就写books
    // 2. 查询的类型.
    // 3. 查询的参数
    // 4. resolve() 根据 参数进行具体的查询, 返回要查询的类型

