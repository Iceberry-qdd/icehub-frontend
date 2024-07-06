<template>
    <div @click="showConfirmDialogBox">
        <span class="material-icons-round max-sm:bg-red-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem] text-red-500">delete</span>
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
import { reactive, inject, computed } from 'vue'
import { deleteOneReview } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'

const props = defineProps({
    /** 传入的评论对象 */
    review: {
        type: Object,
        required: true
    }
})
const { deleteReviewOnUi } = inject('deleteReviewOnUi')
const { deleteReplyOnUi } = inject('deleteReplyOnUi')

const state = reactive({
    confirmDialogBoxUi: {
        show: false,
        title: '确定要删除此评论吗？',
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

const isReview = computed(() => {
    return props.review.parentId === null
})

const isReply = computed(() => {
    return props.review.parentId !== null
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
        const response = await deleteOneReview(props.review.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result == false) throw new Error("删除失败！")
        store.setSuccessMsg("已删除！")

        if (isReply.value) {
            deleteReplyOnUi(props.review.id)
        }

        if (isReview.value) {
            deleteReviewOnUi(props.review.id)
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        toggleDialogLoading(false)
        dismissConfirmDialogBox()
    }
}
</script>