<template>
    
</template>
 
<script>
    import queryUser from './queryUser.gql'
    import { apolloClient } from '../apollo-client'
    import { defineComponent, watchEffect } from 'vue'
    export default defineComponent({
        name: 'use-gql-file',
        props: { 
        },
        setup(){
            console.log("查询 graphq 文件-----> ", queryUser)
            watchEffect(async () => {
                const fromGithub = await apolloClient.query({
                    query: queryUser
                })
                console.log(fromGithub.data)
            })
            return {  }
        }
    })
</script>
 
<style lang="scss" scoped>
    
</style>