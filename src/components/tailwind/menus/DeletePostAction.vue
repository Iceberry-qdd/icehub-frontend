<template>
    <div @click="showCDB">删除此内容</div>
</template>

<style scoped></style>

<script setup>
import { reactive, watch } from 'vue'
import { deleteOnePost } from '@/api.js'
import { store } from '@/store.js'

const CONFIRM_DIALOG_BOX_TYPE = 'DeletePostAction'

const state = reactive({
    confirmDialogBox: {
        show: false,
        title: '确定要删除此帖子吗？',
        confirmButton: {
            text: '删除',
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: '不删除',
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: '正在删除中......',
            color: 'rgb(239 68 68)'
        },
        type: CONFIRM_DIALOG_BOX_TYPE
    }
})

function showCDB() {
    store.setCDB(state.confirmDialogBox)
    store.showCDB()
}

async function deleteIt() {
    try {
        store.startCDBLoading()
        const response = await deleteOnePost(props.post)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        if (result == 'false') throw new Error("删除失败！")
        store.setSuccessMsg("已删除！")
        store.dismissCDB()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        store.stopCDBLoading()
    }
}

watch(() => store.CONFIRM_DIALOG_BOX.confirmButton.selected, (newVal, oldVal) => {
    console.log(`${newVal} ${oldVal}`)
    if (store.CONFIRM_DIALOG_BOX.type != CONFIRM_DIALOG_BOX_TYPE) return

    if (oldVal == false && newVal == true) {
        deleteIt()
    }
})
</script>