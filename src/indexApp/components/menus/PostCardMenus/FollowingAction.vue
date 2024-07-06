<template>
    <div
        @click="toggleFollowStatus()">
        <span class="material-icons-round max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">{{ followIcon }}</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">{{ followText }}</div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'

const emits = defineEmits(['dismissMenu'])
const props = defineProps({
    /** 传入的用户对象对象 */
    user: {
        type: Object,
        required: true
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    user: props.user
})

const followText = computed(() => {
    const { yourFollowing, nickname } = state.user
    return yourFollowing ? `不再订阅此用户` : `订阅此用户`
})

const followIcon = computed(() => {
    const { yourFollowing } = state.user
    return yourFollowing ? `person_remove` : `person_add_alt`
})

function dismiss() { emits('dismissMenu') }

function toggleFollowStatus() {
    const { yourFollowing, id } = state.user
    yourFollowing == true ? unFollowingIt(id) : followingIt(id)
}

async function followingIt(postId) {
    try {
        const response = await followUser(postId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.text()
        if (result == false) throw new Error("订阅失败！")
        state.user.yourFollowing = true
        store.setSuccessMsg("已订阅！")
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        dismiss()
    }
}

async function unFollowingIt(postId) {
    try {
        const response = await unFollowUser(postId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.text()
        if (result == false) throw new Error("取消订阅失败！")
        state.user.yourFollowing = false
        store.setSuccessMsg("已取消订阅！")
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        dismiss()
    }
}
</script>