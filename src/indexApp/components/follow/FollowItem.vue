<template>
    <div class="border-b-[1px] flex flex-nowrap flex-row gap-x-3 items-start justify-center p-2">
        <Avatar
            :user="props.user"
            class="flex-initial h-[3rem] object-cover rounded-[8px] text-[18pt] w-[3rem]"
            @click="routeToUserProfile">
        </Avatar>
        <div class="flex-auto">
            <div
                class="cursor-pointer font-bold hover:underline text-[14pt]"
                @click="routeToUserProfile">
                {{ props.user.nickname }}
                <i
                    v-show="props.user.verified == true"
                    class="bi bi-patch-check-fill text-[11pt] text-blue-500 verify" />
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="brief text-[10pt]">{{ brief(props.user.remark) }}</div>
        </div>
        <div
            :class="buttonClass"
            class="cursor-pointer flex-initial font-bold place-self-center px-[1rem] py-[0.4rem] rounded-full text-[11pt] text-white w-[5rem]"
            @click="toggleFollowState">
            <div
                v-if="!state.loading"
                class="text-center">
                {{ state.isFollowing ? '已订阅' : '订阅' }}
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <IconLoading v-else class="'h-5 text-white' w-5"></IconLoading>
        </div>
    </div>
</template>

<style scoped>
.brief {
    width: 24.5rem;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>

<script setup>
import { reactive, computed } from 'vue'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { useRouter } from 'vue-router'
import Avatar from '@/indexApp/components/Avatar.vue'
import { store } from '@/indexApp/js/store.js'

const props = defineProps({
    /** 用户对象 */
    user: {
        type: Object,
        required: true
    }
})
const router = useRouter()
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    loading: false,
    isFollowing: props.user.following
})

const buttonClass = computed(() => ({
    'bg-blue-500': !state.isFollowing,
    'bg-gray-300': state.isFollowing,
    'text-black': state.isFollowing,
    'text-white': !state.isFollowing
}))

function routeToUserProfile() {
    router.push({ name: 'profile', params: { nickname: props.user.nickname } })
}

function brief(remark) {
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
}

function toggleFollowState() {
    state.isFollowing ? unFollowAUser() : followAUser()
}

async function followAUser() {
    const { id } = props.user
    state.loading = true
    try {
        const response = await followUser(id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) throw new Error('关注失败！')
        state.isFollowing = result
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function unFollowAUser() {
    const { id } = props.user
    state.loading = true
    try {
        const response = await unFollowUser(id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) throw new Error('取消关注失败！')
        state.isFollowing = !result
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}
</script>