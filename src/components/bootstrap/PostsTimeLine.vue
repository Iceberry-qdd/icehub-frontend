<template>
    <div>
        <PostCard v-for="(post, index) in state.posts" :post="post" :key="post.id" :index="index"></PostCard>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">没有更多了</div>
    </div>

</template>

<style scoped>

</style>

<script setup>
import PostCard from '@/components/bootstrap/PostCard.vue'
import {reactive } from 'vue'

const props = defineProps(['posts'])

const state = reactive({
    posts: props.posts
})

</script>