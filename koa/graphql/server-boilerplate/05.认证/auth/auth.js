import path from 'path'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// 环境变量 中设置 口令
const SECRET = dotenv.config({ path: path.resolve('../../../../', '.env') }).parsed.SECRET
// 当登录成功时, login() 函数会给客户一个 token, 
// 这个 token 保存在 请求头
const auth = async (ctx, next) => {
    const authHeader = ctx.headers.authorization
    if (authHeader) {
        const token = ctx.header.authorization.split(' ').pop()
        // 如果这个 token 和 刚刚登录过的 token  是一样的, 就说明这个 token 是注册后从客户端带过来的
        // 实验证明, 确实是登录后从客户端带过来的
        // console.log("打印下 token = ", token)
        if (token) {
            // 验证这个token的合法性
            try {
                const { id } = jwt.verify(token, SECRET)
                //! login 登录过后, 给了客户端一个token, 客户端在访问 /graphql 后, 
                //! 客户端带过来的 token 解析成 id , 已经正确验证了 客户端带来的 token, 
                //! 现在可以确认 登录者就是本人了
                // console.log("00. 首先要走认证流程")
                // console.log("01. 查看下解析后的 id = ", id)
                // 那么, 通过谁把这个 id 带给下一个函数执行呢
                // console.log("02. 打印下 ctx.header = ", ctx.header)
                // console.log("03. 打印下 ctx.currentUser = ", ctx.currentUser)
                // ctx.currentUser = id
                // // ctx.body = {id}
                // // console.log("02. 打印下 ctx.state = ", ctx.state)
                // return await next()
                return id

            } catch (error) {
                throw new Error('01, Invalid/Expired token');
            }
        }
        throw new Error("02, Authentication token must be 'Bearer [token]")
    }
    throw new Error('03, Authorization header 必须要提供')
}


export { auth }