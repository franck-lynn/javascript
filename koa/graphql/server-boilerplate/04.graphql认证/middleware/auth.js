import jwt from 'jsonwebtoken'
// 当登录成功时, login() 函数会给客户一个 token, 
// 这个 token 保存在 请求头
const auth = async (ctx, next) => {
    const authHeader = ctx.headers.authorization
    console.log("01, 会走这里", /* ctx.headers, */ authHeader)
    if (authHeader) {
        const token = ctx.header.authorization.split(' ').pop()
        if (token) {
            // 验证这个token的合法性
            try {
                const { user } = jwt.verify(token, "secret-key")
                
                ctx.user = user
                return await next()
                
            } catch (error) {
                throw new Error('01, Invalid/Expired token');
            }
        }
        throw new Error("02, Authentication token must be 'Bearer [token]")
    }
    throw new Error('03, Authorization header 必须要提供')
}


export { auth }