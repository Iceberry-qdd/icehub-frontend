<template>
    <div>
        <TransitionGroup name="posts">
            <PostCard
                v-for="post in state.posts"
                :key="post.id"
                :post="post">
            </PostCard>
        </TransitionGroup>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div id="footer" class="flex flex-row h-[10vh] justify-center pt-4 text-gray-500 text-sm w-full">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <IconLoading v-if="hasMore || props.isLoading" class="h-5 text-slate-500 w-5"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>
</template>

<style scoped>
.posts-move,
.posts-enter-active,
.posts-leave-active {
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.posts-enter-from,
.posts-leave-to {
    opacity: 0;
}

.posts-leave-active {
    position: absolute;
    width: 100%;
    height: fit-content;
}
</style>

<script setup>
import PostCard from '@/indexApp/components/postDetail/PostCard.vue'
import { reactive, computed, provide } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import { store } from '@/indexApp/js/store.js'

const props = defineProps({
    /** 要显示的帖子列表 */
    posts: {
        type: Array,
        required: true
    },
    /** 房前分页页码 */
    curPageIndex: {
        type: Number,
        required: true
    },
    /** 总页数 */
    totalPages: {
        type: Number,
        required: true
    },
    /** 是否处于加载状态 */
    // eslint-disable-next-line vue/no-unused-properties
    isLoading: {
        type: Boolean,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    posts: props.posts
})

const hasMore = computed(() => {
    return props.curPageIndex < props.totalPages
})

function deletePostOnUi(postId) {
    if (!postId) return
    const preDeletePostIndex = state.posts.findIndex(it => it.id == postId)
    if (preDeletePostIndex != -1) {
        state.posts.splice(preDeletePostIndex, 1)
    }
}

function deleteAllPostsOfUserOnUi(userId) {
    if (!userId) return

    const preDeletePosts = state.posts.filter(it => it.user.id == userId)
    if (!preDeletePosts) {
        store.setErrorMsg("删除失败，该帖子不存在！")
        return
    }

    preDeletePosts.forEach(post => {
        const index = state.posts.indexOf(post)
        state.posts.splice(index, 1)
    })
}

provide('deletePostOnUi', { deletePostOnUi })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi })
</script>