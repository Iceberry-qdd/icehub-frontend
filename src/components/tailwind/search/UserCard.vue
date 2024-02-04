<template>
    <div class="rounded-[8px] border-[1px] bg-white">
        <Banner
            :user="props.user"
            class="w-full h-[6rem] object-cover rounded-t-[8px]">
        </Banner>
        <div class="flex flex-col justify-start items-start gap-y-1 w-full px-2 -translate-y-[1.75rem]">
            <div class="flex flex-row justify-between items-end w-full">
                <Avatar
                    :user="props.user"
                    class="w-[3.5rem] h-[3.5rem] border-white box-content border-[0.2rem] object-cover rounded-[8px] text-[18pt]">
                </Avatar>
                <div
                    @click.stop="state.isFollowing ? doUnFollowUser() : doFollowUser()"
                    :class="followBtnClass"
                    class="flex flex-row justify-center items-center text-[11pt] min-w-[4.5rem] px-3 h-[1.8rem] rounded-full btn-no-select">
                    {{ state.isFollowing ? '取消' : '' }}订阅
                </div>
            </div>
            <div class="text-[14pt] font-bold">
                {{ state.user.nickname }}
                <i class="text-[10pt] bi bi-patch-check-fill verify text-blue-500" v-if="state.user.verified"></i>
            </div>
            <div class="text-[10pt] break-all brief">{{ state.user.remark }}</div>
        </div>
    </div>
</template>

<style scoped>
.brief {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
</style>

<script setup>
import { reactive, computed } from 'vue'
import Avatar from '@/components/tailwind/Avatar.vue'
import Banner from '@/components/tailwind/Banner.vue'
import { store } from '@/store'
import { followUser, unFollowUser } from '@/api'

const props = defineProps(['user'])
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