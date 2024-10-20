<template>
    <div class="divide-x flex flex-nowrap flex-row modern-scrollbar-y overflow-y-auto relative">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div id="setting" class="basis-[30%] h-screen">
            <Header
                class="sticky"
                :title="state.headerConfig.title"
                :go-back="state.headerConfig.goBack"
                :show-menu="state.headerConfig.showMenu"
                :menu-icon="state.headerConfig.menuIcon"
                :no-border="state.headerConfig.noBorder">
            </Header>
            <div class="cursor-pointer text-[#303133]">
                <div
                    v-for="menu in state.menus"
                    :key="menu.id"
                    :class="{'bg-[#f4f4f5] border-l-primary dark:border-l-onPrimary border-l-4 pl-[calc(1rem-4px)]': [$route.name, $route.meta?.parent].includes(menu.id)}"
                    class="flex flex-row hover:bg-[#f4f4f5] items-center justify-between px-4 py-4 text-[12pt]"
                    @click="routeTo(menu.id)">
                    <div class="flex flex-row gap-x-2 items-center">
                        <span class="material-symbols-rounded no-hover p-0">{{ menu.icon }}</span>
                        <span>{{ menu.name }}</span>
                    </div>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="material-symbols-rounded no-hover p-0 text-[1rem]">arrow_forward_ios</div>
                </div>
            </div>
        </div>
        <div class="basis-[50%] h-screen no-scrollbar overflow-y-auto">
            <!-- eslint-disable-next-line vue/no-undef-components, vue/component-name-in-template-casing -->
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component
                        :is="Component"
                        :key="$route.name"
                        @route-to="(name) => routeTo(name)">
                    </component>
                </keep-alive>
            </router-view>
        </div>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div id="placeholder" class="basis-[20%] h-screen" />
    </div>
</template>

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
        menuIcon: undefined,
        noBorder: true
    },
    menus: [
        { id: "accountSafe", name: '账号与安全', icon:"shield_person" },
        { id: "notifyMsg", name: '消息通知', icon:"notifications" },
        { id: "dataPrivacy", name: '数据与隐私', icon:"encrypted" },
        { id: "displayTheme", name: '界面个性化设置', icon:"palette" },
        { id: "helpFeedback", name: '帮助与反馈', icon:"help" },
        { id: "about", name: '关于', icon:"info" }
    ]
})

function routeTo(name) {
    router.push({ name: name })
}
</script>