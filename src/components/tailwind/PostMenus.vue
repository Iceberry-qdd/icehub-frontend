<template>
    <div>
        <div @mouseleave="dismiss"
            class="flex flex-col min-w-[12rem] max-w-[18rem] bg-white rounded-[8px] shadow ring-1 ring-slate-900/5">
            <LinkCopyAction v-if="!isPlannedPost" @dismissMenu="dismiss" :link="generateLink"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 rounded-t-[8px] active:bg-gray-200"></LinkCopyAction>
            <div v-if="!isPlannedPost" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">生成海报</div>
            <BookmarkAction v-if="!isPlannedPost" @dismissMenu="dismiss" @deleteBookmark="deleteBookmark" :post="state.post"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200"></BookmarkAction>
            <FollowingAction v-if="!isMySelf && !isPlannedPost" @dismissMenu="dismiss" :user="state.post.user"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200"></FollowingAction>
            <div v-if="!isMySelf && !isPlannedPost" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">对此内容不感兴趣</div>
            <div v-if="isAdmin && !isPlannedPost" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">管理员选项</div>
            <div v-if="!isMySelf && !isPlannedPost" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">屏蔽 {{ state.user.nickname }} 的所有内容</div>
            <div v-if="!isMySelf && !isPlannedPost" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">举报此内容</div>
            <VisibilityAction @dismissMenu="dismiss" :post="state.post" v-if="isMySelf && !isPlannedPost"></VisibilityAction>
            <div v-if="isMySelf" @click="deletePost" class="py-2 px-4 w-full text-start hover:bg-gray-100 text-red-500 rounded-b-[8px] active:bg-gray-200">删除此内容</div>
        </div>
    </div>
</template>

<style scoped>
</style>

<script setup>
import { reactive, computed } from 'vue'
import BookmarkAction from '@/components/tailwind/menus/BookmarkAction.vue'
import FollowingAction from '@/components/tailwind/menus/FollowingAction.vue'
import LinkCopyAction from '../tailwind/menus/LinkCopyAction.vue'
import VisibilityAction from '@/components/tailwind/menus/VisibilityAction.vue'

const emits = defineEmits(['dismissMenu', 'deletePost', 'deleteBookmark'])

const props = defineProps(['post'])

const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    user: props.post.user,
    post: props.post
})

function dismiss() { emits('dismissMenu') }

function deletePost() {
    emits('deletePost', { postId: state.post.id })
}

function deleteBookmark(args) {
    emits('deleteBookmark', { postId: args.postId })
}

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
</script>