<template>
    <div id="setting-account-and-safe">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :no-border="state.headerConfig.noBorder"
            @handle-action="createPasskey">
        </Header>
        <PasskeyEmptyPage
            v-if="emptyPasskeys"
            class="m-4 max-sm:m-3">
        </PasskeyEmptyPage>
        <div
            v-else
            class="dark:divide-[#1E1E1E] divide-y-[1px]">
            <PasskeyItem
                v-for="item in state.passkeys"
                :key="item.id"
                :passkey="item"
                class="cursor-default p-2"
                @delete-on-ui="deleteOnUi"
                @new-name="handleNewName">
            </PasskeyItem>
        </div>
        <Footer
            v-if="!emptyPasskeys"
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchPasskeys">
        </Footer>
        <Teleport to="#app">
            <PasskeyCreateDialog
                v-if="state.showCreateDialog"
                class="fixed top-0"
                @close="state.showCreateDialog = false">
            </PasskeyCreateDialog>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, defineAsyncComponent } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import Footer from '@/indexApp/components/Footer.vue'
import { store } from '@/indexApp/js/store.js'
const PasskeyEmptyPage = defineAsyncComponent(() => import('@/indexApp/components/setting/accountSafe/PasskeyEmptyPage.vue'))
const PasskeyItem = defineAsyncComponent(() => import('@/indexApp/components/setting/accountSafe/PasskeyItem.vue'))
const PasskeyCreateDialog = defineAsyncComponent(() => import('@/indexApp/components/setting/accountSafe/PasskeyCreateDialog.vue'))

const state = reactive({
    headerConfig: {
        title: '通行密钥',
        goBack: true,
        showMenu: true,
        menuIcon: 'add',
        noBorder: false
    },
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    lastTimestamp: new Date().getTime(),
    passkeys: [],
    isLoading: false,
    showCreateDialog: false
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

const emptyPasskeys = computed(() => {
    return state.passkeys.length === 0
})

// TODO
async function fetchPasskeys() {
    try {
        state.isLoading = true
        setTimeout(() => {
            store.setSuccessMsg('加载列表成功！')
        }, 3000)
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

function deleteOnUi(id) {
    const index = state.passkeys.findIndex(it => it.id === id)
    if (index !== -1) {
        state.passkeys.splice(index, 1)
    }
}

function handleNewName(id, newName) {
    state.passkeys.find(it => it.id === id).name = newName
}

function createPasskey() {
    state.showCreateDialog = true
}

onMounted(() => {
    fetchPasskeys()
})
</script>