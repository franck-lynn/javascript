import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import uuid from 'uuid'

const users = [{
    "id": "7bc03207-05e3-45c3-9434-e5c2c9a7f0f3",
    "username": "赵敏",
    "email": "zhaomin@163.com",
    "password": "$2b$12$r6Yat2qY/hB.gmU/pr2eg.ko6FziHhToft9XDEP/oZt5ChE387926"
}, ]

const userResolver = {
    Query: {
        meUnauth: () => users,
        // 在 context 中看看是否有 user
        me: async (_, args, context) => {
            console.log("解析器中打印 context = ", context)
            console.log("解析器中打印--->  = ", context.body)
            const { user } = context.body
            if (!user) {
                throw new Error('没有授权')
            }
            return users.find(u => u.id === user.id)
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }, context) => {
            const id = uuid.v4()
            const pwd = await bcrypt.hash(password, 12)
            const user = { id, username, email, password: pwd }
            users.push(user)
            // console.log("01. 打印user", user)
            // 注册好后就返回一个签名给客户端, 要考虑这个 token 放在什么位置
            const token = jwt.sign({ id }, "secret-key")
            // context.state = { user }
            // context.header = { authorization: token }
            
            return {
                ...user, token
            }
        },
        login: async (_, { email, password }, context) => {

            const user = users.find(u => u.email === email)
            if (!user) {
                throw new Error("没有这个邮件的用户")
            }
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                throw new Error('密码不正确')
            }
            const token = jwt.sign({ id: user.id }, "secret-key")
            context.header = { authorization: token }
            context.body = { user, token }
            return {
                ...user,
                token
            }
        }
    }
}
export default userResolver