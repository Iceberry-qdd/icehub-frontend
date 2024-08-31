<template>
    <div @click="blockThisPost">
        <span
            class="material-symbols-rounded max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">visibility_off</span>
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">
            {{ text }}
        </div>
    </div>
</template>

<script setup>
import { createOneBlacklist } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { computed, inject, reactive } from 'vue'

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

const text = computed(() => {
    return `${!store.MOBILE_MODE ? '对此内容' : ''}不感兴趣`
})

async function blockThisPost() {
    try {
        const response = await createOneBlacklist('POST', props.post.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const { id } = await response.json()
        if (id != props.post.id) throw new Error('操作失败，请稍后重试!')
        store.setSuccessMsg('将为您减少此类内容!')
        deletePostOnUi(props.post.id)
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}
</script>