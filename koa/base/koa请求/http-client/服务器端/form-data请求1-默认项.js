import path from 'path'
import Koa from 'koa'

import Router from 'koa-router'
import bodyParser from 'koa-body'
import koaStatic from 'koa-static'

const app = new Koa()
const router = new Router()

// body parser 请求解析要放在注册路由的前面
// 只能使用一次
// app.use(bodyParser());
// body parser 处理文件上传
app.use(bodyParser({
    multipart: true, // support file
    formidable: {
        uploadDir: path.join(__dirname, '/uploads'), //上传文件保存路径
        keepExtensions: true //保留文件扩展名
    }
}))


const upload01 = async ctx => {
    const file = ctx.request.files.file
    // console.log(file)
    // console.log(ctx.origin) // 原始的请求地址: http://localhost:3000
    ctx.body = `${ctx.origin}/uploads/${path.basename(file.path)}`
}

// upload 在本文上面定义
router.post('/upload01', upload01)


// 静态文件服务
app.use(koaStatic(path.join(__dirname, '../rest-client'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    // http://localhost:3000/index.html 通过这个网址可以访问
    index: 'form-data请求1-默认项.html'
}))


app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})

// nodemon -r esm form-data请求.js  