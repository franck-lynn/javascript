import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '../model/user'

const authResolver = {
    Query: {
        login: async (_, { email, password }, context) => {
            const user = await User.findOne({ email: email })

            if (!user) {
                throw new Error('用户不存在')
            }
            // 明文与密文比较
            const isPasswordValid = await bcrypt.compare(password, user.password)
            // 123
            // $2b$12$Wf.Atiff9gcdhdE.vuChSed2Lmw7DcWgrQKNS0YjDoasdFRILQmk2
            // console.log("验证密码是否相等? ", password, user.password,  isPasswordValid)
            if (!isPasswordValid) {
                throw new Error('密码不正确')
            }
            // 签名用户的 userId 和 email. 生成一个随机的字符串 token, 
            // 作为 cookie 发送给客户, 客户再次访问的时候都带上这个
            // 口令作为通行证, somesupersecretkey 是加密密码
            const token = jwt.sign({ userId: user.id, email: user.mail },
                'somesupersecretkey', { expiresIn: '1h' }
            )
            //! 这里登录好后要给 res 返回这个 token, 不然客户端拿不到这个 token
            context.headers = { authorization: token }
            return { userId: user.id, token, tokenExpiration: 1 }
        }
    },
    Mutation: {
        createUser: async (_, args) => {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('用户已存在')
            }
            // 如果用户不存在, 先加密传入的密码
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            try {
                const result = await user.save()
                return { ...result._doc, password: null, _id: result.id }
            } catch (err) {
                console.log(err)
            }
        }
    }

}
export default authResolver