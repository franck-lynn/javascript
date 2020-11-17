
// 一次导入所有的文件
const files = require.context('@/components/', true, /\.vue$/)

let components = []
files.keys().forEach(key => {
    components = components.concat(files(key).default)
})

const vuerPlugin = {
    install(app) {
        components.forEach(item => app.component(item.name, item))
    }
}

export { vuerPlugin }