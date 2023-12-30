<template>
    <div>
        <div>
            <div>
                <img v-if="props.user.bannerUrl" @click="showSlide([props.user.bannerUrl], 0)" class="w-full max-h-[18rem] object-cover object-center" :src="bannerPic" />
                <div v-else class="w-full h-[18rem] object-cover object-center bg-gradient-to-r from-sky-500 to-indigo-500"></div>
            </div>
            <div>
                <img v-if="props.user.avatarUrl" @click="showSlide([props.user.avatarUrl], 0)"
                    class="relative top-[-2.5rem] left-[1rem] w-[5rem] h-[5rem] border-[4px] border-white rounded-lg"
                    :src="avatarPic" />
                <div v-else class="flex justify-center items-center relative top-[-2.5rem] left-[1rem] w-[5rem] h-[5rem] border-[4px] border-white rounded-lg bg-blue-500 cursor-default">
                    <div class="text-white text-[28pt] font-bold">{{ props.user.nickname.charAt(0) }}</div>
                </div>
            </div>
            <div v-if="!isMyself" class="flex w-full flex-row justify-end h-fit gap-x-3 px-[1rem] relative -top-[4rem]">
                <div v-if="!props.user.blocking && !props.user.blocked" @click="toggleFollowState"
                    class="bg-blue-500 px-5 py-[0.325rem] rounded-full text-white font-bold cursor-pointer"
                    :class="{ 'bg-gray-300': state.isFollowing, 'bg-blue-500': !state.isFollowing, 'text-black': state.isFollowing, 'text-white': !state.isFollowing }">
                    <div v-if="!state.loading"> {{ state.isFollowing ? '已订阅' : '订阅' }}</div>
                    <IconLoading v-else class="'h-5 w-5 text-white'"></IconLoading>
                </div>
                <div v-else-if="props.user.blocking"
                    @click="state.confirmBDialogUi.show = true"
                    class="bg-red-200 px-5 py-[0.325rem] rounded-full text-white font-bold cursor-pointer">
                    <div v-if="!state.loading" class="text-red-500"> 解除屏蔽 </div>
                    <IconLoading v-else class="'h-5 w-5 text-white'"></IconLoading>
                    <Teleport to="#app">
                        <ConfirmDialogBox
                            ref="confirmDialogBox"
                            @choice="choose"
                            v-if="state.confirmBDialogUi.show"
                            :ui="state.confirmBDialogUi">
                        </ConfirmDialogBox>
                    </Teleport>
                </div>
            </div>
            <div v-if="!props.user.blocking && !props.user.blocked"
                class="relative flex flex-col gap-y-1 pl-[1rem]"
                :class="{ 'top-[-4rem]': !isMyself, 'top-[-1.5rem]': isMyself }">
                <div class="text-[18pt] font-bold">{{ props.user.nickname }}</div>
                <div class="">{{ props.user.remark }}</div>
                <div class="flex flex-row gap-x-2 items-center">
                    <IconCalendar class="text-[14pt]"></IconCalendar>
                    <div>{{ formattedDate }}</div>
                </div>
                <div v-if="props.user.verified == true" class="flex flex-row gap-x-2 items-center">
                    <IconVerify class="text-[13pt]"></IconVerify>
                    <div>{{ props.user.verifiedInfo }}</div>
                </div>
                <div v-if="props.user.city" class="flex flex-row gap-x-2 items-center">
                    <IconLocation class="text-[14pt]" title="所在城市"></IconLocation>
                    <div>{{ props.user.city }}</div>
                </div>
                <div v-if="props.user.email" class="flex flex-row gap-x-2 items-center">
                    <IconEmail class="text-[12pt]" title="电子邮箱"></IconEmail>
                    <div>{{ props.user.email }}</div>
                </div>
                <div v-if="props.user.website" class="flex flex-row gap-x-2 items-center">
                    <IconWebsite class="text-[12pt]" title="个人网站"></IconWebsite>
                    <a :href="props.user.website" class="hover:underline hover:decoration-blue-500 hover:text-blue-500">
                        {{ props.user.website }}
                    </a>
                </div>
                <div class="flex flex-row gap-x-6">
                    <div @click="routeTo('followerList', props.user.nickname)" class="cursor-pointer hover:underline">
                        <span>{{ followerCountText }}</span>
                    </div>
                    <div @click="routeTo('followingList', props.user.nickname)" class="cursor-pointer hover:underline">
                        <span>{{ followingCountText }}</span>
                    </div>
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
import { reactive, computed } from 'vue'
import { followUser, unFollowUser } from '@/api'
import { store } from '@/store'
import router from '@/route.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import IconCalendar from '@/components/icons/IconCalendar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import IconLocation from '@/components/icons/IconLocation.vue'
import IconWebsite from '@/components/icons/IconWebsite.vue'
import IconEmail from '@/components/icons/IconEmail.vue'
import ConfirmDialogBox from '@/components/tailwind/menus/ConfirmDialogBox.vue'

const props = defineProps(['user'])
const emits = defineEmits(['unblockUser'])

const state = reactive({
    isFollowing: props.user.following,
    isFollower: props.user.follower,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    loading: false,
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
    }
})

const formattedDate = computed(() => {
    const timestamps = props.user.createdTime
    const date = new Date(Number.parseInt(timestamps))
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

const bannerPic = computed(() => {
    const { previewUrl, originUrl, contentType } = props.user.bannerUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl
})

const followerCountText = computed(() => {
    const { gender, followingCount } = props.user
    if (isMyself.value == true) return `订阅我的 ${followingCount}`
    if (gender == 'FEMALE') return `订阅她的 ${followingCount}`
    return `订阅他的 ${followingCount}`
})

const followingCountText = computed(() => {
    const { gender, followerCount } = props.user
    if (isMyself.value == true) return `我的订阅 ${followerCount}`
    if (gender == 'FEMALE') return `她的订阅 ${followerCount}`
    return `他的订阅 ${followerCount}`
})

const avatarPic = computed(() => {
    const { previewUrl, originUrl, contentType } = props.user.avatarUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl
})

const isMyself = computed(() => { return props.user.id == state.curUser.id })

function routeTo(routeName, routeParam) {
    router.push({ name: routeName, params: { nickname: routeParam } })
}

function toggleFollowState() {
    const userId = props.user.id
    if (state.isFollowing) {
        unFollowAUser(userId)
    } else {
        followAUser(userId)
    }
}

async function followAUser(userId) {
    state.loading = true
    try {
        const response = await followUser(userId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = response.json()
        if (result == false) throw new Error('关注失败！')
        state.isFollowing = result
    } catch (e) {
        store.setErrorMsg('订阅失败！')
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function unFollowAUser(userId) {
    state.loading = true
    try {
        const response = await unFollowUser(userId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = response.json()
        if (result == false) throw new Error('取消关注失败！')
        state.isFollowing = !result
    } catch (e) {
        store.setErrorMsg('取消订阅失败！')
        console.error(e)
    } finally {
        state.loading = false
    }
}

function showSlide(images, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(images, idx)
}

function unblockUser() {
    emits('unblockUser')
    state.confirmBDialogUi.show = false
}

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        unblockUser()
    } else {
        state.confirmBDialogUi.show = false
    }
}
</script>