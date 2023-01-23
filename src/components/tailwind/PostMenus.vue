<template>
    <div>
        <div @mouseleave="dismiss"
            class="flex flex-col z-[99] absolute min-w-[12rem] max-w-[18rem] h-auto left-[-10rem] top-0 bg-white rounded-[8px] shadow-sm ring-1 ring-slate-900/5">
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100 rounded-t-[8px]">复制链接</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">生成海报</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100" @click="toggleMark()">{{ bookMarkText }}</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">{{ followText }}</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">对此内容不感兴趣</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">管理员选项</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">屏蔽 {{ state.user.nickname }} 的所有内容</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">举报此内容</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100 text-red-500 rounded-b-[8px]">删除此内容</div>
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, computed } from 'vue'
import { store } from '@/store.js'
import { markAPost, unMarkAPost } from '@/api.js';

const emit = defineEmits(['dismissMenu'])

const props = defineProps(['post'])

const state = reactive({
    user: props.post.user,
    post: props.post
})

const followText = computed(() => {
    const { nickname, following } = state.user
    return following ? `取消订阅 ${nickname}` : `订阅 ${nickname}`
})

const bookMarkText = computed(() => {
    const { marked } = state.post
    return marked ? "从书签中移除" : "加入书签"
})

function dismiss() { emit('dismissMenu') }

function toggleMark() {
    const { marked, id } = state.post
    console.log(marked)
    marked ? unMarkIt(id) : markIt(id)
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
        state.post.marked = true
        store.setSuccessMsg("已移出书签！")
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }finally{
        dismiss()
    }
}
</script>