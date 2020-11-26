import path from 'path'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// 环境变量 中设置 口令
const SECRET = dotenv.config({ path: path.resolve('../../../../', '.env') }).parsed.SECRET
// 当登录成功时, login() 函数会给客户一个 token, 
// 这个 token 保存在 请求头
const tradeTokenForUser = async (authToken) => {
        const token = authToken.split(' ').pop()
        // 如果这个 token 和 刚刚登录过的 token  是一样的, 就说明这个 token 是注册后从客户端带过来的
        // 实验证明, 确实是登录后从客户端带过来的
        // console.log("打印下 token = ", token)
        if (token) {
            // 验证这个token的合法性
            try {
                // 在 resolvers/user.resolvers.js 文件中, 加密的是 id
                // 所以 这里 解析出来的也是 id
                // 这个 id 再传给 apollo-server/index 中 apollo-server 的上下文
                // 所以, apollo-server 中的上下文实际上保存的是用户的 id, 而不是name
                const { id } = jwt.verify(token, SECRET)
                //! login 登录过后, 给了客户端一个token, 客户端在访问 /graphql 后, 
                //! 客户端带过来的 token 解析成 id , 已经正确验证了 客户端带来的 token, 
                //! 现在可以确认 登录者就是本人了
                return {id, role: 'EDITOR'}

            } catch (error) {
                throw new Error('01, 不可使用/过期的口令');
            }
        }
        throw new Error("02, 认证口令必须是'Bearer [token]")
  
}


export { tradeTokenForUser }