<template>

</template>

<script>
    // https://www.jianshu.com/p/bdb38ec38e78
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'data-fetch-from-github',
        props: {},
        setup() {
            // const query =  `{
            //     usersByName(name: "赵敏") {
            //         name
            //         birthday
            //     }
            // }`
            const query = `
                query($name: String){
                    usersByName(name: $name){
                        name
                        birthday
                    }
                }
            `
            const variables = {name: "赵敏"}
            // fetch('https://api.github.com/graphql', {
            fetch('http://localhost:3000/graphql', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables,
                })
            }).then(r => r.json()).then(data => console.log("数据返回: ", data.data.usersByName[0]))
            return {}
        }
    })
</script>

<style lang="scss" scoped>

</style>