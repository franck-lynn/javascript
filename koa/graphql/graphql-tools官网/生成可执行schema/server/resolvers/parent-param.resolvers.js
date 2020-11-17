// https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e

const users = [
    {id: 1, name: '杨钰莹', age: 48},
    {id: 2, name: '周芷若', age: 20},
]
const blogs = [
    {id: 1, title: '杨钰莹博客'},
    {id: 2, title: '周芷若博客'},
]

const parentParamResolvers = {
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

export default parentParamResolvers