import { createApp, defineAsyncComponent } from 'vue'
import 'bootstrap'
import router from '@/indexApp/js/route.js'
const App = defineAsyncComponent(() => import('@/indexApp/App.vue'))

async function initApp() {
  // const directive = await import('@/indexApp/js/directive.js')
  const { extensions } = await import('@/indexApp/js/Extension.js')
  const { VueShowdownPlugin, showdown } = await import('vue-showdown')

  showdown.setFlavor('github')
  const options = {
    emoji: false,
    ghMentions: false,
    ghMentionsLink: `${origin}/profile/{u}`
  }
  Object.keys(options).forEach(key => { showdown.setOption(key, options[key]) })
  showdown.extension('exts', extensions)

  createApp(App)
    .use(router)
    // .use((directive).default)
    .use(VueShowdownPlugin)
    .mount('#app')
}

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    const { Workbox } = await import('workbox-window')
    const wb = new Workbox('/sw.js')
    wb.register()
  }
}

initApp()

if (!import.meta.env.DEV) {
  registerServiceWorker()
}
