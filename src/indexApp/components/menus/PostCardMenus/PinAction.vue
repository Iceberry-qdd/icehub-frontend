<template>
    <div @click="doTogglePin">
        <span class="material-icons-round max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">push_pin</span>
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">
            {{ text }}
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { inject, computed, reactive } from 'vue'
import { togglePin } from '@/indexApp/js/api'
import { store } from '@/indexApp/js/store.js'

const props = defineProps({
    /** 待置顶的帖子 */
    post: {
        type: Object,
        required: true
    }
})
const { pinPostOnUi } = inject('pinPostOnUi', { pinPostOnUi: () => { } })
const { dismissPostMenus } = inject('dismissPostMenus')
const state = reactive({
    post: props.post
})

const text = computed(() => {
    return state.post.top ? '取消置顶' : '置顶'
})

async function doTogglePin() {
    try {
        const response = await togglePin(state.post.id, state.post.top, !state.post.top)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) throw new Error("置顶失败！")
        state.post.top = !state.post.top
        pinPostOnUi(state.post.id, state.post.top)
        store.setSuccessMsg(`该帖子已${!state.post.top ? '取消置顶' : '置顶'}！`)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        dismissPostMenus()
    }
}
</script>