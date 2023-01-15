import { createApp } from 'vue'
import 'bootstrap'
import App from '@/App.vue'
import App2 from '@/App2.vue'
import '@/assets/main.css'
import router from '@/route'

const reg = new RegExp("^https?://[a-zA-Z]+\.?(com)?:[0-9]{0,5}/auth\.html.*$")
const path = window.location.href.match(reg)
if (path != null) {
    createApp(App2).mount("#app2")
} else {
    createApp(App).use(router).mount('#app')
}
