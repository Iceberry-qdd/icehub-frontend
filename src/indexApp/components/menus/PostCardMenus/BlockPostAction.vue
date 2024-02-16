<template>
    <div
        class="btn-no-select flex flex-rows gap-x-3 items-center justify-start"
        @click="blockThisPost">
        <span class="material-icons-round no-hover p-0 text-[16pt]">visibility_off</span>
        <div>对此内容不感兴趣</div>
    </div>
</template>

<script setup>
import { createOneBlacklist } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { inject, reactive } from 'vue'

const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})
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