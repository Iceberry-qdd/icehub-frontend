<template>
    <div>
        <div class="absolute p-4 sm:z-[1002] top-0 w-full z-[109]">
            <div
                v-if="state.yourFanStatus === 'WAIT_PASS' && state.showConfirmFollowBanner"
                class="bg-white dark:bg-neutral-800 flex flex-row items-center justify-between px-2 py-2 relative rounded-[8px] w-full">
                <div class="flex flex-row items-center justify-center">
                    <div
                        class="material-symbols-rounded no-hover text-[1rem]"
                        @click="state.showConfirmFollowBanner = false">
                        close
                    </div>
                    <div>
                        <span class="font-bold">{{ `${props.user.nickname} ` }}</span>
                        <span class="text-neutral-400">想要订阅你</span>
                    </div>
                </div>
                <div
                    class="bg-primary cursor-pointer h-fit px-4 py-1 rounded-full text-[0.9rem] text-onPrimary"
                    @click="passFanRequest">
                    <div v-if="!state.confirmFanBtnLoading">批准</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="dark:text-white/50 h-5 text-onPrimary w-5"></IconLoading>
                </div>
            </div>
        </div>
        <Avatar
            :user="props.user"
            class="border-[4px] border-white dark:border-[#121212] h-[5rem] rounded-lg text-[5rem] translate-x-[1rem] w-[5rem]"
            @click="props.user?.avatar?.url ? showSlide([props.user.avatar], 0) : ''">
        </Avatar>
        <div class="flex flex-col gap-y-1 px-[1rem]">
            <div class="flex flex-nowrap flex-row gap-x-2 justify-between">
                <div class="flex gap-2 items-center">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="font-bold max-w-[20rem] text-[18pt] w-fit webkit-box-1">{{ props.user.nickname }}</div>
                    <div
                        v-if="props.user.confirmFollow"
                        class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1.25rem]">
                        lock
                    </div>
                    <div
                        v-if="props.user.yourFanStatus === 'FAN' && props.user.yourFollowStatus !== 'FOLLOW'"
                        class="bg-primaryContainer dark:text-white/50 px-2 rounded-[4px] shrink-0 text-[0.85rem] text-primary">
                        订阅了你
                    </div>
                    <div
                        v-if="props.user.yourFanStatus === 'WAIT_PASS'"
                        class="bg-primaryContainer dark:text-white/50 px-2 rounded-[4px] shrink-0 text-[0.85rem] text-primary">
                        请求订阅你
                    </div>
                </div>
                <div
                    v-if="!isMyself && !props.user.blocking && !props.user.blocked"
                    class="cursor-pointer flex-none font-bold px-5 py-[0.325rem] rounded-full"
                    :class="followButtonClass"
                    @click="toggleFollowState">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div v-if="!state.followBtnLoading">{{ followButtonText }}</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="dark:text-white/50 h-5 text-white w-5"></IconLoading>
                </div>
                <div
                    v-else-if="props.user.blocking && !isMyself"
                    class="bg-red-200 cursor-pointer dark:bg-neutral-800 flex-none font-bold px-5 py-[0.325rem] rounded-full"
                    @click="state.confirmBDialogUi.show = true">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div v-if="!state.followBtnLoading" class="dark:text-red-300 text-red-500"> 解除屏蔽 </div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="dark:text-white/50 h-5 text-white w-5"></IconLoading>
                    <Teleport to="#app">
                        <ConfirmDialogBox
                            v-if="state.confirmBDialogUi.show"
                            class="fixed top-0"
                            :ui="state.confirmBDialogUi"
                            @choice="choose">
                        </ConfirmDialogBox>
                    </Teleport>
                </div>
            </div>
            <div class="dark:text-white/50 flex flex-col gap-y-1 text-[0.85rem] text-neutral-600">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div>{{ props.user.remark }}</div>
                <div class="gap-x-2 gap-y-1 grid grid-cols-[1rem_auto] info-list w-fit">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconVerify v-if="props.user.verified" class="dark:text-onPrimary h-[0.9rem] text-primary w-[0.9rem]"></IconVerify>
                    <div v-if="props.user.verified">{{ props.user.verifiedInfo }}</div>

                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span v-if="props.user.address" class="cursor-default material-symbols-rounded no-hover">location_on</span>
                    <div v-if="props.user.address">{{ props.user.address }}</div>

                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span v-if="props.user.email" class="cursor-default material-symbols-rounded no-hover">mail</span>
                    <div v-if="props.user.email">{{ props.user.email }}</div>

                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span v-if="props.user.website" class="cursor-default material-symbols-rounded no-hover">link</span>
                    <a
                        v-if="props.user.website"
                        :href="props.user.website"
                        class="dark:hover:decoration-primaryContainer dark:hover:text-onPrimary hover:decoration-primary hover:text-primary hover:underline">
                        {{ props.user.website }}
                    </a>
                </div>
                <div
                    v-if="!isPrivateAccountAndNotFollowed || isMyself"
                    class="bg-gray-50 dark:bg-[#1e1e1e] grid grid-cols-3 place-items-stretch rounded-md w-full">
                    <div
                        v-for="({name, alias, value, routePath}) in statCardData"
                        :key="name"
                        class="active:bg-gray-200 active:dark:bg-neutral-700 col-span-1 cursor-pointer first:rounded-l-md last:rounded-r-md place-items-center py-2 text-[0.85rem]"
                        @click="!!routePath ? routeTo(routePath, props.user.name): undefined">
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <div class="font-bold">{{ value }}</div>
                        <div>{{ alias }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.grid.info-list>*:nth-child(odd){
    font-size: 1.125rem;
    padding: 0;
    place-self: center;
}

.grid>.material-symbols-rounded{
    color: #525252;
}

.grid>.material-symbols-rounded:where([theme="dark"], [theme="dark"] *){
    color: rgba(255, 255, 255, 0.5);
}
</style>

<script setup>
import { reactive, computed, inject, defineAsyncComponent } from 'vue'
import { followUser, unFollowUser, deleteOneBlacklist, confirmFanRequest } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'
import Avatar from '@/components/Avatar.vue'
import { humanizedTime, humanizedNumber } from '@/indexApp/utils/formatUtils.js'
const IconVerify = defineAsyncComponent(() => import('@/components/icons/IconVerify.vue'))
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

const { refreshProfileOnUi } = inject('refreshProfileOnUi')
const router = useRouter()
const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    yourFollowStatus: props.user.yourFollowStatus,
    yourFanStatus: props.user.yourFanStatus,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    followBtnLoading: false,
    confirmFanBtnLoading: false,
    confirmBDialogUi: {
        show: false,
        title: '解除屏蔽此用户？',
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
    followTextMap: new Map([
        ['NOT_FOLLOW', '订阅'],
        ['WAIT_PASS', '等待批准'],
        ['FOLLOW', '已订阅'],
        [undefined, '订阅']
    ]),
    showConfirmFollowBanner: true
})

