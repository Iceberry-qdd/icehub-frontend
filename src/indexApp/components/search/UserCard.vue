<template>
    <div class="bg-white border-[1px] rounded-[8px]">
        <Banner
            :user="props.user"
            class="h-[6rem] object-cover rounded-t-[8px] w-full">
        </Banner>
        <div class="-translate-y-[1.75rem] flex flex-col gap-y-1 items-start justify-start px-2 w-full">
            <div class="flex flex-row items-end justify-between w-full">
                <Avatar
                    :user="props.user"
                    class="border-[0.2rem] border-white box-content h-[3.5rem] object-cover rounded-[8px] text-[3.5rem] w-[3.5rem]">
                </Avatar>
                <div
                    v-if="!isSelf"
                    :class="followBtnClass"
                    class="btn-no-select flex flex-row h-[1.8rem] items-center justify-center min-w-[4.5rem] px-3 rounded-full text-[11pt]"
                    @click.stop="state.isFollowing ? doUnFollowUser() : doFollowUser()">
                    {{ followButtonText }}
                </div>
            </div>
            <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                <div class="font-bold hover:underline hover:underline-offset-4 text-[12pt]">
                    {{ state.user.nickname }}
                </div>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconVerify v-if="state.user.verified" class="h-[0.9rem] text-blue-500 w-[0.9rem]"></IconVerify>
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="break-all text-[10pt] webkit-box-1">{{ state.user.remark }}</div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import Avatar from '@/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'
import { store } from '@/indexApp/js/store.js'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'
import IconVerify from '@/components/icons/IconVerify.vue'

const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    user: props.user,
    loading: true,
    isFollowing: props.user.following,
    isFollower: props.user.follower,
    curUser: JSON.parse(localStorage.getItem("CUR_USER"))
})

const isSelf = computed(() => state.curUser.id === props.user.id)

const followBtnClass = computed(() => ({
    'bg-blue-500': !state.isFollowing,
    'bg-gray-300': state.isFollowing,
    'text-white': !state.isFollowing,
    'text-zinc-700': state.isFollowing
}))

const followButtonText = computed(() => {
    if (state.isFollowing && state.isFollower) return '相互订阅'
    return state.isFollowing ? '已订阅' : '订阅'
})

async function doFollowUser() {
    state.loading = true
    try {
        const response = await followUser(props.user.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = response.json()
        if (result == false) throw new Error('关注失败！')
        state.isFollowing = true
    } catch (e) {
        store.setErrorMsg('订阅失败！')
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function doUnFollowUser() {
    state.loading = true
    try {
        const response = await unFollowUser(props.user.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = response.json()
        if (result == false) throw new Error('取消关注失败！')
        state.isFollowing = false
    } catch (e) {
        store.setErrorMsg('取消订阅失败！')
        console.error(e)
    } finally {
        state.loading = false
    }
}
</script>