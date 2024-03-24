<template>
    <div
        :id="`rm-${props.review.id}`"
        class="bg-white cursor-pointer flex flex-col max-w-[18rem] min-w-[10rem] ring-1 ring-slate-900/5 rounded-[8px] shadow-lg text-[12pt]">
        <ShareLinkAction
            v-if="state.actionVisMap.get('ShareLinkAction')"
            :link="generateLink"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </ShareLinkAction>
        <DeleteReviewAction
            v-if="state.actionVisMap.get('DeleteReviewAction')"
            :review="props.review"
            class="active:bg-gray-200 first:rounded-t-[8px] hover:bg-gray-100 last:rounded-b-[8px] px-[0.75rem] py-[0.5rem]">
        </DeleteReviewAction>
    </div>
</template>

<style scoped>
.action{
    padding: 0.5rem 0.75rem;
    width: 100%;
    text-align: start;
}

.action:hover{
    background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}

.action:active{
    background-color: rgb(229 231 235 / var(--tw-bg-opacity));
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