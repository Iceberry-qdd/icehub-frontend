<template>
    <div class="bg-white max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] ring-1 ring-slate-900/5 rounded-[8px] shadow-lg">
        <Banner
            :user="state.user"
            class="h-[6rem] max-sm:aspect-[5/2] max-sm:h-auto max-sm:rounded-t-[0.75rem] object-cover rounded-t-[8px] w-full"
            @click="routeToProfile">
        </Banner>
        <div class="-mt-[calc(3.5rem/2)] flex-col gap-y-1 max-sm:flex max-sm:mb-4 mb-2 mx-4 relative">
            <div class="flex flex-row items-end justify-between">
                <Avatar
                    :user="state.user"
                    class="border-[0.2rem] border-white h-[3.5rem] rounded-[8px] text-[3.5rem] w-[3.5rem]">
                </Avatar>
                <div class="flex flex-row gap-x-2 sm:text-[0.8rem]">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div class="cursor-pointer hover:underline" @click="routeToFanList">{{ fanCountText }}</div>
                    <span>|</span>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div class="cursor-pointer hover:underline" @click="routeToFollowList">{{ followCountText }}</div>
                </div>
            </div>
            <div class="flex flex-row gap-x-1 items-center">
                <div
                    class="cursor-pointer font-bold hover:underline text-[1.1rem] webkit-box-1"
                    @click="routeToProfile">
                    {{ state.user.nickname }}
                </div>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconVerify v-if="state.user.verified" class="h-[0.9rem] text-blue-500 w-[0.9rem]"></IconVerify>
                <div
                    v-if="state.user.confirmFollow"
                    class="material-symbols-rounded no-hover p-0 text-[1rem]">
                    lock
                </div>
                <div
                    v-if="state.user.yourFanStatus === 'FAN' && state.user.yourFollowStatus !== 'FOLLOW'"
                    class="bg-blue-100 px-2 rounded-[4px] shrink-0 text-[0.85rem] text-blue-500">
                    订阅了你
                </div>
                <div
                    v-if="state.user.yourFanStatus === 'WAIT_PASS'"
                    class="bg-blue-100 px-2 rounded-[4px] shrink-0 text-[0.85rem] text-blue-500">
                    请求订阅你
                </div>
            </div>
            <div class="flex flex-nowrap flex-row items-center">
                <div
                    :class="{'webkit-box-1': !store.MOBILE_MODE}"
                    class="flex-1 max-sm:max-h-[12rem] max-sm:overflow-y-auto sm:text-[0.85rem]">
                    {{ brief }}
                </div>
                <div
                    v-if="!isCurUser && !store.MOBILE_MODE && state.user.yourFollowStatus !== 'FOLLOW'"
                    :class="followBtnClass"
                    class="cursor-pointer flex flex-none h-auto items-center justify-center min-w-[4.5rem] px-2 py-[0.25rem] rounded-full text-[0.9rem]"
                    @click="toggleFollowState">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div v-if="!state.loading"> {{ followButtonText }}</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="h-5 text-white w-5"></IconLoading>
                </div>
            </div>
            <div class="flex flex-row gap-x-4 items-center justify-center">
                <div
                    :class="profileButtonClass"
                    class="flex-1 py-2 rounded-full sm:hidden text-center"
                    @click="routeToProfile(props.user.nickname)">
                    查看个人资料
                </div>
                <div
                    v-if="!isCurUser && store.MOBILE_MODE && state.user.yourFollowStatus !== 'FOLLOW'"
                    :class="followBtnClass"
                    class="cursor-pointer flex flex-1 items-center justify-center py-2 rounded-full"
                    @click="toggleFollowState">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div v-if="!state.loading"> {{ followButtonText }}</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="'h-5 text-white' w-5"></IconLoading>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

@media not all and (min-width: 640px) {
    .fade-enter-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-leave-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-enter-from {
        translate: 0 100%;
    }

    .fade-leave-to {
        translate: 0 100%;
        opacity: 1;
    }
}
</style>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'
import { humanizedNumber } from '@/indexApp/utils/formatUtils.js'
import IconVerify from '@/components/icons/IconVerify.vue'

const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['closeUserInfoPop'])
const router = useRouter()
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    user: props.user,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    loading: false,
    followTextMap: new Map([
        ['NOT_FOLLOW', '订阅'],
        ['WAIT_PASS', '等待批准'],
        ['FOLLOW', '已订阅'],
        [undefined, '订阅']
    ])
})

const isMyself = computed(() => { return state.user.id == state.curUser.id })

const followBtnClass = computed(() => ({
    'bg-blue-500': state.user.yourFollowStatus === 'NOT_FOLLOW',
    'bg-gray-200': state.user.yourFollowStatus !== 'NOT_FOLLOW',
    'text-zinc-500': state.user.yourFollowStatus !== 'NOT_FOLLOW',
    'text-white': state.user.yourFollowStatus === 'NOT_FOLLOW'
}))

const brief = computed(() => {
    const remark = state.user.remark
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
})

const isCurUser = computed(() => { return state.curUser.id == state.user.id })

const fanCountText = computed(() => {
    const gender = state.user.gender
    const fanCount = humanizedNumber(state.user.fanCount)
    if (isMyself.value == true) return `订阅我的 ${fanCount}`
    if (gender == 'FEMALE') return `订阅她的 ${fanCount}`
    return `订阅他的 ${fanCount}`
})

const followCountText = computed(() => {
    const gender = state.user.gender
    const followCount = humanizedNumber(state.user.followCount)
    if (isMyself.value == true) return `我的订阅 ${followCount}`
    if (gender == 'FEMALE') return `她的订阅 ${followCount}`
    return `他的订阅 ${followCount}`
})

const followButtonText = computed(() => {
    const { yourFollowStatus, yourFanStatus, confirmFollow } = state.user
    if (yourFollowStatus === 'FOLLOW' && yourFanStatus === 'FAN') return '相互订阅'
    if (yourFollowStatus === 'NOT_FOLLOW' && confirmFollow) return '请求订阅'
    return state.followTextMap.get(yourFollowStatus)
})

const profileButtonClass = computed(() => ({
    'bg-blue-500 text-white': isCurUser.value || state.user.yourFollowStatus === 'FOLLOW',
    'bg-gray-200 text-black': !isCurUser.value && state.user.yourFollowStatus !== 'FOLLOW'
}))

function toggleFollowState() {
    const userId = state.user.id
    if (state.user.yourFollowStatus !== 'NOT_FOLLOW') {
        unFollowAUser(userId)
    } else {
        followAUser(userId)
    }
}

function routeToProfile() {
    router.push({ name: 'profile', params: { nickname: state.user.nickname } })
}

function routeToFollowList() {
    router.push({ name: 'followList', params: { nickname: state.user.nickname } })
}

function routeToFanList() {
    router.push({ name: 'fanList', params: { nickname: state.user.nickname } })
}

async function followAUser(userId) {
    state.loading = true
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
        store.setErrorMsg(e.message)
    } finally {
        state.loading = false
    }
}

async function unFollowAUser(userId) {
    state.loading = true
    try {
        const response = await unFollowUser(userId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.yourFollowStatus = 'NOT_FOLLOW'
        store.setSuccessMsg("取消订阅成功！")
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.loading = false
    }
}

onMounted(() => {
    const dismissRouteToSet = new Set(['profile', 'followingList', 'followerList'])
    router.afterEach((to, from) => {
        if (dismissRouteToSet.has(to.name)) {
            emits('closeUserInfoPop')
        }
    })
})
</script>