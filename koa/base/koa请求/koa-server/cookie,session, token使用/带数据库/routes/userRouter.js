import Router from 'koa-router'
import { getAllUsers, findById, login, register, auth, getProfile } from '../controllers/userController'

const userRouter = new Router({ prefix: '/api' })
// 获取所有用户
userRouter.get('/users', getAllUsers)
userRouter.get('/path/:id', findById)

userRouter.post('/login', login)
userRouter.post('/register', register)



userRouter.get('/profile', auth, getProfile)

export { userRouter }