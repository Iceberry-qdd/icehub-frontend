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
            v-if="!state.isLoading && emptyPasskeys"
            class="m-4 max-sm:m-3">
        </PasskeyEmptyPage>
        <div
            v-else
            class="dark:divide-[#1E1E1E] divide-y-[1px]">
            <TransitionGroup name="passkeys">
                <PasskeyItem
                    v-for="item in state.passkeys"
                    :key="item.id"
                    :passkey="item"
                    class="cursor-default p-2"
                    @delete-on-ui="deleteOnUi"
                    @new-named-passkey="handleNewNamedPasskey">
                </PasskeyItem>
            </TransitionGroup>
        </div>
        <Footer
            v-if="!emptyPasskeys || state.isLoading"
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNew">
        </Footer>
        <Teleport to="#app">
            <PasskeyCreateDialog
                v-if="state.showCreateDialog"
                class="fixed top-0"
                @close="state.showCreateDialog = false"
                @new-passkey-on-ui="handleNewPasskeyOnUi">
            </PasskeyCreateDialog>
        </Teleport>
    </div>
</template>

<style scoped>
.passkeys-move,
.passkeys-enter-active,
.passkeys-leave-active {
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.passkeys-enter-from,
.passkeys-leave-to {
    opacity: 0;
}

.passkeys-leave-active {
    position: absolute;
    width: 100%;
    height: fit-content;
}
</style>

<script setup>
import { computed, onMounted, reactive, defineAsyncComponent, watch } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import Footer from '@/indexApp/components/Footer.vue'
import { store } from '@/indexApp/js/store.js'
import { fetchPasskeys } from '@/indexApp/js/api'
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

watch(() => state.passkeys.length, (newVal, _) => {
    state.headerConfig.showMenu = newVal > 0
}, { immediate: true })

async function tryFetchPasskeys() {
    state.isLoading = true
    try {
        const response = await fetchPasskeys(state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        state.passkeys.push(...content)
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

async function deleteOnUi({id, credentialId}) {
    const index = state.passkeys.findIndex(it => it.id === id)
    if (index !== -1) {
        state.passkeys.splice(index, 1)
    }

    if (PublicKeyCredential.signalUnknownCredential) {
        await PublicKeyCredential.signalUnknownCredential({
            rpId: location.hostname,
            credentialId: credentialId
        })
    }
}

function handleNewNamedPasskey({ id, name, updatedTime }) {
    const passkey = state.passkeys.find(it => it.id === id)
    passkey.name = name
    passkey.updatedTime = updatedTime
}

function createPasskey() {
    state.showCreateDialog = true
}

function handleNewPasskeyOnUi(passkey) {
    state.passkeys.unshift(passkey)
    state.showCreateDialog = false
}

function fetchNew() {
    tryFetchPasskeys()
}

onMounted(() => {
    tryFetchPasskeys()
})
</script>