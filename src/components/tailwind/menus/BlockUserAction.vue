<template>
    <div @click="showConfirmDialogBox" class="flex flex-rows justify-start items-center gap-x-3">
        <span class="material-icons-round no-hover">person_off</span>
        <div>不喜欢此作者</div>
        <Teleport to="#app">
            <ConfirmDialogBox
                ref="confirmDialogBox"
                @choice="choose"
                v-if="state.confirmBDialogUi.show"
                :ui="state.confirmBDialogUi">
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
import ConfirmDialogBox from '@/components/tailwind/menus/ConfirmDialogBox.vue'
import { createOneBlacklist } from '@/api'
import { store } from '@/store.js'

const props = defineProps(['post', 'user'])
const { deletePostOnUi } = inject('deletePostOnUi')

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
    }
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

function toggleDialogLoading(isLoading){
    state.confirmBDialogUi.loading.show = isLoading
}

async function blockThisUser() {
    try {
        toggleDialogLoading(true)
        const response = await createOneBlacklist('USER', props.user.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const { id } = await response.json()
        if (id != props.user.id) throw new Error('操作失败，请稍后重试!')
        store.setSuccessMsg('将为您减少此类内容!')

        props.post ? deletePostOnUi(props.post.id) : dismissConfirmDialogBox()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        toggleDialogLoading(false)
    }
}
</script>