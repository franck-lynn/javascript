<template>
    <div id="app">
        <h1>vue-apollo 客户端</h1>
        <!-- {{books}} -->
        <ul>
            <li v-for="(book, index) in books" :key="index">{{index}}-- {{book.title}}--{{book.author}}</li>
        </ul>
    </div>
</template>

<script>
    import { apolloClient } from '../apollo-client'
    import gql from 'graphql-tag'
    import { defineComponent, watchEffect, ref, /*  provide, inject */ } from 'vue'

    export default defineComponent({
        name: 'book',
        components: {

        },
        props: {},
        setup() {
            const books = ref(null)
            // const books =  apolloClient.query({
            //     query: gql`query{
            //         books{
            //             title
            //         }
            //     }`
            // }).then(v => console.log(v.data.books))

            watchEffect(
                async () => {
                    //!!! ``内不能有 : 注意!!!
                    //! 否则出现  GraphQLError: Syntax Error: Unexpected <EOF>. 错误
                    const booksFromdb = await apolloClient.query({
                        query: gql `{
                            books{
                                title
                                author
                            }
                        }`
                    })
                    console.log(booksFromdb.data)
                    books.value = booksFromdb.data.books
                }
            )


            return {
                books
            }
        }
    })
</script>

<style lang="scss" scoped>

</style>