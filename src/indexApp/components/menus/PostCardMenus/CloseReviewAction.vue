<template>
    <div
        @click="showConfirmDialogBox">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">{{ icon }}</span>
        <div class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">
            {{ text }}
        </div>
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
import { reactive, computed, inject } from 'vue'
import { store } from '@/indexApp/js/store.js'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'
import { toggleCloseReviewApi } from '@/indexApp/js/api.js'

const { dismissPostMenus } = inject('dismissPostMenus')
const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    post: props.post,
    confirmDialogBoxUi: {
        show: false,
        title: `确定要${props.post.allowReview ? '关闭' : '打开'}评论功能吗?`,
        confirmButton: {
            text: `${props.post.allowReview ? '关闭' : '打开'}评论`,
            selected: false
        },
        cancelButton: {
            text: `保持${props.post.allowReview ? '打开' : '关闭'}`,
            selected: false
        },
        loading: {
            show: false,
            text: '正在关闭该帖子的评论功能......'
        }
    }
})

const text = computed(() => {
    return `${props.post.allowReview ? '关闭' : '打开'}评论`
})

const icon = computed(() => {
    return props.post.allowReview ? 'voice_over_off' : 'record_voice_over'
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
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result == false) throw new Error("操作失败！")
        store.setSuccessMsg(`已${text.value}！`)
        // XXX 此处为方便，直接修改props对象的属性值
        // eslint-disable-next-line vue/no-mutating-props
        props.post.allowReview = !props.post.allowReview
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        toggleDialogLoading(false)
        dismissConfirmDialogBox()
        dismissPostMenus()
    }
}
</script>