import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { vuerPlugin } from './components/vuer-plugin'

const app = createApp(App)
app.use(router)
app.use(vuerPlugin)
app.mount('#root')