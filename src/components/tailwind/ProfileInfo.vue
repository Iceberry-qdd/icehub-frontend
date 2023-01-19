<template>
    <div>
        <div>
            <div><img class=" w-[38rem] h-[18rem] object-cover object-center" :src="bannerPic" /></div>
            <div><img class="relative top-[-2.5rem] left-[1rem] w-[5rem] h-[5rem] border-[4px] border-white rounded-lg"
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
            <div class="relative flex flex-col gap-y-1 pl-[1rem]" :class="{ 'top-[-4rem]': !isMyself, 'top-[-1.5rem]': isMyself }">
                <div class="text-[18pt] font-bold">{{ state.user.nickname }}</div>
                <div class="">{{ state.user.remark }}</div>
                <div class="flex flex-row gap-x-2 items-center">
                    <!-- <calendar-three theme="outline" class="icon" size="16" fill="#333" :strokeWidth="3" /> -->
                    <IconCalendar class="text-[14pt]"></IconCalendar>
                    <div>{{ formattedDate }}</div>
                </div>
                <div v-if="state.user.verified == true" class="flex flex-row gap-x-2 items-center">
                    <!-- <success theme="outline" size="18" class="icon" fill="#333" :strokeWidth="3" /> -->
                    <IconVerify class="text-[13pt]"></IconVerify>
                    <div>{{ state.user.verifiedInfo }}</div>
                </div>
                <div v-if="state.user.city != null" class="flex flex-row gap-x-2 items-center">
                    <!-- <local-two theme="outline" size="16" class="icon" fill="#333" :strokeWidth="3" /> -->
                    <IconLocation class="text-[14pt]" title="所在城市"></IconLocation>
                    <div>{{ state.user.city }}</div>
                </div>
                <div class="flex flex-row gap-x-6">
                    <div @click="routeTo('followerList', state.user.nickname)" class="cursor-pointer hover:underline">订阅我的
                        <span>{{ state.user.followingCount }}</span>
                    </div>
                    <div @click="routeTo('followingList', state.user.nickname)" class="cursor-pointer hover:underline">
                        我的订阅 <span>{{ state.user.followerCount }}</span>
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
    const bannerUrl = state.user.bannerUrl
    return bannerUrl || '/src/assets/default-bg.jpg'
})

const avatarPic = computed(() => {
    if (!state.user.avatarUrl) {
        return `https://api.multiavatar.com/${state.user.nickname}.svg`
    } else {
        return props.user.avatarUrl
    }
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
        if (!response.ok) throw new Error(await response.text())

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
        if (!response.ok) throw new Error(await response.text())

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
</script>