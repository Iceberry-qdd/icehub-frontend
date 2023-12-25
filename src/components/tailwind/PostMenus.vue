<template>
    <div >
        <div :id="`pm-${props.post.id}`" class="flex flex-col min-w-[12rem] max-w-[18rem] bg-white rounded-[8px] shadow ring-1 ring-slate-900/5">
            <LinkCopyAction v-if="showLinkCopyAction" :link="generateLink"
                class="action last:rounded-b-[8px] first:rounded-t-[8px]">
            </LinkCopyAction>

            <PosterGenerateAction v-if="showGeneratePoster"
                class="action last:rounded-b-[8px] first:rounded-t-[8px]">
            </PosterGenerateAction>

            <BookmarkAction v-if="showBookmarkAction" :post="state.post"
                class="action last:rounded-b-[8px] first:rounded-t-[8px]">
            </BookmarkAction>

            <FollowingAction v-if="showFollowAction" :user="state.post.user"
                class="action last:rounded-b-[8px] first:rounded-t-[8px]">
            </FollowingAction>

            <BlockPostAction v-if="showBlockPostAction" :post="state.post"
                class="action last:rounded-b-[8px] first:rounded-t-[8px]">
            </BlockPostAction>

            <BlockUserAction v-if="showBlockUserAction" :post="state.post" :user="state.post.user"
                class="action last:rounded-b-[8px] first:rounded-t-[8px]">
            </BlockUserAction>

            <ReportPostProblemAction v-if="showReportAction"
                class="action last:rounded-b-[8px] first:rounded-t-[8px]">
            </ReportPostProblemAction>

            <VisibilityAction class="action last:rounded-b-[8px] first:rounded-t-[8px]" :post="state.post"
                 v-if="showVisibilityAction">
            </VisibilityAction>

            <CloseReviewAction class="action last:rounded-b-[8px] first:rounded-t-[8px]" :post="state.post"
                v-if="showCloseReviewAction">
            </CloseReviewAction>

            <AdminOperationAction v-if="showAdminAction"
                class="action last:rounded-b-[8px] first:rounded-t-[8px]">
            </AdminOperationAction>

            <DeletePostAction v-if="showDeletePostAction" :post = "state.post"
                class="action last:rounded-b-[8px] first:rounded-t-[8px] text-red-500">
            </DeletePostAction>
        </div>
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
import BookmarkAction from '@/components/tailwind/menus/BookmarkAction.vue'
import FollowingAction from '@/components/tailwind/menus/FollowingAction.vue'
import LinkCopyAction from '@/components/tailwind/menus/LinkCopyAction.vue'
import VisibilityAction from '@/components/tailwind/menus/VisibilityAction.vue'
import DeletePostAction from '@/components/tailwind/menus/DeletePostAction.vue'
import BlockPostAction from '@/components/tailwind/menus/BlockPostAction.vue'
import BlockUserAction from '@/components/tailwind/menus/BlockUserAction.vue'
import PosterGenerateAction from '@/components/tailwind/menus/PosterGenerateAction.vue'
import AdminOperationAction from '@/components/tailwind/menus/AdminOperationAction.vue'
import ReportPostProblemAction from '@/components/tailwind/menus/ReportPostProblemAction.vue'
import CloseReviewAction from '@/components/tailwind/menus/CloseReviewAction.vue'

const props = defineProps(['post'])
const { dismissPostMenus } = inject('dismissPostMenus')
const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    user: props.post.user,
    post: props.post
})

const generateLink = computed(() => {
    return window.location.href.replace(/index|profile.*/, `post/${state.post.id}`)
})

const isMySelf = computed(() => {
    return state.user.id == state.curUser.id
})

const isAdmin = computed(() => {
    return state.curUser.verified == true
})

const isPlannedPost = computed(() => {
    return state.post.plan == true
})

const showLinkCopyAction = computed(() => {
    return isPlannedPost.value == false
})

const showGeneratePoster = computed(() => {
    return isPlannedPost.value == false
})

const showBookmarkAction = computed(() => {
    return isPlannedPost.value == false && isMySelf.value == false
})

const showFollowAction = computed(() => {
    return isMySelf.value == false && isPlannedPost.value == false
})

const showBlockPostAction = computed(() => {
    return isMySelf.value == false && isPlannedPost.value == false
})

const showAdminAction = computed(() => {
    return isAdmin.value == true && isPlannedPost.value == false
})

const showBlockUserAction = computed(() => {
    return isMySelf.value == false && isPlannedPost.value == false
})

const showReportAction = computed(() => {
    return isMySelf.value == false && isPlannedPost.value == false
})

const showVisibilityAction = computed(() => {
    return isMySelf.value == true && isPlannedPost.value == false
})

const showDeletePostAction = computed(() => {
    return isMySelf.value == true
})

const showCloseReviewAction = computed(() => {
    return state.curUser.id === state.post.user.id && isPlannedPost.value == false
})

function handlePostMenusDismiss(event) {
    const postMenus = document.querySelector(`#pm-${props.post.id}`)
    const showPostMenusBtn = document.querySelector(`#pmb-${props.post.id}`)
    if (!postMenus.contains(event.target) && !showPostMenusBtn.contains(event.target)) {
        dismissPostMenus()
    }
    event.stopPropagation()
}

onMounted(() => {
    document.querySelector('#app').addEventListener('click', handlePostMenusDismiss)
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', handlePostMenusDismiss)
})
</script>