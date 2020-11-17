// import { createApp, h, provide } from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { DefaultApolloClient } from "@vue/apollo-composable";

import { vuerPlugin } from './components/vuer-plugin'
import router from './router'

// const defaultClient = new ApolloClient({
//     uri: 'https://api.github.com/graphql',
//     headers: {
//         authorization: 'Bearer xxx'
//     },
//     cache: new InMemoryCache(),
// });

const app = createApp(App)
// const app = createApp({
//     setup() {
//         provide(DefaultApolloClient, defaultClient)
//     },
//     render() {
//         return h(App)
//     }
// })


app.use(router)
app.use(vuerPlugin)
app.mount('#root')