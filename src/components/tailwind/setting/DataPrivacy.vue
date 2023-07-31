<template>
    <div id="setting-data-and-privacy">
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
        <div>数据与隐私</div>
    </div>
</template>

<style scoped></style>

<script setup>
import { onMounted, reactive, onUnmounted, computed, ref } from 'vue'
import Header from '@/components/tailwind/Header.vue'

const state = reactive({
    headerConfig: {
        title: '数据与隐私',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        width: 0,
        noBorder: true
    }
})

onMounted(() => {
    const dataPrivacy = document.getElementById('setting-data-and-privacy')
    state.headerConfig.width = window.getComputedStyle(dataPrivacy).width.replace('px', '')
})
</script>