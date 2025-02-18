<template>
    <div id="notify">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleAction">
        </Header>

        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
                class="fixed top-0"
                :ui="state.confirmBDialogUi"
                @choice="markAllNotifyReadOfCurUser">
            </ConfirmDialogBox>
        </Teleport>

        <div class="max-sm:top-[48px] no-scrollbar overflow-x-auto sticky top-[56px] w-full z-[104]">
            <div
                class="after:bg-primary backdrop-blur-xl bg-white/80 cursor-pointer dark:after:bg-onPrimary dark:bg-[#121212dd] dark:text-white/50 flex flex-row min-w-full tab text-[0.9rem] text-zinc-500 w-fit">
                <div
                    v-for="tab in state.tabs"
                    :key="tab.id"
                    :class="{ 'text-primary dark:text-onPrimary': tab.id === $route.name }"
                    class="flex flex-1 hover:dark:text-onPrimary hover:text-primary items-center justify-center min-w-fit py-2 w-[4.5rem]"
                    @click="$router.replace({ name: tab.id })">
                    {{ `${tab.name} ${tab.count || ''}` }}
                </div>
            </div>
        </div>
        <div id="container">
            <!-- eslint-disable-next-line vue/no-undef-components, vue/component-name-in-template-casing -->
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component
                        :is="Component"
                        :tab="state.tabs.find(it => it.id === $route.name)"
                        :mark-read-tab-id="state.markReadTabId">
                    </component>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<style scoped>
.tab::after {
    content: '';
    width: v-bind(tabAccentWidth);
    translate: v-bind(tabTranslateX);
    height: 2px;
    position: absolute;
    bottom: 0;
    transition: translate 100ms ease-in-out;
}
</style>

<script setup>
import { computed, reactive, watch, defineAsyncComponent } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { useRoute } from 'vue-router'
import Header from '@/indexApp/components/Header.vue'
import { markAllNotifyReadByTypes } from '@/indexApp/js/api.js'
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

const route = useRoute()
const unreadNotifyCount = computed(() => {
    return store.NOTIFY_STATISTIC.map(it => it.unreadCount).reduce((acc, val) => acc + val, 0)
})
const state = reactive({
    headerConfig: {
        title: '消息',
        goBack: false,
        showMenu: true,
        menuIcon: 'checklist',
        width: 0,
        iconTooltip: '全部已读'
    },
    confirmBDialogUi: {
        show: false,
        title: '已读全部消息吗？(已读后不可撤回)',
        confirmButton: {
            selected: false
        },
        cancelButton: {
            selected: false
        },
        loading: {
            show: false
        }
    },
    tabs: [
        { id: 'notify', name: '全部', types: [], count: unreadNotifyCount },
        { id: 'notifyLikeTimelinePage', name: '点赞', types: ['POST_LIKE', 'REVIEW_LIKE'], count: 0 },
        { id: 'notifyReviewTimelinePage', name: '评论', types: ['REVIEW', 'REVIEW_REPLY'], count: 0 },
        { id: 'notifyFanNotifyTimePage', name: '关注', types: ['USER_FOLLOW'], count: 0 },
        { id: 'notifyRepostNotifyTimePage', name: '转发', types: ['REPOST'], count: 0 },
        { id: 'notifyAtSignNotifyTimePage', name: '提及', types: ['AT_SIGN'], count: 0 },
        { id: 'notifySysNotifyTimePage', name: '系统', types: ['SYS_NOTIFY_INFO', 'SYS_NOTIFY_WARNING', 'SYS_NOTIFY_ERROR', 'SYS_NOTIFY_ACTIVITY'], count: 0 }
    ],
    markReadTabId: undefined
})

const tabAccentWidth = computed(() => `${1 / state.tabs.length * 100}%`)

const tabTranslateX = computed(() => {
    const activeIndex = Math.max(state.tabs.findIndex(it => it.id === route.name), 0)
    return `${activeIndex * 100}% 0`
})

async function markAllNotifyReadOfCurUser({ choice }) {
    try {
        state.confirmBDialogUi.loading.show = true
        const { id, count: unreadCount, types, name } = state.tabs.find(it => it.id === route.name)

        if (choice !== 'confirm') return
        if (unreadCount <= 0) {
            store.setWarningMsg(`${name}消息已全部已读, 无需操作！`)
            state.confirmBDialogUi.show = false
            return
        }

        const response = await markAllNotifyReadByTypes(types)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        store.setAllNotifyReadByTypes(types)
        state.markReadTabId = id
        store.setSuccessMsg(`已将${result}条消息设为已读`)
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.confirmBDialogUi.loading.show = false
        state.confirmBDialogUi.show = false
    }
}

function handleAction() {
    state.confirmBDialogUi.show = true
}

// Control tab badge count
watch(() => unreadNotifyCount.value, (newVal, oldVal) => {
    state.tabs.filter(it => it.id !== 'notify').forEach(it => it.count = 0)
    store.NOTIFY_STATISTIC.forEach(it => state.tabs.find(tab => tab.types.includes(it.type)).count += it.unreadCount)
}, { immediate: true })

watch(() => route.name, (newVal, _) => {
    const tab = state.tabs.find(it => it.id === newVal)

    // 更新title
    if(!!route.meta?.title && tab.count > 0){
        document.title = `Icehub-${route.meta.title}(${tab.count})`
    }

    if (!tab || tab.id === 'notifyAllTimelinePage') {
        state.confirmBDialogUi.title = `已读全部消息？`
        state.headerConfig.showMenu = false
        return
    }

    // Change confirmDialogUi title
    state.confirmBDialogUi.title = `已读全部${tab.name}消息？`
}, { immediate: true })
</script>