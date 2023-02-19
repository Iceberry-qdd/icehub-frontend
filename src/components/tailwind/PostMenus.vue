<template>
    <div>
        <div @mouseleave="dismiss"
            class="flex flex-col z-[99] absolute min-w-[12rem] max-w-[18rem] h-auto left-[-10rem] top-0 bg-white rounded-[8px] shadow ring-1 ring-slate-900/5">
            <LinkCopyAction @dismissMenu="dismiss" :link="generateLink"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 rounded-t-[8px] active:bg-gray-200"></LinkCopyAction>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">生成海报</div>
            <BookmarkAction @dismissMenu="dismiss" :post="state.post"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200"></BookmarkAction>
            <FollowingAction v-if="!isMySelf" @dismissMenu="dismiss" :user="state.post.user"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200"></FollowingAction>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">对此内容不感兴趣</div>
            <div v-if="isAdmin" class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">管理员选项</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">屏蔽 {{ state.user.nickname }} 的所有内容</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">举报此内容</div>
            <VisibilityAction @dismissMenu="dismiss" :post="state.post" v-if="isMySelf"></VisibilityAction>
            <div v-if="isMySelf" class="py-2 px-4 w-full text-start hover:bg-gray-100 text-red-500 rounded-b-[8px] active:bg-gray-200">删除此内容</div>
        </div>
    </div>
</template>

<style scoped>
</style>

<script setup>
import { reactive, computed } from 'vue'
import BookmarkAction from '@/components/menus/BookmarkAction.vue'
import FollowingAction from '@/components/menus/FollowingAction.vue'
import LinkCopyAction from '../menus/LinkCopyAction.vue'
import VisibilityAction from '@/components/menus/VisibilityAction.vue'

const emit = defineEmits(['dismissMenu'])

const props = defineProps(['post'])

const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    user: props.post.user,
    post: props.post
})

function dismiss() { emit('dismissMenu') }

const generateLink = computed(() => { return window.location.href.replace(/index|profile.*/, `post/${state.post.id}`) })

const isMySelf = computed(() => {
    return state.user.id == state.curUser.id
})

const isAdmin=computed(()=>{
    return state.user.verified == true
})
</script>