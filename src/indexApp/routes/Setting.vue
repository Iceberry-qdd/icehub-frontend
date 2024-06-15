<template>
    <div class="divide-x flex flex-nowrap flex-row relative">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div id="setting" class="basis-[40%] h-screen">
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
            <div class="text-[#303133]">
                <div
                    v-for="menu in state.menus"
                    :key="menu.id"
                    :class="[menu.isActive ? 'bg-[#f4f4f5] border-l-[#3b82f6] border-l-4 pl-[calc(1rem-4px)]' : '']"
                    class="cursor-pointer flex flex-row hover:bg-[#f4f4f5] items-center justify-between px-4 py-4 text-[12pt]"
                    @click="routeTo(menu.routeTo)">
                    <div>{{ menu.name }}</div>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="cursor-pointer material-icons-round mr-[0.5rem] text-[12pt]">arrow_forward_ios</div>
                </div>
            </div>
        </div>
        <div class="basis-[70%] h-screen">
            <!-- eslint-disable-next-line vue/component-name-in-template-casing, vue/no-undef-components -->
            <router-view></router-view>
        </div>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div id="placeholder" class="basis-[15%] h-screen" />
    </div>
</template>

<style scoped>
.material-icons-round {
    font-size: 12pt;
    padding: 0;
    margin: 0;
    color: #303133;
}

.material-icons-round:hover {
    background-color: transparent;
    padding: 0;
}
</style>

<script setup>
import { reactive } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const state = reactive({
    headerConfig: {
        title: '设置',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        noBorder: true
    },
    menus: [
        { id: 1, name: '账号与安全', routeTo: 'account&safe', isActive: route.params == 'accountSafe' },
        { id: 2, name: '消息通知', routeTo: 'notify&msg', isActive: route.params == 'notifyMsg' },
        { id: 3, name: '数据与隐私', routeTo: 'data&privacy', isActive: route.params == 'dataPrivacy' },
        { id: 4, name: '界面个性化设置', routeTo: 'display&theme', isActive: route.params == 'displayTheme' },
        { id: 5, name: '帮助与反馈', routeTo: 'help&feedback', isActive: route.params == 'helpFeedback' },
        { id: 6, name: '关于', routeTo: 'about', isActive: route.params == 'about' }
    ]
})

function routeTo(url) {
    state.menus.forEach(menu => menu.isActive = false)
    state.menus.filter(menu => menu.routeTo == url)[0].isActive = true
    router.push(`/setting/${url}`)
}
</script>