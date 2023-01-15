<template>
    <div v-if="state.isShow">
        <div @mouseleave="dismiss"
            class="flex flex-col z-[99] absolute min-w-[12rem] max-w-[18rem] h-auto left-[-10rem] top-0 bg-white rounded-[8px] shadow ring-1 ring-slate-900/5">
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">复制链接</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">生成海报</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">加入书签</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">{{ followText }}</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">对此内容不感兴趣</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">管理员选项</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">屏蔽 {{ state.user.nickname }} 的所有内容</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100">举报此内容</div>
            <div class="py-2 px-4 w-full text-start hover:bg-gray-100 text-red-500">删除此内容</div>
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, computed } from 'vue';

const emit = defineEmits(['dismissMenu'])

const props = defineProps(['user'])

const state = reactive({
    isShow: true,
    user: props.user
})

const followText = computed(() => {
    const { nickname, following } = state.user
    return following ? `取消订阅 ${nickname}` : `订阅 ${nickname}`
})

function dismiss() {
    emit('dismissMenu')
    state.isShow = false
}
</script>