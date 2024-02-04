<template>
    <div @click="showConfirmDialogBox" class="flex flex-rows justify-start items-center gap-x-3 btn-no-select">
        <span class="material-icons-round no-hover">{{ icon }}</span>
        <div>{{ text }}</div>
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
import { reactive, computed } from 'vue'
import { store } from '@/store.js'
import ConfirmDialogBox from '@/components/tailwind/menus/ConfirmDialogBox.vue'
import { toggleCloseReviewApi } from '@/api.js'

const props = defineProps(['post'])

const state = reactive({
    post: props.post,
    confirmDialogBoxUi: {
        show: false,
        title: `确定要${props.post.allowReview ? '关闭' : '打开'}评论功能吗?`,
        confirmButton: {
            text: `${props.post.allowReview ? '关闭' : '打开'}评论`,
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: `保持${props.post.allowReview ? '打开' : '关闭'}`,
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: '正在关闭该帖子的评论功能......',
            color: 'rgb(239 68 68)'
        }
    }
})

const text = computed(() => {
    return `${state.post.allowReview ? '关闭' : '打开'}评论`
})

const icon = computed(() => {
    return state.post.allowReview ? 'voice_over_off' : 'record_voice_over'
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
        toggleCloseReview()
    } else {
        dismissConfirmDialogBox()
    }
}

async function toggleCloseReview() {
    try {
        toggleDialogLoading(true)
        const response = await toggleCloseReviewApi(props.post)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) throw new Error("操作失败！")
        store.setSuccessMsg("操作成功！")
        state.post.allowReview = !state.post.allowReview
        dismissConfirmDialogBox()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        toggleDialogLoading(false)
    }
}

</script>