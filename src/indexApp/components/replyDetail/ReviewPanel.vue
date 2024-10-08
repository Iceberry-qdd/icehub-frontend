<template>
    <div
        class="bg-[#00000066] fixed-page flex-row h-full items-center justify-center modern-scrollbar-y sm:backdrop-blur-sm sm:flex w-full z-[111]"
        @click.self="dismiss">
        <div class="bg-white max-sm:h-[calc(100vh-2.5rem)] max-sm:rounded-none modern-scrollbar-y overflow-y-auto rounded-[8px] sm:max-h-[80%] sm:min-h-[20%] sm:w-[36rem]">
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

<style scoped>
.fade-enter-active {
    transition: opacity 0.15s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.15s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

@media not all and (min-width: 640px) {
    .fade-enter-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-leave-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-enter-from {
        translate: 0 100%;
    }

    .fade-leave-to {
        translate: 0 100%;
        opacity: 1;
    }
}
</style>

<!-- eslint-disable vue/no-unused-properties -->
<script setup>
import ReviewEditor from '@/indexApp/components/postDetail/ReviewEditor.vue'
import { reactive, computed } from 'vue'
import ReviewCard from '@/indexApp/components/replyDetail/ReviewCard.vue'
import Header from '@/indexApp/components/Header.vue'

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