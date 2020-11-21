import bcrypt from "bcrypt"

import { User } from '../model/user'

const userResolver = {
    Mutation: {
        createUser: async (_, args) => {
            // 获取传过来的参数, 在数据库中查找
            const u = await User.findOne({ email: args.userInput.email })
            if (u) {
                throw new Error('用户已经存在')
            }
            // 如果用户不存在, 先加密密码
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            // 生成用户对象
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            // 保存到数据库
            try {
                const result = await user.save()
                console.log(result)
                return { ...result._doc, password: null, _id: result.id }
            } catch (e) {
                console.log(e)
            }
        }
    }
}


export default userResolver