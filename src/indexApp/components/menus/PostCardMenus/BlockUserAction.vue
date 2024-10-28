<template>
    <div @click="showConfirmDialogBox">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">person_off</span>
        <div class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">
            不喜欢此用户
        </div>
        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
                class="fixed top-0"
                :ui="state.confirmBDialogUi"
                @choice="choose">
            </ConfirmDialogBox>
        </Teleport>
    </div>
</template>

<script setup>
import { reactive, inject } from 'vue'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'
import { createOneBlacklist } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'

const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    },
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})
const { deleteAllPostsOfUserOnUi } = inject('deleteAllPostsOfUserOnUi', { 'deleteAllPostsOfUserOnUi': () => { } })
const { deleteAllReviewsOfUserOnUi } = inject('deleteAllReviewsOfUserOnUi', { 'deleteAllReviewsOfUserOnUi': () => { } })
const { deleteAllUsersOfUserOnUi } = inject('deleteAllUsersOfUserOnUi', { 'deleteAllUsersOfUserOnUi': () => { } })

const state = reactive({
    confirmBDialogUi: {
        show: false,
        title: '屏蔽此用户？',
        confirmButton: {
            selected: false,
            color: 'text-onError',
            bgColor: 'bg-error'
        },
        cancelButton: {
            selected: false
        },
        loading: {
            show: false,
            text: '屏蔽后可在黑名单界面查看'
        }
    },
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
})

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        blockThisUser()
    } else {
        dismissConfirmDialogBox()
    }
}

function showConfirmDialogBox() {
    state.confirmBDialogUi.show = true
}

function dismissConfirmDialogBox() {
    state.confirmBDialogUi.show = false
}

function toggleDialogLoading(isLoading) {
    state.confirmBDialogUi.loading.show = isLoading
}

async function blockThisUser() {
    try {
        toggleDialogLoading(true)
        const response = await createOneBlacklist('USER', props.user.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const { id } = await response.json()
        if (id != props.user.id) throw new Error('操作失败，请稍后重试!')
        store.setSuccessMsg('将为您减少该用户的内容!')

        props.post ? deleteAllPostsOfUserOnUi(props.post.user.id) : dismissConfirmDialogBox()
        deleteAllReviewsOfUserOnUi(props.post.user.id) // 供Search组件使用
        deleteAllUsersOfUserOnUi(props.post.user.id) // 供Search组件使用
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        dismissConfirmDialogBox()
    }
}
</script>