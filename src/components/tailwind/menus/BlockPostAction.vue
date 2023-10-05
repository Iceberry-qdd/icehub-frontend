<template>
    <div @click="blockThisPost">对此内容不感兴趣</div>
</template>

<style scoped></style>

<script setup>
import { createOneBlacklist } from '@/api'
import { store } from '@/store.js'
import {inject} from 'vue'

const props = defineProps(['post'])
const { deletePostOnUi } = inject('deletePostOnUi')

async function blockThisPost() {
    try {
        const response = await createOneBlacklist('POST', props.post.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const { id } = await response.json()
        if (id != props.post.id) throw new Error('操作失败，请稍后重试!')
        store.setSuccessMsg('将为您减少此类内容!')
        deletePostOnUi(props.post.id)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}
</script>