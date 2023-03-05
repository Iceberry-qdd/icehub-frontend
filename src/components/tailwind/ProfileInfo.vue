<template>
    <div>
        <div>
            <div><img @click="showSlide([state.user.bannerUrl], 0)" class=" w-[38rem] h-[18rem] object-cover object-center"
                    :src="bannerPic" /></div>
            <div><img @click="showSlide([state.user.avatarUrl], 0)"
                    class="relative top-[-2.5rem] left-[1rem] w-[5rem] h-[5rem] border-[4px] border-white rounded-lg"
                    :src="avatarPic" /></div>
            <div v-if="!isMyself" class="flex w-fit flex-row gap-x-3 relative top-[-4rem] right-[-24rem]">
                <div @click="toggleFollowState"
                    class="bg-blue-500 px-5 py-[0.325rem] rounded-full text-white font-bold cursor-pointer"
                    :class="{ 'bg-gray-300': state.user.following, 'bg-blue-500': !state.user.following, 'text-black': state.user.following, 'text-white': !state.user.following }">
                    <div v-if="!state.loading"> {{ state.user.following ? '已订阅' : '＋订阅' }}</div>
                    <IconLoading v-else class="'h-5 w-5 text-white'"></IconLoading>
                </div>
                <div
                    class="bg-white px-5 py-[0.325rem] rounded-full border-[1px] border-gray-300 font-bold cursor-pointer">
                    私信</div>
            </div>
            <div class="relative flex flex-col gap-y-1 pl-[1rem]"
                :class="{ 'top-[-4rem]': !isMyself, 'top-[-1.5rem]': isMyself }">
                <div class="text-[18pt] font-bold">{{ state.user.nickname }}</div>
                <div class="">{{ state.user.remark }}</div>
                <div class="flex flex-row gap-x-2 items-center">
                    <IconCalendar class="text-[14pt]"></IconCalendar>
                    <div>{{ formattedDate }}</div>
                </div>
                <div v-if="state.user.verified == true" class="flex flex-row gap-x-2 items-center">
                    <IconVerify class="text-[13pt]"></IconVerify>
                    <div>{{ state.user.verifiedInfo }}</div>
                </div>
                <div v-if="state.user.city" class="flex flex-row gap-x-2 items-center">
                    <IconLocation class="text-[14pt]" title="所在城市"></IconLocation>
                    <div>{{ state.user.city }}</div>
                </div>
                <div v-if="state.user.email" class="flex flex-row gap-x-2 items-center">
                    <IconEmail class="text-[12pt]" title="电子邮箱"></IconEmail>
                    <div>{{ state.user.email }}</div>
                </div>
                <div v-if="state.user.website" class="flex flex-row gap-x-2 items-center">
                    <IconWebsite class="text-[12pt]" title="个人网站"></IconWebsite>
                    <a :href="state.user.website"
                        class="hover:underline hover:decoration-blue-500 hover:text-blue-500">{{
                            state.user.website
                        }}</a>
                </div>
                <div class="flex flex-row gap-x-6">
                    <div @click="routeTo('followerList', state.user.nickname)" class="cursor-pointer hover:underline">
                        <span>{{ followingCountText }}</span>
                    </div>
                    <div @click="routeTo('followingList', state.user.nickname)" class="cursor-pointer hover:underline">
                        <span>{{ followerCountText }}</span>
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

const props = defineProps(['user'])

const state = reactive({
    user: props.user,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    loading: false
})

const formattedDate = computed(() => {
    const timestamps = state.user.createdTime
    const date = new Date(Number.parseInt(timestamps))
    return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`
})

const bannerPic = computed(() => {
    const { previewUrl, originUrl } = state.user.bannerUrl || [null, null]
    const defaultUrl = '/src/assets/default-bg.jpg'
    return originUrl || previewUrl || defaultUrl // TODO 头像和背景图的原图与缩略图显示关系
})

const followingCountText = computed(() => {
    const { gender, followingCount } = state.user
    if (isMyself.value == true) return `订阅我的 ${followingCount}`
    if (gender == 'FEMALE') return `订阅她的 ${followingCount}`
    return `订阅他的 ${followingCount}`
})

const followerCountText = computed(() => {
    const { gender, followerCount } = state.user
    if (isMyself.value == true) return `我的订阅 ${followerCount}`
    if (gender == 'FEMALE') return `她的订阅 ${followerCount}`
    return `他的订阅 ${followerCount}`
})

const avatarPic = computed(() => {
    const { previewUrl, originUrl } = state.user.avatarUrl || [null, null]
    const defaultUrl = `https://api.multiavatar.com/${state.user.nickname}.svg`
    return previewUrl || originUrl || defaultUrl
})

const isMyself = computed(() => { return state.user.id == state.curUser.id })

function routeTo(routeName, routeParam) {
    router.push({ name: routeName, params: { nickname: routeParam } })
}

function toggleFollowState() {
    const userId = state.user.id
    if (state.user.following) {
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
        state.user.following = result
    } catch (e) {
        store.setErrorMsg(e.message)
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
        state.user.following = !result
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

function showSlide(images, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")

    const urls = images.map(item => { return item.originUrl })
    store.showSlide(urls, idx)
}
</script>