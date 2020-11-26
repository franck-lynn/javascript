
import { loader } from "./loader";
//* 自动加载 routes 文件夹下的路由文件
//! 要忽略掉 index.js 和 'loader.js 这2个不是路由的文件
//! routes 文件夹除了这2个文件外, 其他的 js 文件应该都是路由文件.
//! 自动导入的时候才不会报错
const routers = loader(__dirname, ['index.js', 'loader.js'])

const routes = app => {
    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })
}
export default routes