import { Strategy as localStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

const initialize = (passport, getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if(user === null || user === undefined){
            return done(null, false, {message: '没有此邮箱'})
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else {
                return done(null, false, {message: '密码错误'})
            }
        } catch (e) {
            return done(e)
        }
    }
    
    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
    
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => done(null, getUserById(id)))
}
export { initialize }

