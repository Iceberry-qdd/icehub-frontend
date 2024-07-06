<template>
    <div
        :class="itemClass"
        class="border-b-[1px] flex flex-nowrap flex-row gap-x-3 items-start p-2">
        <Avatar
            :user="props.user"
            class="flex-none h-[3rem] object-cover rounded-[8px] text-[3rem] w-[3rem]"
            @click="routeToUserProfile">
        </Avatar>
        <div class="flex-1">
            <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                <div
                    class="font-bold hover:underline hover:underline-offset-4 text-[14pt]"
                    @click="routeToUserProfile">
                    {{ props.user.nickname }}
                </div>
                <IconVerify
                    v-if="props.user.verified"
                    class="h-[0.9rem] text-blue-500 w-[0.9rem]">
                </IconVerify>
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="font-light text-[0.9rem] webkit-box-2">{{ brief(props.user.remark) }}</div>
        </div>
        <div
            v-if="!isSelf"
            :class="buttonClass"
            class="cursor-pointer flex flex-none flex-nowrap font-bold items-center justify-center place-self-center px-[1rem] py-[0.4rem] rounded-full text-[11pt] text-white w-[6rem]"
            @click="toggleFollowState">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div v-if="!state.loading"> {{ buttonText }} </div>
            <IconLoading
                v-else
                :class="loadingIconClass"
                class="h-5 w-5">
            </IconLoading>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import { store } from '@/indexApp/js/store.js'
import IconVerify from '@/components/icons/IconVerify.vue'

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
    isFollowing: props.user.yourFollowing,
    isFan: props.user.yourFan,
    curUser: JSON.parse(localStorage.getItem("CUR_USER"))
})

const buttonClass = computed(() => ({
    'bg-blue-500': !state.isFollowing,
    'bg-gray-200': state.isFollowing,
    'text-zinc-500': state.isFollowing,
    'text-white': !state.isFollowing
}))


const buttonText = computed(() => {
    if(state.isFollowing && state.isFan) return '相互订阅'
    return state.isFollowing ? '已订阅' : '订阅'
})

const loadingIconClass = computed(() => ({
    'text-zinc-500': state.isFollowing,
    'text-white': !state.isFollowing
}))

const itemClass = computed(() => ({
    'justify-between': !isSelf.value,
    'justify-start': isSelf.value
}))

const isSelf = computed(() => state.curUser.id === props.user.id)

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
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result == false) throw new Error('关注失败！')
        state.isFollowing = result
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.loading = false
    }
}

async function unFollowAUser() {
    const { id } = props.user
    state.loading = true
    try {
        const response = await unFollowUser(id)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result == false) throw new Error('取消关注失败！')
        state.isFollowing = !result
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.loading = false
    }
}
</script>