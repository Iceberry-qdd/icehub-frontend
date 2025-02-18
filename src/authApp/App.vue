<template>
    <div>
        <div class="absolute flex items-start justify-center top-2 w-full z-[1999]">
            <GlobalBanner
                v-if="store.GLOBAL_MSG.length > 0"
                class="fixed h-fit w-fit">
            </GlobalBanner>
        </div>
        <div>
            <!-- eslint-disable-next-line vue/component-name-in-template-casing, vue/no-undef-components -->
            <router-view v-slot="{ Component }">
                <component
                    :is="Component"
                    :key="route.fullPath"
                    @referer="referer">
                </component>
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
    const url = URL.canParse(document.referrer) ? new URL(document.referrer) : undefined
    if(!url) {
        window.location = `${window.location.origin}/index.html`
        return
    }

    window.location = `${window.location.origin}${url.pathname}${url.search}`
}

/**
 * 1. 没有route参数是不进行跳转；
 * 2. route参数值不是一个有效的路由名时跳转至login组件；
 * 3. 否则跳转至指定组件
 */
watch(() => route.query?.route, (newVal, _) => {
    if(!newVal) return
    const name = !!newVal && router.hasRoute(newVal) ? newVal : 'login'
    router.push({name: name, query: {referrer: route.query?.referrer}})
}, {immediate: true})

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