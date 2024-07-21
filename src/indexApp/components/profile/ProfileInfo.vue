<template>
    <div>
        <div class="absolute p-4 top-0 w-full z-[109]">
            <div
                v-if="state.yourFanStatus === 'WAIT_PASS' && state.showConfirmFollowBanner"
                class="bg-white flex flex-row items-center justify-between px-2 py-2 relative rounded-[8px] text-zinc-500 w-full">
                <div class="flex flex-row items-center justify-center">
                    <div
                        class="material-symbols-rounded no-hover text-[1rem]"
                        @click="state.showConfirmFollowBanner = false">
                        close
                    </div>
                    <div><span class="font-bold text-black">{{ `${props.user.nickname} ` }}</span>想要订阅你</div>
                </div>
                <div
                    class="bg-blue-500 cursor-pointer h-fit px-4 py-1 rounded-full text-[0.9rem] text-white"
                    @click="passFanRequest">
                    <div v-if="!state.confirmFanBtnLoading">批准</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="'h-5 text-white' w-5"></IconLoading>
                </div>
            </div>
        </div>
        <Avatar
            :user="props.user"
            class="border-[4px] border-white h-[5rem] rounded-lg text-[5rem] translate-x-[1rem] w-[5rem]"
            @click="props.user?.avatar?.url ? showSlide([props.user.avatar], 0) : ''">
        </Avatar>
        <div class="flex flex-col gap-y-1 px-[1rem]">
            <div class="flex flex-nowrap flex-row justify-between">
                <div class="flex gap-2 items-center">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="font-bold max-w-[20rem] text-[18pt] w-fit webkit-box-1">{{ props.user.nickname }}</div>
                    <div
                        v-if="props.user.confirmFollow"
                        class="material-symbols-rounded no-hover p-0 text-[1.25rem]">
                        lock
                    </div>
                    <div
                        v-if="props.user.yourFanStatus === 'FAN' && props.user.yourFollowStatus !== 'FOLLOW'"
                        class="bg-blue-100 px-2 rounded-[4px] shrink-0 text-[0.85rem] text-blue-500">
                        订阅了你
                    </div>
                    <div
                        v-if="props.user.yourFanStatus === 'WAIT_PASS'"
                        class="bg-blue-100 px-2 rounded-[4px] shrink-0 text-[0.85rem] text-blue-500">
                        请求订阅你
                    </div>
                </div>
                <div
                    v-if="!isMyself && !props.user.blocking && !props.user.blocked"
                    class="bg-blue-500 cursor-pointer font-bold px-5 py-[0.325rem] rounded-full text-white"
                    :class="followButtonClass"
                    @click="toggleFollowState">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div v-if="!state.followBtnLoading">{{ followButtonText }}</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="'h-5 text-white' w-5"></IconLoading>
                </div>
                <div
                    v-else-if="props.user.blocking && !isMyself"
                    class="bg-red-200 cursor-pointer font-bold px-5 py-[0.325rem] rounded-full text-white"
                    @click="state.confirmBDialogUi.show = true">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div v-if="!state.followBtnLoading" class="text-red-500"> 解除屏蔽 </div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="'h-5 text-white' w-5"></IconLoading>
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
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="">{{ props.user.remark }}</div>
            <div class="flex flex-row gap-x-2 items-center">
                <IconCalendar class="text-[14pt]"></IconCalendar>
                <div>{{ formattedDate }}</div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.user.verified == true" class="flex flex-row gap-x-2 items-center">
                <IconVerify class="h-[1rem] text-blue-500 w-[1rem]"></IconVerify>
                <div>{{ props.user.verifiedInfo }}</div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.user.city" class="flex flex-row gap-x-2 items-center">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconLocation class="text-[14pt]" title="所在城市"></IconLocation>
                <div>{{ props.user.city }}</div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.user.email" class="flex flex-row gap-x-2 items-center">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconEmail class="text-[12pt]" title="电子邮箱"></IconEmail>
                <div>{{ props.user.email }}</div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.user.website" class="flex flex-row gap-x-2 items-center">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconWebsite class="text-[12pt]" title="个人网站"></IconWebsite>
                <a
                    :href="props.user.website"
                    class="hover:decoration-blue-500 hover:text-blue-500 hover:underline">
                    {{ props.user.website }}
                </a>
            </div>
            <div
                v-if="!isPrivateAccountAndNotFollowed || isMyself"
                class="flex flex-row gap-x-6">
                <div
                    class="cursor-pointer hover:underline"
                    @click="routeTo('followList', props.user.nickname)">
                    <span>{{ followCountText }}</span>
                </div>
                <div
                    class="cursor-pointer hover:underline"
                    @click="routeTo('fanList', props.user.nickname)">
                    <span>{{ fanCountText }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.icon {
    width: 1.2rem;
    text-align: center;
    text-align: -webkit-center;
}

.i-icon {
    padding: 0;
    background-color: transparent;
    border-radius: 99rem;
}

.i-icon:hover {
    cursor: auto;
    padding: 0;
    background-color: transparent;
    border-radius: 99rem;
}
</style>

<script setup>
import { reactive, computed, inject } from 'vue'
import { followUser, unFollowUser, deleteOneBlacklist, confirmFanRequest } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'
import IconCalendar from '@/components/icons/IconCalendar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import IconLocation from '@/components/icons/IconLocation.vue'
import IconWebsite from '@/components/icons/IconWebsite.vue'
import IconEmail from '@/components/icons/IconEmail.vue'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'
import Avatar from '@/components/Avatar.vue'
import { standardDate } from '@/indexApp/utils/formatUtils.js'

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
        title: '确定要解除屏蔽吗？',
        confirmButton: {
            text: '解除屏蔽',
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: '保持屏蔽',
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: '解除屏蔽中......',
            color: 'rgb(239 68 68)'
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

const formattedDate = computed(() => {
    const timestamps = props.user.createdTime
    return standardDate(timestamps)
})

const fanCountText = computed(() => {
    const gender = props.user.gender
    const fanCount = props.user.fanCount
    if (isMyself.value == true) return `订阅我的 ${fanCount}`
    if (gender == 'FEMALE') return `订阅她的 ${fanCount}`
    return `订阅他的 ${fanCount}`
})

const followCountText = computed(() => {
    const gender = props.user.gender
    const followCount = props.user.followCount
    if (isMyself.value == true) return `我的订阅 ${followCount}`
    if (gender == 'FEMALE') return `她的订阅 ${followCount}`
    return `他的订阅 ${followCount}`
})

const isMyself = computed(() => {
    return props.user.id == state.curUser.id
})

const isPrivateAccountAndNotFollowed = computed(() => {
    return props.user.confirmFollow && state.yourFollowStatus !== 'FOLLOW'
})

const followButtonText = computed(() => {
    if(state.yourFollowStatus === 'FOLLOW' && state.yourFanStatus === 'FAN') return '相互订阅'
    if(state.yourFollowStatus === 'NOT_FOLLOW' && props.user.confirmFollow) return '请求订阅'
    return state.followTextMap.get(state.yourFollowStatus)
})

const followButtonClass = computed(() => ({
    'bg-blue-500': state.yourFollowStatus === 'NOT_FOLLOW',
    'bg-gray-200': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-zinc-500': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-white': state.yourFollowStatus === 'NOT_FOLLOW'
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
        if (result?.confirmed){
            store.setSuccessMsg("订阅成功！")
            state.yourFollowStatus = 'FOLLOW'
        } else {
            state.yourFollowStatus = 'WAIT_PASS'
        }
    } catch (e) {
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
        store.setErrorMsg(e.message)
    }finally{
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

async function passFanRequest(){
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
        store.setErrorMsg(e.message)
    }finally{
        state.confirmFanBtnLoading = false
    }
}
</script>