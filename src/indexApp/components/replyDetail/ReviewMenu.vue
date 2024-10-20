<template>
    <div
        :id="`rm-${props.review.id}`"
        class="bg-white dark:bg-[#1e1e1e] flex flex-col ring-1 ring-slate-900/5 shadow-lg">
        <div class="flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-gray-200 dark:bg-neutral-700 h-[0.35rem] rounded-full w-12" />
        </div>
        <div class="flex flex-col max-sm:grid max-sm:grid-cols-4 max-sm:place-items-center">
            <ShareAction
                v-if="state.actionVisMap.get('ShareAction')"
                :link="generateLink"
                type="REVIEW"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </ShareAction>
            <DeleteReviewAction
                v-if="state.actionVisMap.get('DeleteReviewAction')"
                :review="props.review"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </DeleteReviewAction>
        </div>
    </div>
</template>

<style scoped>
.action{
    padding: 0.5rem 0.75rem;
    width: 100%;
    text-align: start;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    column-gap: 0.75rem;
    user-select: none;
}

.action:hover{
    background-color: #f3f4f6;
}

.action:hover:where([theme="dark"], [theme="dark"] *){
    background-color: #262626;
}

.action:active{
    background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}

.action:active:where([theme="dark"], [theme="dark"] *){
    background-color: #404040;
}

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
    .action{
        padding: 0.5rem 0;
        width: auto;
        flex-direction: column;
        row-gap: 0.5rem;
        width: 100%;
    }

    .action:hover{
        background-color: transparent;
    }

    .action:active{
        background-color: transparent;
    }
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

<script setup>
import { reactive, computed, onMounted, onUnmounted, inject } from 'vue'
import ShareAction from '@/indexApp/components/menus/common/ShareAction.vue'
import DeleteReviewAction from '@/indexApp/components/menus/reviewMenus/DeleteReviewAction.vue'

const { userId:postCreatorId } = inject('postCreatorId')
const { dismissReviewMenus } = inject('dismissReviewMenus')
const curUser = JSON.parse(localStorage.getItem("CUR_USER"))
const props = defineProps({
    /** 传入的评论对象 */
    review: {
        type: Object,
        required: true
    }
})

const selfReview = computed(() => {
    return curUser.id === props.review.user.id
})

const selfPost = computed(() => {
    return curUser.id === postCreatorId.value
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    actionVisMap: new Map([
        [ShareAction.__name, true],
        // eslint-disable-next-line vue/no-ref-object-reactivity-loss
        [DeleteReviewAction.__name, selfReview.value || selfPost.value],
        [undefined, false] // 最后设置一个{undefined: false} 保证名字匹配不上时默认不显示
    ])
})

const generateLink = computed(() => {
    return `${window.location.origin}/reply/${props.review.id}`
})

function handleReviewMenusDismiss(event) {
    const reviewMenus = document.querySelector(`#rm-${props.review.id}`)
    const showReviewMenusBtn = document.querySelector(`#rmb-${props.review.id}`)
    if (!reviewMenus || (!reviewMenus.contains(event.target) && !showReviewMenusBtn.contains(event.target))) {
        dismissReviewMenus()
    }
    event.stopPropagation()
}

onMounted(() => {
    document.addEventListener('click', handleReviewMenusDismiss)
})

onUnmounted(() => {
    document.removeEventListener('click', handleReviewMenusDismiss)
})
</script>