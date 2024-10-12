<template>
    <div id="setting-data-and-privacy">
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
            :activity="activity">
        </AccountActivityItem>
        <div>
            <div class="cursor-default px-4 py-2 text-[0.9rem] text-neutral-500">历史活动</div>
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
        @fetch-more="fetchMoreItems">
    </Footer>
</template>

<script setup>
import { computed, reactive } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import AccountActivityItem from '@/indexApp/components/setting/accountSafe/AccountActivityItem.vue'
import Footer from '@/indexApp/components/Footer.vue'

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
    activities: [
        {id: 1, timestamp: Date.now(), device: {type: 'DESKTOP_WINDOWS', name: 'LAPTOP-3AEH3R0D(Chrome128.0.10.2)'}, ip: {country: '中国', province: '北京市'}, isActive: true, isLocal: true},
        {id: 1, timestamp: Date.now(), device: {type: 'MOBILE_IPHONE', name: 'qdd的iPhone(Safari-9.5.16)'}, ip: {country: '中国', province: '四川省'}, isActive: true, isLocal: true},
        {id: 1, timestamp: Date.now(), device: {type: 'DESKTOP', name: 'LAPTOP-3AEH3R0D(APP-1.0.9.1)'}, ip: {country: '美国', province: '纽约州'}, isActive: false, isLocal: true}
    ],
    isLoading: false
})

const activeActivities = computed(() => {
    return state.activities.filter(it => it.isActive === true)
})

const inactiveActivities = computed(() => {
    return state.activities.filter(it => it.isActive === false)
})

const hasMore = computed(() => {
    return false
})

function fetchMoreItems(){
    //TODO
}
</script>