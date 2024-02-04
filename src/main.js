import { createApp, defineAsyncComponent } from 'vue'
import router from '@/route.js'
const App = defineAsyncComponent(() => import('@/App.vue'))
const App2 = defineAsyncComponent(() => import('@/App2.vue'))

const reg = new RegExp(/.*auth\.html.*$/)
const path = window.location.href.match(reg)
const origin = window.location.origin
const hasToken = localStorage.getItem('TOKEN') == null ? false : localStorage.getItem('TOKEN').length > 0

async function loadApp(){
    try{
        const directive = await import('./directives/directive.js')
        const { extensions } = await import('./showdownExtensions/Extensions.js')
        const { VueShowdownPlugin, showdown } = await import('vue-showdown')
        
        showdown.setFlavor('github')
        const options = { emoji: false, ghMentions: false, ghMentionsLink: `${origin}/profile/{u}` }
        Object.keys(options).forEach(key => { showdown.setOption(key, options[key]) })
        showdown.extension('exts',  extensions)
        
        createApp(App).use(router).use((directive).default).use(VueShowdownPlugin).mount('#app')
    }catch(e){
        console.log('Load App js failed, try refresh the page:' + e)
    }
}

if (!hasToken && path === null) {
    top.location = `http://${window.document.location.host}/auth.html`
    createApp(App2).mount("#app2")
} else if(!hasToken){
    createApp(App2).mount("#app2")
} else {
    loadApp()
}