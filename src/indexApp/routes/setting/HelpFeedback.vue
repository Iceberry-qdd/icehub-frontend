<template>
    <div id="setting-help-and-feedback">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder"
            :menu-action="state.headerConfig.menuAction">
        </Header>
        <div>帮助与反馈</div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import { store } from '@/indexApp/js/store.js'

const state = reactive({
    headerConfig: {
        title: '帮助与反馈',
        goBack: computed(() => store.PAD_MODE || store.MOBILE_MODE),
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        noBorder: true
    }
})
</script>