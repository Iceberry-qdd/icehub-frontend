<template>
    <div @click="showConfirmDialogBox" class="flex flex-rows justify-start items-center gap-x-3">
        <span class="material-icons-round no-hover text-red-500">delete</span>
        <div>删除此内容</div>
        <Teleport to="#app">
            <ConfirmDialogBox
                ref="confirmDialogBox"
                @choice="choose"
                v-if="state.confirmDialogBoxUi.show"
                :ui="state.confirmDialogBoxUi">
            </ConfirmDialogBox>
        </Teleport>
    </div>
</template>

<style scoped>
.material-icons-round {
    padding: 0;
    font-size: 16pt;
}
</style>

<script setup>
import { reactive, inject } from 'vue'
import { deleteOnePost } from '@/api.js'
import { store } from '@/store.js'
import ConfirmDialogBox from '@/components/tailwind/menus/ConfirmDialogBox.vue'

const props = defineProps(['post'])
const { deletePostOnUi } = inject('deletePostOnUi')

const state = reactive({
    confirmDialogBoxUi: {
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
        }
    }
})

function showConfirmDialogBox() {
    state.confirmDialogBoxUi.show = true
}

function dismissConfirmDialogBox(){
    state.confirmDialogBoxUi.show = false
}

function toggleDialogLoading(isLoading){
    state.confirmDialogBoxUi.loading.show = isLoading
}

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        deleteIt()
    } else {
        dismissConfirmDialogBox()
    }
}

async function deleteIt() {
    try {
        toggleDialogLoading(true)
        const response = await deleteOnePost(props.post)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        if (result == 'false') throw new Error("删除失败！")
        store.setSuccessMsg("已删除！")
        deletePostOnUi(props.post.id)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        toggleDialogLoading(false)
    }
}
</script>