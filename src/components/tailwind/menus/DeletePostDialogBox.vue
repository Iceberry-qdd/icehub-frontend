<template>
    <div
        class="flex cursor-default flex-col gap-y-4 px-4 py-4 w-[12rem] text-center bg-white rounded-[8px] shadow ring-1 ring-slate-900/5">
        <div class="w-full text-[11pt]">{{ title }}</div>
        <IconLoading v-if="state.showLoading" class="h-5 text-red-500 w-full"></IconLoading>
        <div v-else class="flex flex-row gap-x-3">
            <div @click="deleteIt" class="basis-1/2 bg-red-100 text-red-500 text-[11pt] rounded-full px-4 py-[0.3rem] cursor-pointer">删除</div>
            <div @click="dismiss" class="basis-1/2 bg-gray-100 text-[11pt] rounded-full px-4 py-[0.3rem] cursor-pointer">取消</div>
        </div>

    </div>
</template>

<style scoped></style>

<script setup>
import { reactive, computed } from 'vue'
import { deleteOnePost } from '@/api.js'
import { store } from '@/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'

const props = defineProps(['post'])
const emits = defineEmits(['deletePost', 'dismissMenu'])

const state = reactive({
    showLoading: false
})

async function deleteIt() {
    try {
        state.showLoading = true
        const response = await deleteOnePost(props.post)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        if (result == 'false') throw new Error("删除失败！")
        store.setSuccessMsg("已删除！")
        emits('deletePost', { postId: props.post.id })
        dismiss()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.showLoading = false
    }
}

const title = computed(()=>{
    return state.showLoading ? '删除中...' : '确定删除该帖子？'
})

function dismiss() { emits('dismissMenu') }
</script>