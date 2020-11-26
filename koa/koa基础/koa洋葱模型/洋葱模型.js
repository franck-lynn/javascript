import Koa from 'Koa'
const app = new Koa()

const waitPromise = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

app.use(async(ctx, next) => {
    console.log("01, 进入第1个中间件")
    await waitPromise(1000)
    await next()
    console.log("04, 离开1")
})
app.use(async(ctx, next) => {
    console.log("02, 进入第2个中间件")
    await next()
    console.log("03, 离开2")
})

app.listen(3001, _ => {
    console.log("Server is running at http://localhost:3001")
})

















