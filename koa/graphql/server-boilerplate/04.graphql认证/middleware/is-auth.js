import jwt from 'jsonwebtoken'
// 当登录成功时, login() 函数会给客户一个 token, 
// 这个 token 保存在 请求头
const isAuth = async (ctx, next) => {
    const authHeader = ctx.headers.authorization
    // console.log("01, 会走这里", /* ctx.headers, */ authHeader)
    if (!authHeader) {
        ctx.state = {isAuth: false}
        return await next()
    }
    const token = ctx.header.authorization.split(' ').pop()
    //  console.log("02.token -----> ", token)
    if (!token || token === '') {
        ctx.state = { isAuth: false }
        return await next()
    }
    
    // 解码 token
    try {
        const decodedToken = jwt.verify(token, 'somesupersecretkey')
        // console.log("03. token -----> ", token, "解码后的token----> ",  decodedToken)
        if (!decodedToken) {
            ctx.state = { isAuth: false }
            return await next()
        }
        ctx.state = { isAuth: true }
        ctx.state.userId = decodedToken.userId
        // console.log("推荐的存储空间state--> ", ctx.state.isAuth)
        return next(ctx)
    } catch (error) {
        ctx.state = { isAuth: false }
        return await next()
    }
}

export {isAuth}