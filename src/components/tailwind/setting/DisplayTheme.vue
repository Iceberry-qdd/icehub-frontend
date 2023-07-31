<template>
    <div id="setting-display-and-theme">
        <Header
            v-if="state.headerConfig.width != 0"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :noBorder="state.headerConfig.noBorder"
            :menuAction="state.headerConfig.menuAction">
        </Header>
        <div>界面个性化设置</div>
    </div>
</template>

<style scoped></style>

<script setup>
import { onMounted, reactive, onUnmounted, computed, ref } from 'vue'
import Header from '@/components/tailwind/Header.vue'

const state = reactive({
    headerConfig: {
        title: '界面个性化设置',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        width: 0,
        noBorder: true
    }
})

onMounted(() => {
    const displayTheme = document.getElementById('setting-display-and-theme')
    state.headerConfig.width = window.getComputedStyle(displayTheme).width.replace('px', '')
})
</script>