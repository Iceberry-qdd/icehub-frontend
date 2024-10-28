<template>
    <div id="setting-notify-and-message">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder">
        </Header>
        <div>
            <NativeNotifyAction
                :checked="state.setting.enableNativeNotify"
                :enabled="!state.setting.enableNativeNotify"
                @toggle="state.setting.enableNativeNotify = !state.setting.enableNativeNotify">
            </NativeNotifyAction>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import NativeNotifyAction from '@/indexApp/components/setting/notifyMsg/NativeNotifyAction.vue'
import { store } from '@/indexApp/js/store.js'

const state = reactive({
    headerConfig: {
        title: '消息通知',
        goBack: computed(() => store.PAD_MODE || store.MOBILE_MODE),
        showMenu: false,
        menuIcon: undefined,
        noBorder: false
    },
    setting: {
        enableNativeNotify: Notification.permission === 'granted'
    }
})
</script>