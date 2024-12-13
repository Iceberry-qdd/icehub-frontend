<template>
    <div
        class="bg-[#00000066] dark:max-sm:bg-[#121212] fixed-page flex-row h-full items-center justify-center max-sm:bg-white max-sm:z-[999] modern-scrollbar-y sm:backdrop-blur-sm sm:flex w-full z-[111]"
        @click.self="dismiss">
        <div class="bg-white dark:bg-[#121212] max-sm:h-[calc(100vh-2.5rem)] max-sm:rounded-none modern-scrollbar-y overflow-y-auto rounded-[8px] sm:max-h-[80%] sm:min-h-[20%] sm:w-[36rem]">
            <Header
                v-show="!state.isLoading"
                class="sm:hidden sticky"
                :title="state.headerConfig.title"
                :go-back="state.headerConfig.goBack"
                :show-menu="state.headerConfig.showMenu"
                :menu-icon="state.headerConfig.menuIcon"
                :icon-tooltip="state.headerConfig.iconTooltip"
                @handle-action="state.submitReview = true">
                <div class="flex font-bold gap-x-2 items-center justify-start w-full">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div class="close-btn material-symbols-rounded text-[1.125rem]" @click="dismiss">close</div>
                    <div>{{ title }}</div>
                </div>
            </Header>
            <ReviewCard
                tire-direction="top"
                class="border-b-[1px] border-gray-100 dark:border-b-neutral-800"
                :review="props.parentReview ?? props.post">
            </ReviewCard>
            <ReviewEditor
                :post="props.post"
                :parent="props.parentReview"
                :submit="state.submitReview"
                tie-location="bottom"
                from-review-panel
                @dismiss="dismiss"
                @is-loading="({isLoading}) => { state.isLoading = isLoading }"
                @show-markdown-panel="({isShow}) => { state.showMarkdownPanel = isShow }"
                @submit="({submitting}) => {state.submitReview = submitting}">
            </ReviewEditor>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-unused-properties -->
<script setup>
import { reactive, computed, defineAsyncComponent } from 'vue'
import ReviewEditor from '@/indexApp/components/postDetail/ReviewEditor.vue'
import ReviewCard from '@/indexApp/components/replyDetail/ReviewCard.vue'
const Header = defineAsyncComponent(() => import('@/indexApp/components/Header.vue'))

const emits = defineEmits(['dismiss'])
const props = defineProps({
    /** 传入的被回复的评论对象 */
    parentReview: {
        type: Object,
        required: false,
        default: undefined
    },
    /** 传入的被回复的帖子对象， 与parentReview二选一传入 */
    post: {
        type:Object,
        required: false,
        default: undefined
    }
})
const state = reactive({
    headerConfig: {
        title: '',
        goBack: false,
        showMenu: true,
        menuIcon: 'done',
        iconTooltip: '提交'
    },
    // post: undefined,
    isLoading: false,
    showMarkdownPanel: false,
    submitReview: false
})

const title = computed(() => {
    const type = props.parentReview ? '回复' : '评论'
    return state.showMarkdownPanel ? '预览' : `撰写${type}`
})

// TODO 退出时保存用户的评论草稿
function dismiss() {
    emits('dismiss')
}
</script>