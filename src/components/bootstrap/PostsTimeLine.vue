<template>
    <div>
        <PostCard v-for="(post, index) in state.posts" :post="post" :key="post.id" :index="index"></PostCard>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
            <IconLoading v-if="hasMore" class="h-5 w-5 text-slate-500"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>

</template>

<style scoped>

</style>

<script setup>
import PostCard from '@/components/bootstrap/PostCard.vue'
import { reactive, computed } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const props = defineProps(['posts', 'curPageIndex', 'totalPages'])

const state = reactive({
    posts: props.posts
})

const hasMore = computed(() => {
    return props.curPageIndex < props.totalPages
})

</script>