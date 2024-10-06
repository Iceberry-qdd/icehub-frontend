<template>
    <div>
        <TransitionGroup name="posts">
            <PostCard
                v-for="post in state.posts"
                :key="post.id"
                :post="post">
            </PostCard>
        </TransitionGroup>
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
import { reactive, provide } from 'vue'
import { store } from '@/indexApp/js/store.js'

const emits = defineEmits(['deleteCount'])
const props = defineProps({
    /** 要显示的帖子列表 */
    posts: {
        type: Array,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    posts: props.posts
})

function deletePostOnUi(postId) {
    if (!postId) return
    const preDeletePostIndex = state.posts.findIndex(it => it.id == postId)
    if (preDeletePostIndex != -1) {
        state.posts.splice(preDeletePostIndex, 1)
    }
    emits('deleteCount', 1)
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
    emits('deleteCount', preDeletePosts.length)
}

provide('deletePostOnUi', { deletePostOnUi })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi })
</script>