import { createApp } from 'vue'
import 'bootstrap'
import App from '@/App.vue'
import App2 from '@/App2.vue'
import '@/assets/main.css'
import router from '@/route'
import 'material-icons/iconfont/round.css';

const reg = new RegExp(/.*auth\.html.*$/)
const path = window.location.href.match(reg)
if (path != null) {
    createApp(App2).mount("#app2")
} else {
    createApp(App).use(router).mount('#app')
}
