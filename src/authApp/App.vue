<template>
    <div>
        <div class="absolute flex items-start justify-center top-2 w-full z-[1999]">
            <GlobalBanner
                v-if="store.GLOBAL_MSG.length > 0"
                class="fixed h-fit w-fit">
            </GlobalBanner>
        </div>
        <div class="absolute bg-gray-100 dark:bg-inherit flex h-full items-center justify-center w-full">
            <!-- eslint-disable-next-line vue/component-name-in-template-casing, vue/no-undef-components -->
            <router-view
                v-slot="{ Component }"
                class="bg-white dark:bg-[#1e1e1e] flex flex-col items-center justify-center max-h-[100vh] max-sm:h-[100vh] max-sm:rounded-none max-sm:w-[100vw] max-w-[100vw] relative rounded-xl">
                <keep-alive
                    :max="8"
                    :include="['Index', 'Explore', 'Bookmark', 'Notify', 'Search', 'Profile']">
                    <component
                        :is="Component"
                        :key="route.fullPath"
                        @referer="referer">
                    </component>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, defineAsyncComponent, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
const GlobalBanner = defineAsyncComponent(() => import('@/components/GlobalBanner.vue'))

const route = useRoute()
const router = useRouter()

const state = reactive(({
    themeMediaQueryList: undefined
}))

function referer() {
    const url = route.query?.url
    if(!url) {
        window.location = `${window.location.origin}/index.html`
        return
    }
    window.location = `${window.location.origin}/index.html?url=${route.query.url}`
}

watch(() => route.query?.ph, (ph, oldVal) => {
    if (ph){
        router.push({name: 'quickLogin', query: {ph: ph}})
    }
})

function handlePopstate(){
    history.pushState(null, null, document.URL)
}

function handleThemeMediaChange(mq) {
    store.setSysThemeMode(mq.matches ? 'dark' : 'light')
    if(!('theme' in localStorage)){
        document.body.setAttribute('theme', store.SYS_THEME_MODE)
    }
}

onMounted(() => {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', handlePopstate)
    
    document.getElementById('pre-loading').style.display = 'none'

    // Media query theme mode settings
    state.themeMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    handleThemeMediaChange(state.themeMediaQueryList)
    state.themeMediaQueryList.addEventListener('change', handleThemeMediaChange)
})

onUnmounted(() => {
    window.removeEventListener('popstate', handlePopstate)
    state.themeMediaQueryList.removeEventListener('change', handleThemeMediaChange)
})
</script>