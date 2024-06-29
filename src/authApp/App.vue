<template>
    <div>
        <div class="absolute flex items-start justify-center top-2 w-full z-[1999]">
            <GlobalBanner
                v-if="store.GLOBAL_MSG.length > 0"
                class="fixed h-fit w-fit">
            </GlobalBanner>
        </div>
        <div class="absolute bg-gray-100 flex h-full items-center justify-center w-full">
            <!-- eslint-disable-next-line vue/component-name-in-template-casing, vue/no-undef-components -->
            <router-view
                v-slot="{ Component }"
                class="bg-white flex items-center justify-center max-h-[100vh] max-sm:h-[100vh] max-sm:rounded-none max-sm:w-[100vw] max-w-[100vw] relative rounded-xl">
                <keep-alive
                    :max="8"
                    :include="['Index', 'Explore', 'Bookmark', 'Notify', 'Search', 'Profile']">
                    <component
                        :is="Component"
                        :key="route.fullPath">
                    </component>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, defineAsyncComponent, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'material-icons/iconfont/round.css'
import { store } from '@/indexApp/js/store.js'
const GlobalBanner = defineAsyncComponent(() => import('@/components/GlobalBanner.vue'))

const route = useRoute()
const router = useRouter()

function referer() {
    const url = route.query?.url
    if(!url) {
        window.location = window.location.origin
        return
    }

    window.location = `${window.location.origin}${decodeURIComponent(atob(route.query.url))}`
}

watch(() => route.query?.ph, (ph, oldVal) => {
    if (ph){
        router.push({name: 'quickLogin', query: {ph: ph}})
    }
})

onMounted(() => {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
    })
    
    const token = localStorage.getItem('TOKEN')
    if (token) {
        referer()
        return
    }
    
    document.getElementById('pre-loading').style.display = 'none'
})

onUnmounted(() => {
    window.removeEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
    })
})
</script>