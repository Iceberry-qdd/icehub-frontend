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
                    class="border-[0.2rem] border-white box-content h-[3.5rem] object-cover rounded-[8px] text-[18pt] w-[3.5rem]">
                </Avatar>
                <div
                    :class="followBtnClass"
                    class="btn-no-select flex flex-row h-[1.8rem] items-center justify-center min-w-[4.5rem] px-3 rounded-full text-[11pt]"
                    @click.stop="state.isFollowing ? doUnFollowUser() : doFollowUser()">
                    {{ state.isFollowing ? '取消' : '' }}订阅
                </div>
            </div>
            <div class="font-bold text-[14pt]">
                {{ state.user.nickname }}
                <i
                    v-if="state.user.verified"
                    class="bi bi-patch-check-fill text-[10pt] text-blue-500 verify" />
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="break-all text-[10pt] webkit-box-1">{{ state.user.remark }}</div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import Avatar from '@/indexApp/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'
import { store } from '@/indexApp/js/store.js'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'

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
    isFollowing: props.user.following
})

const followBtnClass = computed(() => ({
    'bg-blue-500': !state.isFollowing,
    'bg-gray-300': state.isFollowing,
    'text-white': !state.isFollowing,
    'text-zinc-700': state.isFollowing
}))

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