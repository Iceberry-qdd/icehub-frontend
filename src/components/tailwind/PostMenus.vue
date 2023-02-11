<template>
    <div>
        <div @mouseleave="dismiss"
            class="flex flex-col z-[99] absolute min-w-[12rem] max-w-[18rem] h-auto left-[-10rem] top-0 bg-white rounded-[8px] shadow-sm ring-1 ring-slate-900/5">
            <LinkCopyAction @dismissMenu="dismiss" :link="generateLink"
                class="py-2 px-4 w-full text-start hover:bg-gray-100 rounded-t-[8px]"></LinkCopyAction>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">生成海报</div>
            <BookmarkAction @dismissMenu="dismiss" :post="state.post"
                class="py-2 px-4 w-full text-start hover:bg-gray-100"></BookmarkAction>
            <FollowingAction v-if="!isMySelf" @dismissMenu="dismiss" :user="state.post.user"
                class="py-2 px-4 w-full text-start hover:bg-gray-100"></FollowingAction>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">对此内容不感兴趣</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">管理员选项</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">屏蔽 {{ state.user.nickname }} 的所有内容</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">举报此内容</div>
            <div v-if="isMySelf" class="py-2 px-4 w-full text-start hover:bg-gray-100 text-red-500 rounded-b-[8px]">删除此内容</div>
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
</script>