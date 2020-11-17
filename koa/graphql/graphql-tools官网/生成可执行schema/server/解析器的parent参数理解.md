## 解析器 parent 参数的理解

### 在 schema 文件 .gql 中, 定义 schema
```
type User{
    id: Int!
    name: String
    age: Int!
    friend: String
}

type Blog{
    id: Int!
    title: String
}
# 接下来定义 User 里的 嵌套数据
# 每个 User 下 有其 发的 贴子, 所以, User 继承 Blog 数据的查询
extend type User {
    blogs: [Blog]
}
# 每个 Blog 也要找到对应的 发帖人
extend type Blog{
    author: User
}
# 定义的查询
type Query {
    # 定义查询函数的 schema
    me: [User]
}
```
### 解析器的 定义

```
 Query: {
        // users: () => users,
        // user: (_, {id}) => users.find(user => user.id === id),
        me: (root, args, context) => {
            // 这里的 root 是 null
            return users
        }
    },
    User: {
        blogs: (parent, agrs) => {
            // 这里的 parent 是指 user , 因为 me() 函数 查询的是 User
            // user 继承了 blog
            console.log(parent)
            return blogs
        }
    }
}
```
### 客户端的查询
```
### 客户端的查询
POST {{url}} HTTP/1.1
X-Request-Type: GraphQL
Content-Type: application/json

{
    me{
        id
        name
        age
        blogs{
            title
        }
    }
}
```



















