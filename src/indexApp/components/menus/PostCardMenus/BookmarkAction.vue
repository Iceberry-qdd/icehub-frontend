<template>
    <div
        @click="toggleMark()">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">{{ bookmarkIcon }}</span>
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">
            {{ bookMarkText }}
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, inject } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { markAPost, unMarkAPost } from '@/indexApp/js/api.js'

const { deleteBookmarkOnUi } = inject('deleteBookmarkOnUi', { "deleteBookmarkOnUi": () => { } })
const { dismissPostMenus } = inject('dismissPostMenus')
const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    user: props.post.user,
    post: props.post
})

const bookMarkText = computed(() => {
    const { marked } = state.post
    return marked ? "从书签中移除" : "加入书签"
})

const bookmarkIcon = computed(() => {
    return state.post.marked ? 'bookmark_remove' : 'bookmark_add'
})

function toggleMark() {
    const { marked, id } = state.post
    marked == true ? unMarkIt(id) : markIt(id)
}

async function markIt(postId) {
    try {
        const response = await markAPost(postId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.text()
        if (result == false) throw new Error("加入书签失败！")
        state.post.marked = true
        store.setSuccessMsg("已加入书签！")
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        dismissPostMenus()
    }
}

async function unMarkIt(postId) {
    try {
        const response = await unMarkAPost(postId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.text()
        if (result == false) throw new Error("移除失败！")
        state.post.marked = false
        store.setSuccessMsg("已移出书签！")
        deleteBookmarkOnUi(state.post.id)
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        dismissPostMenus()
    }
}
</script>