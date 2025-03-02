<template>
    <div
        class="text-onError"
        @click="showConfirmDialogBox">
        <span class="material-symbols-rounded max-sm:bg-red-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem] text-inherit">delete</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:text-[0.8rem]">删除此内容</div>
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
import { reactive, inject, defineAsyncComponent } from 'vue'
import { deleteOnePost } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

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
        title: '删除此帖子？',
        confirmButton: {
            color: 'text-onError',
            bgColor: 'bg-error',
            selected: false
        },
        cancelButton: {
            selected: false
        },
        loading: {
            show: false
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
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result == false) throw new Error("删除失败！")
        store.setSuccessMsg("已删除！")
        deletePostOnUi(props.post.id)
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        toggleDialogLoading(false)
        dismissConfirmDialogBox()
    }
}
</script>