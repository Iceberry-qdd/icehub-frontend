<template>
    <div
        :id="`rm-${props.review.id}`"
        class="bg-white flex flex-col ring-1 ring-slate-900/5 shadow-lg">
        <div class="bg-white flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-gray-200 h-[0.35rem] rounded-full w-12" />
        </div>
        <div class="flex flex-col max-sm:grid max-sm:grid-cols-4 max-sm:place-items-center">
            <ShareLinkAction
                v-if="state.actionVisMap.get('ShareLinkAction')"
                :link="generateLink"
                class="action first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px]">
            </ShareLinkAction>
            <DeleteReviewAction
                v-if="state.actionVisMap.get('DeleteReviewAction')"
                :review="props.review"
                class="action first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] text-red-500">
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
    background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}

.action:active{
    background-color: rgb(229 231 235 / var(--tw-bg-opacity));
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
import ShareLinkAction from '@/indexApp/components/menus/reviewMenus/ShareLinkAction.vue'
import DeleteReviewAction from '@/indexApp/components/menus/reviewMenus/DeleteReviewAction.vue'

const { dismissReviewMenus } = inject('dismissReviewMenus')
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const curUser = JSON.parse(localStorage.getItem("CUR_USER"))
const props = defineProps({
    /** 传入的评论对象 */
    review: {
        type: Object,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    actionVisMap: new Map([
        [ShareLinkAction.__name, true],
        [DeleteReviewAction.__name, curUser.id === props.review.user.id],
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
    document.querySelector('#app').addEventListener('click', handleReviewMenusDismiss)
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', handleReviewMenusDismiss)
})
</script>