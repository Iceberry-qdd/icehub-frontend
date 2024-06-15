<template>
    <div
        class="backdrop-blur-sm bg-[#00000066] flex-row h-full items-center justify-center sm:flex w-full z-[111]"
        @click.self="dismiss">
        <div class="bg-white max-sm:h-full max-sm:rounded-none max-sm:w-full overflow-y-auto rounded-[8px] sm:max-h-[80%] sm:min-h-[20%] w-[36rem]">
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
                    <div class="close-btn material-icons-round text-[1.125rem]" @click="dismiss">close</div>
                    <div>{{ title }}</div>
                </div>
            </Header>
            <ReviewCard :review="props.parentReview ?? props.post"></ReviewCard>
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
import { reactive, onMounted, onUnmounted, computed } from 'vue'
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

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style")
})
</script>