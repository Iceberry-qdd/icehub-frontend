<template>
    <div>
        <div @click="toggleMark()">{{ bookMarkText }}</div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, computed } from 'vue'
import { store } from '@/store.js'
import { markAPost, unMarkAPost } from '@/api.js'

const emits = defineEmits(['dismissMenu'])

const props = defineProps(['post'])

const state = reactive({
    user: props.post.user,
    post: props.post
})

const bookMarkText = computed(() => {
    const { marked } = state.post
    return marked ? "从书签中移除" : "加入书签"
})

function dismiss() { emits('dismissMenu') }

function toggleMark() {
    const { marked, id } = state.post
    marked==true ? unMarkIt(id) : markIt(id)
}

async function markIt(postId) {
    try {
        const response = await markAPost(postId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        if (result == false) throw new Error("加入书签失败！")
        state.post.marked =true
        store.setSuccessMsg("已加入书签！")
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }finally{
        dismiss()
    }
}

async function unMarkIt(postId) {
    try {
        const response = await unMarkAPost(postId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        if (result == false) throw new Error("移除失败！")
        state.post.marked = false
        store.setSuccessMsg("已移出书签！")
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }finally{
        dismiss()
    }
}
</script>