<template>
    <div
        class="flex flex-rows gap-x-3 items-center justify-start"
        @click="toggleFollow()">
        <span class="material-icons-round no-hover p-0 text-[16pt]">{{ followIcon }}</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="btn-no-select">{{ followText }}</div>
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
    const { following, nickname } = state.user
    return following ? `不再订阅此用户` : `订阅此用户`
})

const followIcon = computed(() => {
    const { following } = state.user
    return following ? `person_remove` : `person_add_alt`
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