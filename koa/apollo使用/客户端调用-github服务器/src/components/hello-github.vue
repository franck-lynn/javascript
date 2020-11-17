<template>
    
</template>
 
<script>
    import { gql } from '@apollo/client'
    import { apolloClient } from '../apollo-client'
    
    import { defineComponent, watchEffect } from 'vue'
    export default defineComponent({
        name: 'hello-github',
        props: { 
        },
        setup(){
            // 需要切换到 github 的地址
            const queryFromGithub =  gql`{
                viewer {
                    login
                    url
                }
            }`
            watchEffect(async () => {
                const formGithub = await apolloClient.query({ query: queryFromGithub })
                console.log("8----> ", formGithub.data)
            })
            return {  }
        }
    })
</script>
 
<style lang="scss" scoped>
    
</style>