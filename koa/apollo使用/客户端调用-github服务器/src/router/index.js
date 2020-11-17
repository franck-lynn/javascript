import { createRouter, createWebHashHistory } from 'vue-router'

// 读取 views 文件夹下的所有文件
// 由于 webpack 无法调用 node 的 fs, 这里采用字符串数组的方式, 是不是可以直接采用 ecmascript 直接操作文件呢?
// 直接操作也是相当的麻烦, 还是采用 require.context()
// 一次导入所有的文件, 导入了所有 .vue 文件
const files = require.context('@/components/', true, /\.vue$/)

let routes = []
//! 约定:
//? 所有 vue 文件都按照模板的 default 导出
//? 文件名称与 vue 中的 name 属性相同, 这样就可以根据 name 属性 取出文件名
files.keys().forEach(key => {
    const module = files(key).default
    routes = routes.concat({
        path: '/' + module.name,
        name: module.name,
        component:module 
    })
})
// 配置一个默认的路由
const defaultRoute = {
    path: '/', 
    component: () => import('@/components/index.vue')
}
routes.push(defaultRoute)


const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router