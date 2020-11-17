import { Strategy as localStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

const initialize = (passport, getUserByEmail, getUserById) => {
    const authenticateEmail = async (email, password, done) => {
        const user = getUserByEmail(email)
        // console.log("02, 策略验证器: ", user)
        // 已经 根据客户端传过来的 Email 从数据库拿到了 user
        // id: '123456789abc',
        // name: 'zs',
        // email: 'zs@163.com',
        // password: '$2b$10$Zq2ZwVamVSi0X/RM0ROYOOQAAi4dv9T2DRcawW2wnwGsaddu2XXA2'
        if (user === null || user === undefined) {
            return done(null, false, { message: '没有此邮箱' })
        }
        // const isPasswordEquals = await bcrypt.compare(password, user.password)
        // console.log("密码是否相等?", isPasswordEquals)
        try {
            // console.log("邮箱有错误还到这里了")
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: '密码错误' })
            }
        } catch (e) {
            return done(e)
        }
    }
    
    passport.use(new localStrategy({ usernameField: 'email' }, authenticateEmail))
    
    // 序列化和反序列化
    passport.serializeUser((user, done) => {
        // console.log('01, 序列化--> ', user.id)
        done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        // 根据id恢复用户
        // console.log("02, 反序列化, id=", id)
        // return done(null, getUserById(id))
        done(null, getUserById(id))
    })
}
export { initialize }