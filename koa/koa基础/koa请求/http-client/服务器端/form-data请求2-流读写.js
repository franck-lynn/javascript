import path from 'path'
import Koa from 'koa'

import Router from 'koa-router'
import bodyParser from 'koa-body'
import koaStatic from 'koa-static'
import fs from 'fs'

const app = new Koa()
const router = new Router()


app.use(bodyParser({
    multipart: true, // support file
    formidable: {
        // uploadDir: path.join(__dirname, '/uploads'), //上传文件保存路径
        keepExtensions: true //保留文件扩展名
    }
}))

router.post('/upload02', async ctx => {
    // 获取 上传文件, file 是 input 表单的名称name, 通过name 获取表单的值
    // 首先通过浏览器来测试, 在用 rest client 测试
    const file = ctx.request.files.file
    // console.log(file)
    // 创建 可读流
    const reader = fs.createReadStream(file.path)
    
    console.log(path.basename(file.path))
    // const newFilename = path.basename(file, path.extname(file.path)) + myDate.getTime() /*+  "." + path.extname(file) */
    // 设置上传路径
    // console.log(newFilename)
    const uploadPath = path.join(__dirname, './uploads/' + path.basename(file.path))
    
    // 创建可写流
    const writer = fs.createWriteStream(uploadPath)
    
    // 可读流管道 流入可写流
    reader.pipe(writer)
    // 返回保存路径
    ctx.body = {
        code: 200,
        data: {
            url: 'http://' + ctx.headers.host + '/upload/' + path.basename(file.path)
        }
    }
})


// 静态文件服务
app.use(koaStatic(path.join(__dirname, '../rest-client'), {
    // https://www.npmjs.com/package/koa-static
    // 配置一些选项 index: '默认起始文件.html'
    // http://localhost:3000/index.html 通过这个网址可以访问
    index: 'form-data请求2-流读写.html'
}))








app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, _ => {
    console.log("Server is running at http://localhost:3000")
})

// nodemon -r esm form-data请求.js  