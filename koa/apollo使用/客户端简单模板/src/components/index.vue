<template>
    <!-- 
        index.vue 作为一个总的链接页面, 通过这个页面直接到达各个页面, 并且, 
        渲染都是直接在 根路由出口, 也就是 App.vue里的 router-views 里出来的
    -->
    <!-- 以侧边栏的型式显示 -->
    <h3 v-for="link in links" :key="link"> <a :href="`/#${link}`"> {{link}} </a> </h3>
</template>

<script>
    import path from 'path'
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'index',
        props: {},
        setup() {
            let links = []
            // 例如: 自动生成如下链接, 自动导航到 test.vue 这个页面
            // <h3><a href="#/test/test"> test </a></h3>
            // 读取 component目录下的 vue 文件, 并把这些文件 添加到 链接中, 点击后即可到达这个页面
            const files = require.context('@/components/', true, /\.vue$/)

            files.keys().forEach(key => {
                // console.log(key) // key 是包含相对路径的文件名  ./test/test.vue
                // 把这些 含有相对路径的文件名去掉 . 号和 后缀, 放到 links 中, 就得到了links
                // console.log(path.basename(key, path.extname(key))) // 仅仅返回文件名
                //! 匹配 . 开头, 和 .vue 结尾
                // console.log(key.replace(/(^\.)/, ''))
                // console.log(key.replace(/(\.vue$)/, ''))
                // console.log(key.replace(/(^\.)|(\.vue$)/g, ''))
                //! 保留这个正则表达式以备查阅
                //! links = links.concat(key.replace(/(^\.)|(\.vue$)/g, ''))
                links = links.concat(path.basename(key, path.extname(key)))
            })
            return { links }
        }
    })
</script>

<style lang="scss" scoped>
    h3{
        margin: 20px;
        a{
            text-decoration: none;
        }
    }
</style>