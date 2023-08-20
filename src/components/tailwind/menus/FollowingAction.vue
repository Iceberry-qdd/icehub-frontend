<template>
    <div>
        <div @click="toggleFollow()">{{ followText }}</div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, computed } from 'vue'
import { store } from '@/store.js'
import { followUser, unFollowUser } from '@/api.js'

const emits = defineEmits(['dismissMenu'])

const props = defineProps(['user'])

const state = reactive({
    user: props.user
})

const followText = computed(() => {
    const { following, nickname } = state.user
    return following ? `不再订阅${nickname}` : `订阅${nickname}`
})

function dismiss() { emits('dismissMenu') }

function toggleFollow() {
    const { following, id } = state.user
    following == true ? unFollowingIt(id) : followingIt(id)
}

async function followingIt(postId) {
    try {
        const response = await followUser(postId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        if (result == false) throw new Error("订阅失败！")
        state.user.following = true
        store.setSuccessMsg("已订阅！")
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        dismiss()
    }
}

async function unFollowingIt(postId) {
    try {
        const response = await unFollowUser(postId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        if (result == false) throw new Error("取消订阅失败！")
        state.user.following = false
        store.setSuccessMsg("已取消订阅！")
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        dismiss()
    }
}
</script>