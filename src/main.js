import { createApp } from 'vue'
import 'bootstrap'
import App from '@/App.vue'
import App2 from '@/App2.vue'
import '@/assets/main.css'
import '@/assets/mkd_default.css'
import router from '@/route'
import 'material-icons/iconfont/round.css'
import directive from './directives/directive.js'
import { VueShowdownPlugin, showdown } from 'vue-showdown'
import { extensions } from './showdownExtensions/Extensions.js'

const reg = new RegExp(/.*auth\.html.*$/)
const path = window.location.href.match(reg)
if (path != null) {
    createApp(App2).mount("#app2")
} else {
    showdown.setFlavor('github')
    const options = { emoji: false, ghMentions: false, ghMentionsLink: 'http://icehub.com:5173/profile/{u}' }
    Object.keys(options).forEach(key => { showdown.setOption(key, options[key]) })
    showdown.extension('exts', extensions)

    createApp(App).use(router).use(directive).use(VueShowdownPlugin).mount('#app')
}