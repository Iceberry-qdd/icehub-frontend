<template>
    <TransitionGroup name="replies">
        <Reply
            v-for="(reply, index) in state.replies"
            :key="reply.id"
            class="z-10"
            :index="index"
            :reply="reply"
            :total-reply-count="reply.replyCount"
            :fetched-reply-count="reply.replyCount"
            @fetch-more-reply="undefined">
        </Reply>
    </TransitionGroup>
    <Footer
        :is-loading="state.isLoading"
        :has-more="hasMore"
        @fetch-more="fetchReviews">
    </Footer>
</template>

<style scoped>
.replies-move,
.replies-enter-active,
.replies-leave-active {
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.replies-enter-from,
.replies-leave-to {
    opacity: 0;
}

.replies-leave-active {
    position: absolute;
    width: 100%;
    height: fit-content;
}
</style>

<script setup>
import { reactive, watch, computed, provide, onMounted } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { getUserReviews as getReviews } from '@/indexApp/js/api.js'
import Reply from '@/indexApp/components/replyDetail/Reply.vue'
import Footer from '@/indexApp/components/Footer.vue'

const emits = defineEmits(['updateTabCount'])
const props = defineProps({
    /** 表明是谁的主页 */
    user: {
        type: Object,
        required: false,
        default: undefined // XXX 实际不应该接收undefined值，但传递过来的值可能为undefined
    },
    /** 表示从哪个tab路由过来的 */
    tabId: {
        type: String,
        required: true
    }
})
const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    replies: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: Date.now(),
    totalPages: 0,
    totalCount: 0,
    isLoading: true,
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

const isPrivateAccountAndNotFollowed = computed(() => {
    return props.user.confirmFollow && props.user.yourFollowStatus !== 'FOLLOW' && state.curUser.id !== props.user.id
})

async function fetchReviews(){
    try {
        state.isLoading = true
        const response = await getReviews(props.user.id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages, totalCount } = await response.json()

        state.replies.push(...content)
        state.totalPages = totalPages
        state.totalCount = Math.max(totalCount, state.totalCount)

        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

function postingNew(reply) {
    state.replies.unshift(reply)
    state.totalCount++
}

function deleteReviewOnUi(reviewId) {
    if (!reviewId) return
    const preDeleteReviewIndex = state.replies.findIndex(it => it.id == reviewId)
    if (preDeleteReviewIndex !== -1) {
        state.replies.splice(preDeleteReviewIndex, 1)
        state.totalCount--
    }
}

watch(() => state.totalCount, (newVal, _) => {
    emits('updateTabCount', {id: props.tabId, count: newVal})
})

watch(() => props.user, (user, old) => {
    console.log({new: user.id, old: old?.id || old})
    state.replies.forEach(reply => {
        reply.user.avatar = user.avatar
        reply.user.banner = user.banner
    })
})

onMounted(async () => {
    if (!props.user) return

    const { lastPostAt, blocked, blocking } = props.user
    state.lastTimestamp = lastPostAt || Date.now()
    if (!blocked && !blocking && !isPrivateAccountAndNotFollowed.value) {
        await fetchReviews()
    }
})

provide('postingNew', { postingNew })
provide('deleteReviewOnUi', { deleteReviewOnUi })
provide('deleteReplyOnUi', { deleteReplyOnUi: deleteReviewOnUi })
provide('postCreatorId', { userId: '' })
provide('newReview', { newReview: ({ review }) => postingNew(review) })
</script>