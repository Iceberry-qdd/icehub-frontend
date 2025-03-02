<template>
    <div id="setting-account-and-safe">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder">
        </Header>
        <AccountActivityItem
            v-for="activity in activeActivities"
            :key="activity.id"
            :activity="activity"
            active>
        </AccountActivityItem>
        <div>
            <div class="cursor-default px-4 py-2 text-[0.9rem] text-neutral-500">
                历史活动
            </div>
            <AccountActivityItem
                v-for="activity in inactiveActivities"
                :key="activity.id"
                :activity="activity">
            </AccountActivityItem>
        </div>
    </div>
    <Footer
        :is-loading="state.isLoading"
        :has-more="hasMore"
        placeholder="仅显示最近30天的记录"
        @fetch-more="fetchActivities">
    </Footer>
</template>

<script setup>
import { computed, onMounted, reactive, defineAsyncComponent } from 'vue'
import { UAParser } from 'ua-parser-js'
import { getActivities } from '@/indexApp/js/api.js'
import Header from '@/indexApp/components/Header.vue'
import Footer from '@/indexApp/components/Footer.vue'
const AccountActivityItem = defineAsyncComponent(() => import('@/indexApp/components/setting/accountSafe/AccountActivityItem.vue'))

// XXX 仅为消除控制台警告，无实际意义
// eslint-disable-next-line vue/no-unused-emit-declarations
const emits = defineEmits(['routeTo', 'updateTabCount'])
// XXX 以下props仅为消除控制台警告，无实际意义
const props = defineProps({
    /** 表示从哪个tab路由过来的 */
    // eslint-disable-next-line vue/no-unused-properties
    tab: {
        type: Object,
        required: false,
        default: undefined
    },
    /** 需要标记所有消息为已读的tab id */
    // eslint-disable-next-line vue/no-unused-properties
    markReadTabId: {
        type: String,
        required: false,
        default: undefined
    },
    /** 表明是谁的主页 */
    // eslint-disable-next-line vue/no-unused-properties
    user: {
        type: Object,
        required: false,
        default: undefined
    },
})
const state = reactive({
    headerConfig: {
        title: '账号活动记录',
        goBack: true,
        showMenu: false,
        menuIcon: undefined,
        noBorder: false
    },
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    lastTimestamp: new Date().getTime(),
    activities: [],
    isLoading: false
})

const activeActivities = computed(() => {
    return state.activities.slice(0,1)
})

const inactiveActivities = computed(() => {
    return state.activities.slice(1)
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function fetchActivities() {
    try {
        state.isLoading = true
        const response = await getActivities(state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        content.map(it => it['ua'] = UAParser(it.userAgent))
        state.activities.push(...content)
        state.totalPages = totalPages
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

onMounted(() => {
    fetchActivities()
})
</script>