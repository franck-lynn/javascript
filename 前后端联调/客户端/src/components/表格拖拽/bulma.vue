<template>
    <!-- <div id="app">
        <table class="table table-left">
            <table-head :thead="thead_left"></table-head>
            <table-body :tbody="tbody_left"></table-body>
        </table>
        <table class="table table-right">
            <table-head :thead="thead_right"></table-head>
        </table>
    </div> -->
    {{books}}
</template>

<script>
    import { thead_left, thead_right } from "./bus";
    import { apolloClient } from "../../apollo-client";
    import gql from 'graphql-tag'
    import { defineComponent, ref, watchEffect } from 'vue'
    export default defineComponent({
        name: 'bulma',
        props: {},
        setup() {
            const books = ref(null)
            watchEffect(
                async () => {
                    const fromDb = await apolloClient.query({
                        query: gql `{
                             books{
                                 title
                                 author
                             } 
                         }`
                    })
                    console.log(fromDb.data)
                    books.value = fromDb.data.books
                }
            )
            return { thead_left, thead_right, books}
        }
    })
</script>

<style lang="scss" scoped>
    #app {
        display: flex;
        flex-direction: row;

        .table {
            // border: 1px solid red;
            margin-right: 20px;
        }
    }
</style>