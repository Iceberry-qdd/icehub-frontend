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
        <BlacklistItem
            v-for="user in state.blacklist"
            :key="user.id"
            :user="user">
        </BlacklistItem>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewList">
        </Footer>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import BlacklistItem from '@/indexApp/components/setting/dataPrivacy/BlacklistItem.vue'
import Footer from '@/indexApp/components/Footer.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const state = reactive({
    headerConfig: {
        title: '黑名单管理',
        goBack: true,
        showMenu: true,
        menuIcon: 'checklist',
        noBorder: false
    },
    blacklist: [],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    lastTimestamp: new Date().getTime(),
    nickname: undefined,
    isLoading: false
})


const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

function fetchNewList() {
}

onMounted(() => {
    const nickname = route.params.nickname
    state.nickname = nickname

    const mockUser = JSON.parse(localStorage.getItem('CUR_USER'))
    for (let i = 0; i < 10; i++) {
        mockUser.id = `${mockUser.id}-${i}`
        state.blacklist.push(mockUser)
    }
})
</script>