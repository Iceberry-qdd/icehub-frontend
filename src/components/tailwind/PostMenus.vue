<template>
    <div >
        <div :id="`pm-${props.post.id}`" class="flex flex-col min-w-[12rem] max-w-[18rem] bg-white rounded-[8px] shadow ring-1 ring-slate-900/5">
            <LinkCopyAction v-if="showLinkCopyAction" :link="generateLink"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 rounded-t-[8px] active:bg-gray-200">
            </LinkCopyAction>

            <div v-if="showGeneratePoster" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">生成海报</div>

            <BookmarkAction v-if="showBookmarkAction" :post="state.post"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">
            </BookmarkAction>

            <FollowingAction v-if="showFollowAction" :user="state.post.user"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">
            </FollowingAction>

            <BlockPostAction v-if="showBlockPostAction" :post="state.post"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">
            </BlockPostAction>

            <BlockUserAction v-if="showBlockUserAction" :post="state.post" :user="state.post.user"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">
            </BlockUserAction>

            <div v-if="showReportAction" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">举报此内容</div>

            <VisibilityAction :post="state.post" v-if="showVisibilityAction"></VisibilityAction>

            <div v-if="showAdminAction" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">管理员选项</div>

            <DeletePostAction v-if="showDeletePostAction" :post = "state.post"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 text-red-500 rounded-b-[8px] active:bg-gray-200">
            </DeletePostAction>
        </div>
    </div>
</template>

<style scoped>
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