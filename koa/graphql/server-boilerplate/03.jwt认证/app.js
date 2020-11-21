// import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-body'
// import session from 'koa-session'
import mongoose from 'mongoose'

// 导入批量路由入口文件
import routes from './routes'
//url 带上复制集
const url = 'mongodb://localhost:27017/test?replicaSet=my_repl'
mongoose.connect(url, { useUnifiedTopology: true }, () => console.log('数据库连接成功!'))
// 错误信息, 绑定错误信息处理, 以便定位错误,
mongoose.connection.on('error', console.error.bind(console, 'mongoDB连接异常'))

const app = new Koa()

// body parser, 解析请求体, 要在路由注册之前调用
app.use(bodyParser());

// 批量注册路由
routes(app)


app.listen(3000, _ => {
    console.log(`Server is running at http://localhost:3000`)
})