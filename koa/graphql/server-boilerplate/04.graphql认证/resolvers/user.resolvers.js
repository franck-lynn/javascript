import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const users = []

const userResolver = {
    Query: {
        // 在 context 中看看是否有 user
        me: async (_, args, { user }) => {
            if (!user) {
                throw new Error('没有授权')
            }
            return await users.find(u => u.id === user.id)
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const pwd = await bcrypt.hash(password, 12)
            const user = { username, email, password: pwd }
            users.push(user)
            // 注册好后就返回一个签名给客户端
            return jwt.sign({id: })
        }
    }
}