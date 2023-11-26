<template>
    <div @click="blockThisPost" class="flex flex-rows justify-start items-center gap-x-3">
        <span class="material-icons-round no-hover">visibility_off</span>
        <div>对此内容不感兴趣</div>
    </div>
</template>

<style scoped>
.material-icons-round {
    padding: 0;
    font-size: 16pt;
}
</style>

<script setup>
import { createOneBlacklist } from '@/api'
import { store } from '@/store.js'
import { inject, reactive } from 'vue'

const props = defineProps(['post'])
const { deletePostOnUi } = inject('deletePostOnUi')

const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
})

async function blockThisPost() {
    try {
        const response = await createOneBlacklist('POST', props.post.id, state.curUser.id)
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