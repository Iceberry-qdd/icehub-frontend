<template>
    <div>
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleAction">
        </Header>
    </div>
</template>

<script setup>
import Header from '@/indexApp/components/Header.vue'
import {reactive } from 'vue'

const state = reactive({
    headerConfig: {
        title: '管理',
        goBack: false,
        showMenu: false,
        menuIcon: 'checklist',
        width: 0,
        iconTooltip: '全部已读'
    }
})

function handleAction(){
    console.log('管理')
}
</script>