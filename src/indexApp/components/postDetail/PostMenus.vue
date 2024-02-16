<template>
    <div>
        <div
            :id="`pm-${props.post.id}`"
            class="bg-white flex flex-col max-w-[18rem] min-w-[12rem] ring-1 ring-slate-900/5 rounded-[8px] shadow-lg">
            <LinkCopyAction
                v-if="showLinkCopyAction"
                :link="generateLink"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </LinkCopyAction>

            <PosterGenerateAction
                v-if="showUnImpl && showGeneratePoster"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
                <!-- TODO implement it. -->
            </PosterGenerateAction>

            <BookmarkAction
                v-if="showBookmarkAction"
                :post="state.post"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </BookmarkAction>

            <FollowingAction
                v-if="showFollowAction"
                :user="state.post.user"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </FollowingAction>

            <BlockPostAction
                v-if="showBlockPostAction"
                :post="state.post"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </BlockPostAction>

            <BlockUserAction
                v-if="showBlockUserAction"
                :post="state.post"
                :user="state.post.user"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
            </BlockUserAction>

            <ReportPostProblemAction
                v-if="showUnImpl && showReportAction"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
                <!-- TODO implement it. -->
            </ReportPostProblemAction>

            <VisibilityAction
                v-if="showVisibilityAction"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]"
                :post="state.post">
            </VisibilityAction>

            <CloseReviewAction
                v-if="showCloseReviewAction"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]"
                :post="state.post">
            </CloseReviewAction>

            <AdminOperationAction
                v-if="showUnImpl && showAdminAction"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]">
                <!-- TODO implement it. -->
            </AdminOperationAction>

            <DeletePostAction
                v-if="showDeletePostAction"
                :post="state.post"
                class="action first:rounded-t-[8px] last:rounded-b-[8px] text-red-500">
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
import BookmarkAction from '@/indexApp/components/menus/PostCardMenus/BookmarkAction.vue'
import FollowingAction from '@/indexApp/components/menus/PostCardMenus/FollowingAction.vue'
import LinkCopyAction from '@/indexApp/components/menus/PostCardMenus/LinkCopyAction.vue'
import VisibilityAction from '@/indexApp/components/menus/PostCardMenus/VisibilityAction.vue'
import DeletePostAction from '@/indexApp/components/menus/PostCardMenus/DeletePostAction.vue'
import BlockPostAction from '@/indexApp/components/menus/PostCardMenus/BlockPostAction.vue'
import BlockUserAction from '@/indexApp/components/menus/PostCardMenus/BlockUserAction.vue'
import PosterGenerateAction from '@/indexApp/components/menus/PostCardMenus/PosterGenerateAction.vue'
import AdminOperationAction from '@/indexApp/components/menus/PostCardMenus/AdminOperationAction.vue'
import ReportPostProblemAction from '@/indexApp/components/menus/PostCardMenus/ReportPostProblemAction.vue'
import CloseReviewAction from '@/indexApp/components/menus/PostCardMenus/CloseReviewAction.vue'

const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})
const { dismissPostMenus } = inject('dismissPostMenus')
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
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
    if (!postMenus || (!postMenus.contains(event.target) && !showPostMenusBtn.contains(event.target))) {
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