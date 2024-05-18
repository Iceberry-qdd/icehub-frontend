<template>
    <div
        class="flex flex-rows gap-x-3 items-center justify-start"
        @click="showConfirmDialogBox">
        <span class="material-icons-round no-hover p-0 text-[16pt] text-red-500">delete</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="btn-no-select">删除此内容</div>
        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmDialogBoxUi.show"
                class="fixed top-0"
                :ui="state.confirmDialogBoxUi"
                @choice="choose">
            </ConfirmDialogBox>
        </Teleport>
    </div>
</template>

<script setup>
import { reactive, inject } from 'vue'
import { deleteOnePost } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'

const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})
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

function dismissConfirmDialogBox() {
    state.confirmDialogBoxUi.show = false
}

function toggleDialogLoading(isLoading) {
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

        const result = await response.json()
        if (result == false) throw new Error("删除失败！")
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