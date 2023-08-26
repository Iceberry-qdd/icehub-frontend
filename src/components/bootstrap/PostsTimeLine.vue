<template>
    <div>
        <TransitionGroup name="posts">
            <PostCard
                v-for="(post, index) in state.posts"
                :post="post"
                :key="post.id"
                :index="index"
                @deletePost="deletePost">
            </PostCard>
        </TransitionGroup>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
            <IconLoading v-if="hasMore || props.isLoading" class="h-5 w-5 text-slate-500"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>

</template>

<style scoped>
.posts-move,.posts-enter-active,.posts-leave-active{
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.posts-enter-from,.posts-leave-to{
    opacity: 0;
}

.posts-leave-active {
  position: absolute;
  width: 100%;
  height: fit-content;
}
</style>

<script setup>
import PostCard from '@/components/bootstrap/PostCard.vue'
import { reactive, computed } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import { store } from '@/store.js'

const props = defineProps(['posts', 'curPageIndex', 'totalPages', 'isLoading'])

const state = reactive({
    posts: props.posts
})

const hasMore = computed(() => {
    return props.curPageIndex < props.totalPages
})

function deletePost(args) {
    const preDeletePost = state.posts.find(it => it.id == args.postId)
    if (preDeletePost == undefined) {
        store.setErrorMsg("删除失败，该帖子不存在！")
        return
    }

    const index = state.posts.indexOf(preDeletePost)
    state.posts.splice(index, 1)
}
</script>