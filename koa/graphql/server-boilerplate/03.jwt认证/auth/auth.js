import path from 'path'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
// 环境变量 中设置 口令
const SECRET = dotenv.config({ path: path.resolve('../../../../', '.env') }).parsed.SECRET

// 用于认证拦截的中间件
const auth = async (ctx, next) => {
    // 获取请求头中的 authorization
    const raw = ctx.header.authorization.split(' ').pop()
    // 验证 token 是否被修改过, token 的合法性. (切割, 组合加密, 比较新旧第3段)
    // 如果 token 没有被修改, 那么, id, name 等信息就能解析出来, 否则, 就会抛出异常
    try {
        const { id } = jwt.verify(raw, SECRET)
        console.log(id)
        next()
    } catch (error) {
        // 验证不通过时给客户端的信息
        console.log('授权token不可用, 请重新登录')
    }
    
}

export default auth