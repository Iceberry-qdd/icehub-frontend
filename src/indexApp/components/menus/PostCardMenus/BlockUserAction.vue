<template>
    <div
        class="btn-no-select flex flex-rows gap-x-3 items-center justify-start"
        @click="showConfirmDialogBox">
        <span class="material-icons-round no-hover p-0 text-[16pt]">person_off</span>
        <div>不喜欢此用户</div>
        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
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
const { deleteAllPostsOfUserOnUi } = inject('deleteAllPostsOfUserOnUi')

const state = reactive({
    confirmBDialogUi: {
        show: false,
        title: '确定要屏蔽此用户吗？屏蔽后可在黑名单界面查看',
        confirmButton: {
            text: '屏蔽',
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: '不屏蔽',
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: '屏蔽后可在黑名单界面查看',
            color: 'rgb(239 68 68)'
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
        if (!response.ok) throw new Error((await response.json()).error)

        const { id } = await response.json()
        if (id != props.user.id) throw new Error('操作失败，请稍后重试!')
        store.setSuccessMsg('将为您减少该用户的内容!')

        props.post ? deleteAllPostsOfUserOnUi(props.post.user.id) : dismissConfirmDialogBox()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        toggleDialogLoading(false)
    }
}
</script>