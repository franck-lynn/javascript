<template>

</template>

<script>
    import { gql } from '@apollo/client'
    import { apolloClient } from '../apollo-client'

    import { defineComponent, watchEffect } from 'vue'
    export default defineComponent({
        name: 'variables',
        props: {},
        setup() {
            const queryViewer = gql `query($name: String!){
                 usersByName(name: $name){
                     name
                     birthday
                 }
            } `

            // const queryViewer = gql `query{
            //     usersByName(name: "赵敏"){
            //         name
            //         birthday
            //     }
            // }`
            const variables = { name: "赵敏" }
            
            console.log("3----> ",queryViewer)
            
            watchEffect(
                async () => {
                    const formGithub = await apolloClient.query({
                        query: queryViewer,
                        variables
                    })
                    console.log("4----> ",formGithub.data)
                }
            )
            return {}
        }
    })
</script>

<style lang="scss" scoped>

</style>