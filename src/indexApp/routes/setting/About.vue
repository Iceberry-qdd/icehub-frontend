<template>
    <div id="setting-about">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder"
            @handle-action="handleAction">
        </Header>
        <div class="flex flex-col h-full items-center justify-end mt-[4rem]">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <img src="/favicon.ico" width="36px" height="36px" />
            <div class="font-bold text-[1.25rem]">Icehub</div>
            <VueShowdown
                tag="markdown"
                :extensions="['exts']"
                :markdown="info"
                class="p-3 text-[0.8rem]">
            </VueShowdown>
        </div>
    </div>
</template>

<style scoped>
markdown{
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    word-break: break-all;
}
</style>

<script setup>
import { computed, reactive, version } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import { VueShowdown } from 'vue-showdown'
import packageInfo from '../../../../package.json'
import { store } from '@/indexApp/js/store.js'

const state = reactive({
    headerConfig: {
        title: '关于',
        goBack: computed(() => store.PAD_MODE || store.MOBILE_MODE),
        showMenu: true,
        menuIcon: "open_in_new",
        noBorder: false
    }
})

const theme = computed(() => {
    return document.querySelector("body").getAttribute("theme")
})

const lan = computed(() => {
    return navigator.language || navigator.userLanguage
})

const env = computed(() => {
    const {DEV, PROD, SSR} = import.meta.env
    return DEV ? 'DEV' : PROD ? 'PROD' : SSR ? 'SSR' : 'UKN'
})

const info = computed(() => {
    return `
    `
})

function handleAction(){
    window.open('https://github.com/Iceberry-qdd/icehub-frontend', 'IcehubGithubWeb', 'noopener,noreferrer')
}
</script>