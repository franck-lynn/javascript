<template>
    <!-- 直接路由出口, 根元素是 index.html 里的 <div id="root"></div> -->
    <router-view></router-view>
</template>

<script>
    import { defineComponent } from 'vue'
    // import { DefaultApolloClient } from '@vue/apollo-composable'
    // import { apolloClient } from './apollo-client'
    export default defineComponent({
        name: 'App',
        props: {},
        setup() {
            // provide(DefaultApolloClient, apolloClient)
            return {}
        }
    })
</script>

<style lang="scss">
    @import '~compass-mixins/lib/compass';
    // 清除所有的默认样式
    @include global-reset;
    // shared.scss 是 全局的样式入口文件
    @import 'scss/scss/entries/shared.scss';
</style>