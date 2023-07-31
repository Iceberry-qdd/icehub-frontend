<template>
    <div id="setting-account-and-safe">
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
        <div>账号与安全</div>
    </div>
</template>

<style scoped></style>

<script setup>
import { onMounted, reactive, onUnmounted, computed, ref } from 'vue'
import Header from '@/components/tailwind/Header.vue'

const state = reactive({
    headerConfig: {
        title: '账号与安全',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        width: 0,
        noBorder: true
    }
})

onMounted(() => {
    const accountSafe = document.getElementById('setting-account-and-safe')
    state.headerConfig.width = window.getComputedStyle(accountSafe).width.replace('px', '')
})
</script>