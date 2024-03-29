<template>
    <div
        class="flex flex-rows gap-x-3 items-center justify-start"
        @click="handleClick">
        <span class="material-icons-round no-hover p-0 text-[1.2rem]">person_off</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="btn-no-select">{{ `${props.user.blocking ? '解除屏蔽' : '屏蔽该用户'}` }}</div>
        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
                :ui="state.confirmBDialogUi"
                @choice="choose">
            </ConfirmDialogBox>
        </Teleport>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import {inject, reactive } from 'vue'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'
import { createOneBlacklist, deleteOneBlacklist } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'

const { refreshProfileOnUi } = inject('refreshProfileOnUi')
const { dismissProfileMenus } = inject('dismissProfileMenus')
const props = defineProps({
    /** 要屏蔽的用户对象 */
    user: {
        type: Object,
        required: true
    }
})

const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    loading: false,
    confirmBDialogUi: {
        show: false,
        title: `确定要${props.user.blocking ? '解除' : ''}屏蔽此用户吗？`,
        confirmButton: {
            text: `${props.user.blocking ? '解除' : '确定'}屏蔽`,
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: `${props.user.blocking ? '保持屏蔽' : '不屏蔽'}`,
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: `正在${props.user.blocking ? '解除' : ''}屏蔽......`,
            color: 'rgb(239 68 68)'
        }
    }
})

async function unblockUser() {
    try {
        state.confirmBDialogUi.loading.show = true
        const response = await deleteOneBlacklist('USER', props.user.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result) {
            store.setSuccessMsg('已解除屏蔽此用户')
            refreshProfileOnUi()
            state.confirmBDialogUi.show = false
        } else {
            throw new Error("解除屏蔽失败！")
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally{
        state.confirmBDialogUi.loading = false
        dismissProfileMenus()
    }
}

async function blockUser() {
    try {
        state.confirmBDialogUi.loading.show = true
        const response = await createOneBlacklist('USER', props.user.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const { id } = await response.json()
        if (id != props.user.id) throw new Error('屏蔽用户失败，请稍后重试!')
        store.setSuccessMsg('已屏蔽此用户')
        refreshProfileOnUi()
        state.confirmBDialogUi.show = false
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally{
        state.confirmBDialogUi.loading = false
        dismissProfileMenus()
    }
}

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        props.user.blocking ? unblockUser() : blockUser()
    } else {
        state.confirmBDialogUi.show = false
    }
}

function handleClick(){
    state.confirmBDialogUi.show = true
}
</script>