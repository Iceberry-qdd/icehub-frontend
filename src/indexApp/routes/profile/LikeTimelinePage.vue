<template>
    <div>
        <PostsTimeline
            :posts="state.posts"
            @delete-count="(count) => state.totalCount -= count">
        </PostsTimeline>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="getPosts">
        </Footer>
    </div>
</template>

<script setup>
import { reactive, computed, provide, watch } from 'vue'
import PostsTimeline from '@/indexApp/components/PostsTimeline.vue'
import { getLikePostsOfUser } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import Footer from '@/indexApp/components/Footer.vue'

const emits = defineEmits(['updateTabCount'])
const props = defineProps({
    /** 表明是谁的主页 */
    user: {
        type: Object,
        required: false,
        default: undefined // XXX 实际不应该接收undefined值，但由于异步路由初次传递来的值可能为undefined, tab同
    },
    /** 表示从哪个tab路由过来的 */
    tab: {
        type: Object,
        required: false,
        default: undefined
    }
})
const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    posts: [],
    pinnedIdTop: new Set(),
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: Date.now(),
    totalPages: 0,
    totalCount: 0,
    isLoading: false,
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

const isPrivateAccountAndNotFollowed = computed(() => {
    return props.user.confirmFollow && props.user.yourFollowStatus !== 'FOLLOW' && state.curUser.id !== props.user.id
})

async function getPosts() {
    try {
        state.isLoading = true
        const response = await getLikePostsOfUser(props.user.id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages, totalCount } = await response.json()

        for(let i = content.length - 1; i >= 0; i--){
            if(state.pinnedIdTop.has(content[i].id)){
                // 如果之前已经查询出该置顶帖子，则再次查询到时，不再显示
                content.splice(i, 1)
            }else if(content[i].top){
                state.pinnedIdTop.add(content[i].id)
            }
        }
        state.posts.push(...content)
        state.totalPages = totalPages
        state.totalCount = Math.max(state.totalCount, totalCount)

        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

function pinPostOnUi(postId, newTop){
    const preDelIndex = state.posts.findIndex(it => it.id === postId)
    if(preDelIndex< 0 || preDelIndex >= state.posts.length) return

    if(!newTop){
        state.posts[preDelIndex].top = newTop
        return
    }

    const removedPostArr = state.posts.splice(preDelIndex, 1)
    if(removedPostArr.length != 1) return
    removedPostArr[0].top = newTop
    state.posts.unshift(removedPostArr[0])
}

function postingNew(post) {
    state.posts.unshift(post)
    state.totalCount++
}

watch(() => state.totalCount, (newVal, _) => {
    emits('updateTabCount', {id: props.tab.id, count: newVal})
})

watch(() => props.user, (user, _) => {
    state.posts.forEach(post => {
        post.user.avatar = user.avatar
        post.user.banner = user.banner
    })
})

watch(() => props.user?.id, (id, oldVal) => {
    // 仅在id第一次不为undefined时才调用
    if (!id || !!oldVal) return

    const { lastPostAt, blocked, blocking } = props.user
    state.lastTimestamp = lastPostAt || Date.now()
    if (!blocked && !blocking && !isPrivateAccountAndNotFollowed.value) {
        getPosts()
    }
}, { immediate: true })

provide('postingNew', { postingNew })
provide('pinPostOnUi', { pinPostOnUi: pinPostOnUi })
</script>