<template>
    <h1> {{user}} </h1>
    <h1> {{url}} </h1>
</template>

<script>
    // ! https://github.com/IamManchanda/vue3-apollo-client/blob/main/package.jsons
    // import gql from 'graphql-tag'
    // @apollo/client 是整合在react中, 与 在 index.js 中 需要 导入 react 一样, 这里 useQuery 没有用到, 
    // 但是 也需要导入进来, 更加奇怪了, 可能是在 query 里面用到了吧?
    import { gql } from '@apollo/client'
    import { apolloClient } from '../apollo-client'


    import { defineComponent, onMounted, ref } from 'vue'

    export default defineComponent({
        name: 'hello',
        props: {},
        setup() {
            const user = ref()
            const url = ref()
            const queryViewer = gql`query{
                usersById(_id: "0002"){
                    name
                    birthday
                }
            }`
            // https://developer.github.com/v4/guides/using-the-explorer/
            // watchEffect(
            //     async () => {
            //         const formGithub = await apolloClient.query({ query })
            //         console.log("1----> ", formGithub.data)
            //     }
            // )

            onMounted(async () => {
                console.log("加载后执行!")
                const formGithub = await apolloClient.query({ query: queryViewer })
                console.log("2----> ", formGithub.data)
                user.value = formGithub.data.usersById[0].name
                url.value = formGithub.data.usersById[0].birthday
            })
            
            return { user, url }
        }
    })
</script>

<style lang="scss" scoped>

</style>