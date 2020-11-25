// 动态的模块加载
// 被加载的文件导出是有要求的, 只能导出一个,export default xxx 或者 export {} 都可以
import fs from 'fs'
import path from 'path'

const readfiles = (dir, ignore = null, list = [], deep = 0) => {
    const files = fs.readdirSync(dir, 'utf-8')
    for (let i = 0; i < files.length; i++) {
        const stat = fs.statSync(dir + path.sep + files[i])
        if (stat.isDirectory()) {
            readfiles(dir + path.sep + files[i], ignore, list, deep + 1)
        } else {
            // 忽略掉第1层的要忽略的文件, 如不需要这个功能, 去掉 deep 即可
            // 数组, 字符串忽略都可以
            if (!deep && ignore && ignore.indexOf(files[i]) !== -1) continue
            list.push(dir + path.sep + files[i])
        }
    }
    return list
}

// 动态导入模块
const loader = (dir, ignore = null, list = [], deep = 0) => {
    const files = readfiles(dir, ignore, list, deep)
    return files.map(filename => {
        if (!/\.js$/.test(filename)) return
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const rs = require(filename)
        return rs[Object.keys(rs)[0]]
    })
}

//* 自动加载 routes 文件夹下的路由文件
//! 要忽略掉 index.js 和 'loader.js 这2个不是路由的文件
//! routes 文件夹除了这2个文件外, 其他的 js 文件应该都是路由文件.
//! 自动导入的时候才不会报错
const routers = loader(__dirname, ['index.js'])

const routes = app => {
    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })
}
export default routes