<template>
    <div id="setting-display-and-theme">
        <Header
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
import { reactive } from 'vue'
import Header from '@/components/tailwind/Header.vue'

const state = reactive({
    headerConfig: {
        title: '界面个性化设置',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        noBorder: true
    }
})
</script>