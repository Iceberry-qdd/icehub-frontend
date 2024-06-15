<template>
    <div
        :id="`pm-${props.post.id}`"
        class="bg-white ring-1 ring-slate-900/5 shadow-lg">
        <div class="bg-white flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-gray-200 h-[0.35rem] rounded-full w-12" />
        </div>
        <div class="flex flex-col max-sm:grid max-sm:grid-cols-4 max-sm:place-items-center">
            <PinAction
                v-if="isMySelf"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]"
                :post="state.post">
            </PinAction>
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
                id="post-menus-visibility-action"
                class="action first:rounded-t-[8px] last:rounded-b-[8px]"
                :post="state.post"
                @show-sub-action="showVisibilitySubAction">
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
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
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
import { store } from '@/indexApp/js/store.js'
import BookmarkAction from '@/indexApp/components/menus/postCardMenus/BookmarkAction.vue'
import FollowingAction from '@/indexApp/components/menus/postCardMenus/FollowingAction.vue'
import LinkCopyAction from '@/indexApp/components/menus/postCardMenus/LinkCopyAction.vue'
import VisibilityAction from '@/indexApp/components/menus/postCardMenus/VisibilityAction.vue'
import DeletePostAction from '@/indexApp/components/menus/postCardMenus/DeletePostAction.vue'
import BlockPostAction from '@/indexApp/components/menus/postCardMenus/BlockPostAction.vue'
import BlockUserAction from '@/indexApp/components/menus/postCardMenus/BlockUserAction.vue'
import PosterGenerateAction from '@/indexApp/components/menus/postCardMenus/PosterGenerateAction.vue'
import AdminOperationAction from '@/indexApp/components/menus/postCardMenus/AdminOperationAction.vue'
import ReportPostProblemAction from '@/indexApp/components/menus/postCardMenus/ReportPostProblemAction.vue'
import CloseReviewAction from '@/indexApp/components/menus/postCardMenus/CloseReviewAction.vue'
import PinAction from '@/indexApp/components/menus/postCardMenus/PinAction.vue'

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
    post: props.post,
    showVisibilitySubAction: false
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
    return isPlannedPost.value == false && state.showVisibilitySubAction == false
})

const showGeneratePoster = computed(() => {
    return isPlannedPost.value == false && state.showVisibilitySubAction == false
})

const showBookmarkAction = computed(() => {
    return isPlannedPost.value == false && isMySelf.value == false && state.showVisibilitySubAction == false
})

const showFollowAction = computed(() => {
    return isMySelf.value == false && isPlannedPost.value == false && state.showVisibilitySubAction == false
})

const showBlockPostAction = computed(() => {
    return isMySelf.value == false && isPlannedPost.value == false && state.showVisibilitySubAction == false
})

const showAdminAction = computed(() => {
    return isAdmin.value == true && isPlannedPost.value == false && state.showVisibilitySubAction == false
})

const showBlockUserAction = computed(() => {
    return isMySelf.value == false && isPlannedPost.value == false && state.showVisibilitySubAction == false
})

const showReportAction = computed(() => {
    return isMySelf.value == false && isPlannedPost.value == false && state.showVisibilitySubAction == false
})

const showVisibilityAction = computed(() => {
    return isMySelf.value == true
})

const showDeletePostAction = computed(() => {
    return isMySelf.value == true && state.showVisibilitySubAction == false
})

const showCloseReviewAction = computed(() => {
    return state.curUser.id === state.post.user.id && isPlannedPost.value == false && state.showVisibilitySubAction == false
})

function showVisibilitySubAction(){
    state.showVisibilitySubAction = true
}

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
    if(store.MOBILE_MODE){
        document.querySelector("body").setAttribute("style", "overflow:hidden")
    }
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', handlePostMenusDismiss)
    if(store.MOBILE_MODE){
        document.querySelector("body").removeAttribute("style")
    }
})
</script>