const genderCall = computed(() => {
    const gender = state.user?.gender
    if (isMyself.value) return '我'
    if (gender == 'FEMALE') return '她'
    return '他'
})

const statCardData = computed(() => {
    const { fanCount, followCount, createdTime } = props.user
    return [
        { name: 'fanCount', value: humanizedNumber(fanCount), routePath: 'fanList', alias: `订阅${genderCall.value}` },
        { name: 'followCount', value: humanizedNumber(followCount), routePath: 'followList', alias: `${genderCall.value}订阅` },
        { name: 'joinAt', value: humanizedTime(createdTime), routePath: undefined, alias: '加入于' }
    ]
})

const isMyself = computed(() => {
    return props.user.id == state.curUser.id
})

const isPrivateAccountAndNotFollowed = computed(() => {
    return props.user.confirmFollow && state.yourFollowStatus !== 'FOLLOW'
})

const followButtonText = computed(() => {
    if (state.yourFollowStatus === 'FOLLOW' && state.yourFanStatus === 'FAN') return '相互订阅'
    if (state.yourFollowStatus === 'NOT_FOLLOW' && props.user.confirmFollow) return '请求订阅'
    return state.followTextMap.get(state.yourFollowStatus)
})

const followButtonClass = computed(() => ({
    'bg-primary': state.yourFollowStatus === 'NOT_FOLLOW',
    'bg-gray-200 dark:bg-neutral-800': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-zinc-500 dark:text-white/25': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-onPrimary': state.yourFollowStatus === 'NOT_FOLLOW'
}))

function routeTo(routeName, routeParam) {
    router.push({ name: routeName, params: { nickname: routeParam } })
}

function toggleFollowState() {
    const userId = props.user.id
    if (state.yourFollowStatus !== 'NOT_FOLLOW') {
        unFollowAUser(userId)
    } else {
        followAUser(userId)
    }
}

async function followAUser(userId) {
    state.followBtnLoading = true
    try {
        const response = await followUser(userId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result?.confirmed) {
            store.setSuccessMsg("订阅成功！")
            state.yourFollowStatus = 'FOLLOW'
        } else {
            state.yourFollowStatus = 'WAIT_PASS'
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.followBtnLoading = false
    }
}

async function unFollowAUser(userId) {
    state.followBtnLoading = true
    try {
        const response = await unFollowUser(userId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.yourFollowStatus = 'NOT_FOLLOW'
        store.setSuccessMsg("取消订阅成功！")
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.followBtnLoading = false
    }
}

function showSlide(images, idx) {
    store.showSlide(images, idx)
}

async function unblockUser() {
    try {
        state.confirmBDialogUi.loading.show = true
        const response = await deleteOneBlacklist('USER', props.user.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result) {
            store.setSuccessMsg('已解除屏蔽此用户')
            refreshProfileOnUi()
        } else {
            throw new Error("解除屏蔽失败！")
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.confirmBDialogUi.loading = false
        state.confirmBDialogUi.show = false
    }
}

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        unblockUser()
    } else {
        state.confirmBDialogUi.show = false
    }
}

async function passFanRequest() {
    try {
        state.confirmFanBtnLoading = true
        const response = await confirmFanRequest(props.user.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result) {
            store.setSuccessMsg('已通过该用户的订阅请求')
            state.yourFanStatus = 'FAN'
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.confirmFanBtnLoading = false
    }
}
</script>