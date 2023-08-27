<template>
    <div @click="deleteIt">删除此内容</div>
</template>

<style scoped></style>

<script setup>
import { deleteOnePost } from '@/api.js'
import { store } from '@/store.js'

const props = defineProps(['post'])
const emits = defineEmits(['deletePost', 'dismissMenu'])

async function deleteIt() {
    try {
        const response = await deleteOnePost(props.post)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        if (result == false) throw new Error("删除失败！")
        store.setSuccessMsg("已删除！")
        emits('deletePost', { postId: props.post.id })
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        dismiss()
    }
}

function dismiss() { emits('dismissMenu') }
</script>