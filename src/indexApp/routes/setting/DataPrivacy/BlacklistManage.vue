<template>
    <div id="setting-data-and-privacy">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder"
            @handle-action="state.confirmBDialogUi.show = true">
        </Header>
        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
                class="fixed top-0"
                :ui="state.confirmBDialogUi"
                @choice="choose">
            </ConfirmDialogBox>
        </Teleport>
        <TransitionGroup name="users">
            <UserBlacklistItem
                v-for="user in state.blacklist"
                :key="user.id"
                :user="user"
                @delete-on-ui="deleteOnUi">
            </UserBlacklistItem>
        </TransitionGroup>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNew">
        </Footer>
    </div>
</template>

<style scoped>
.users-move,
.users-enter-active,
.users-leave-active {
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.users-enter-from,
.users-leave-to {
    opacity: 0;
}

.users-leave-active {
    position: absolute;
    width: 100%;
    height: fit-content;
}
</style>

<script setup>
import { reactive, computed, onMounted, defineAsyncComponent } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { deleteAllBlacklistByType, getBlacklist } from '@/indexApp/js/api.js'
import Header from '@/indexApp/components/Header.vue'
import Footer from '@/indexApp/components/Footer.vue'
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))
const UserBlacklistItem = defineAsyncComponent(() => import('@/indexApp/components/setting/dataPrivacy/UserBlacklistItem.vue'))

const state = reactive({
    headerConfig: {
        title: '黑名单管理',
        goBack: true,
        showMenu: true,
        menuIcon: 'checklist',
        noBorder: false
    },
    blacklist: [],
    type: 'USER',
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    lastTimestamp: new Date().getTime(),
    isLoading: false,
    confirmBDialogUi: {
        show: false,
        title: '清空黑名单列表？',
        confirmButton: {
            selected: false
        },
        cancelButton: {
            selected: false
        },
        loading: {
            show: false
        }
    }
})


const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function fetchUserBlacklist() {
    try {
        state.isLoading = true
        const response = await getBlacklist(state.type, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        state.blacklist.push(...content)
        state.totalPages = totalPages
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

function deleteOnUi(userId){
    const index = state.blacklist.findIndex(it => it.id === userId)
    if(index !== -1){
        state.blacklist.splice(index, 1)
    }
}

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        unblockAllUser()
    } else {
        state.confirmBDialogUi.show = false
    }
}

async function unblockAllUser() {
    try {
        state.confirmBDialogUi.loading.show = true
        const response = await deleteAllBlacklistByType('USER')
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        store.setSuccessMsg(`已将${result}位用户移出黑名单！`)
        deleteAllOnUi()
    } catch (e) {
        store.setErrorMsg(e.message)
    }finally{
        state.confirmBDialogUi.loading = false
        state.confirmBDialogUi.show = false
    }
}

function deleteAllOnUi(){
    state.blacklist.splice(0)
}

function fetchNew() {
    fetchUserBlacklist()
}

onMounted(() => {
    fetchUserBlacklist()
})
</script>