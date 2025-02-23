import { createApp, defineAsyncComponent } from 'vue'
import router from '@/indexApp/js/route.js'
const App = defineAsyncComponent(() => import('@/indexApp/App.vue'))

async function initApp() {
  // const directive = await import('@/indexApp/js/directive.js')
  const { extensions } = await import('@/indexApp/js/Extension.js')
  const { VueShowdownPlugin, showdown } = await import('vue-showdown')

  const options = {
    flavor: 'github',
    options: {
      emoji: true,
      tasklists: true,
      strikethrough: true,
      simplifiedAutoLink: true,
      tables:true,
      ghCodeBlocks: true,
      encodeEmails: true,
      openLinksInNewWindow: true,
      ghCodeBlocks: true,
      ghMentions: true,
      ghMentionsLink: `${origin}/profile/{u}`
    },
  }
  showdown.extension('exts', extensions)

  createApp(App)
    .use(router)
    // .use((directive).default)
    .use(VueShowdownPlugin, options)
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
