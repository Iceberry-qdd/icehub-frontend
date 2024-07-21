<template>
    <div
        @click="toggleFollowStatus()">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">{{ followIcon }}</span>
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
    user: props.user,
    followTextMap: new Map([
        ['NOT_FOLLOW', '订阅'],
        ['WAIT_PASS', '等待批准'],
        ['FOLLOW', '已订阅'],
        [undefined, '订阅']
    ])
})

const followText = computed(() => {
    const { yourFollowStatus, isFan, confirmFollow } = state.user
    if(yourFollowStatus === 'FOLLOW' && isFan) return '相互订阅'
    if(yourFollowStatus === 'NOT_FOLLOW' && confirmFollow) return '请求订阅'
    return state.followTextMap.get(state.yourFollowStatus)
})

const followIcon = computed(() => {
    const { yourFollowStatus } = state.user
    return yourFollowStatus !== 'NOT_FOLLOW' ? `person_remove` : `person_add_alt`
})

function dismiss() { emits('dismissMenu') }

function toggleFollowStatus() {
    const { yourFollowStatus, id } = state.user
    yourFollowStatus !== 'NOT_FOLLOW' ? unFollowingIt(id) : followingIt(id)
}

async function followingIt(postId) {
    try {
        const response = await followUser(postId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result?.confirmed){
            store.setSuccessMsg("订阅成功！")
            state.yourFollowStatus = 'FOLLOW'
        } else {
            state.yourFollowStatus = 'WAIT_PASS'
        }
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

        const result = await response.json()
        state.yourFollowStatus = 'NOT_FOLLOW'
        store.setSuccessMsg("取消订阅成功！")
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        dismiss()
    }
}
</script>