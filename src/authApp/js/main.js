import { createApp, defineAsyncComponent } from 'vue'
import router from '@/authApp/js/route.js'
const App = defineAsyncComponent(() => import('@/authApp/App.vue'))

createApp(App).use(router).mount("#app")
