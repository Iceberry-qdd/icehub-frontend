<template>
    <div
        @click="toggleMark()">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">{{ bookmarkIcon }}</span>
        <div class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">
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

const bookMarkText = computed(() => {
    const { marked } = props.post
    return marked ? "从书签中移除" : "加入书签"
})

const bookmarkIcon = computed(() => {
    return props.post.marked ? 'bookmark_remove' : 'bookmark_add'
})

function toggleMark() {
    const { marked, id } = props.post
    marked == true ? unMarkIt(id) : markIt(id)
}

async function markIt(postId) {
    try {
        const response = await markAPost(postId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.text()
        if (result == false) throw new Error("加入书签失败！")
        // XXX 此处为方便，直接修改props对象的属性值
        // eslint-disable-next-line vue/no-mutating-props
        props.post.marked = true
        store.setSuccessMsg("已加入书签！")
    } catch (e) {
        console.error(e)
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
        // XXX 此处为方便，直接修改props对象的属性值
        // eslint-disable-next-line vue/no-mutating-props
        props.post.marked = false
        store.setSuccessMsg("已移出书签！")
        deleteBookmarkOnUi(props.post.id)
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        dismissPostMenus()
    }
}
</script>