<template>
    <div class="relative flex flex-row flex-nowrap divide-x">
        <div id="setting" class="basis-[40%] h-screen">
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
            <div class="text-[#303133]">
                <div v-for="menu in state.menus" :key="menu.id"
                    @click="routeTo(menu.routeTo)"
                    :class="[menu.isActive?'bg-[#f4f4f5] border-l-[#3b82f6] border-l-4 pl-[calc(1rem-4px)]':'']"
                    class="flex flex-row justify-between items-center px-4 py-4 text-[12pt] hover:bg-[#f4f4f5] cursor-pointer">
                    <div>{{ menu.name }}</div>
                    <div class="material-icons-round cursor-pointer text-[12pt] mr-[0.5rem]">arrow_forward_ios</div>
                </div>
            </div>
        </div>
        <div class="basis-[70%] h-screen">
            <router-view></router-view>
        </div>
        <div id="placeholder" class="basis-[15%] h-screen"></div>
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
import { onMounted, reactive, onUnmounted, computed } from 'vue'
import Header from '@/components/tailwind/Header.vue'
import router from '@/route.js'
import { useRoute } from 'vue-router'

const $route = useRoute()

const state = reactive({
    headerConfig: {
        title: '设置',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        width: 0,
        noBorder: true
    },
    menus: [
        { id: 1, name: '账号与安全', routeTo: 'account&safe', isActive: $route.name == 'accountSafe' },
        { id: 2, name: '消息通知', routeTo: 'notify&msg', isActive: $route.name == 'notifyMsg' },
        { id: 3, name: '数据与隐私', routeTo: 'data&privacy', isActive: $route.name == 'dataPrivacy' },
        { id: 4, name: '界面个性化设置', routeTo: 'display&theme', isActive: $route.name == 'displayTheme' },
        { id: 5, name: '帮助与反馈', routeTo: 'help&feedback', isActive: $route.name == 'helpFeedback' },
        { id: 6, name: '关于', routeTo: 'about', isActive: $route.name == 'about' }
    ]
})

function routeTo(url){
    state.menus.forEach(menu => menu.isActive = false)
    state.menus.filter(menu => menu.routeTo == url)[0].isActive = true
    router.push(`/setting/${url}`)
}

onMounted(() => {
    const setting = document.getElementById('setting')
    state.headerConfig.width = window.getComputedStyle(setting).width.replace('px', '')
})
</script>