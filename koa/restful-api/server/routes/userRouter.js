import Router from 'koa-router'
import { getAllUsers, findById } from '../controllers/userController'

const userRouter = new Router({ prefix: '/users' })

userRouter.get('/', getAllUsers)
userRouter.get('/:id', findById)
userRouter.post('/login', async ctx => {
    console.log("路由")
    console.log(ctx.request.body)
    // ctx.body = JSON.stringify(ctx.request.body);
})

export { userRouter }