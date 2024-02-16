import { createApp, defineAsyncComponent } from 'vue'

const App = defineAsyncComponent(() => import('@/authApp/App.vue'))

// const router = useRouter()
// const reg = new RegExp(/.*auth\.html.*$/)
// const path = window.location.href.match(reg)
// const origin = window.location.origin
// const hasToken = localStorage.getItem('TOKEN') == null ? false : localStorage.getItem('TOKEN').length > 0
createApp(App).mount("#app")
