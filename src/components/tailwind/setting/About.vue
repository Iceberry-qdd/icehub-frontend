<template>
    <div id="setting-about">
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
        <div>关于</div>
    </div>
</template>

<style scoped></style>

<script setup>
import { onMounted, reactive, onUnmounted, computed, ref } from 'vue'
import Header from '@/components/tailwind/Header.vue'

const state = reactive({
    headerConfig: {
        title: '关于',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        width: 0,
        noBorder: true
    }
})

onMounted(() => {
    const about = document.getElementById('setting-about')
    state.headerConfig.width = window.getComputedStyle(about).width.replace('px', '')
})
</script>