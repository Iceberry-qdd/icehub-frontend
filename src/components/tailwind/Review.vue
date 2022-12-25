<template>
    <div>
        <div class="flex flex-col gap-y-4 px-[1rem] py-[1rem] border-gray-100 border-b-[1px]">
            <div class='flex flex-row pl-[0.5rem] justify-between items-center'>
                <div class="flex flex-row items-center gap-x-4">
                    <div class="w-[2.5rem] h-[2.5rem] border-gray-300 border-[1px] rounded-md">
                        <a href="as"><img :src="avatar" /></a>
                        <i v-if="props.review.user.verified"
                            class="bi bi-patch-check-fill verify relative text-[10pt] left-[30px] bottom-[12px] text-blue-500"></i>
                    </div>
                    <div>
                        <div class="text-[12pt] font-bold">{{ props.review.user.nickname }}</div>
                        <div class="text-[11pt]"> 回复 <span class="cursor-pointer  font-bold">@{{ replyTo }}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class='text-[10pt] text-gray-400'>{{ formattedTime }}</div>
                </div>
            </div>
            <div class="pl-[4rem] text-[12pt]">
                {{ props.review.content }}
            </div>
            <div class="flex flex-row justify-between px-[4rem]">
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2"
                    @click="toggleRepost">
                    <!-- <i class="bi bi-arrow-return-right"></i> -->
                    <span class="material-icons-round text-[14pt]">redo</span>
                    12k
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2"
                    @click="toggleReviewPanel">
                    <!-- <i class="bi bi-chat-square"></i> -->
                    <span class="material-icons-round text-[14pt]">chat_bubble_outline</span>
                    {{ props.review.reviewCount }}
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2" @click="toggleLike">
                    <span :class="{ liked: isLiked }" class="material-icons-round text-[14pt]">{{
                            isLiked ? 'favorite' : 'favorite_border'
                    }}</span>
                    {{ props.review.likeCount }}
                </button>
            </div>
        </div>
        <ReviewEditor v-if="state.showPanel" class="bg-gray-100" :post="props.post" :parent="props.review">
        </ReviewEditor>
        <div v-if="state.subReviews.length > 0 && state.showPanel">
            <Review class="bg-gray-100" v-for="(review, index) in state.subReviews" :review="review" :post="props.post"
                :key="review.id" :index="index"></Review>
        </div>

    </div>
</template>

<style scoped>
.liked {
    color: red;
}
</style>

<script setup>
import { computed, reactive, onMounted } from 'vue';
import { dislikeAReview, getReviewById, getSubReviewById, likeAReview } from '../../api';
import { humanizedTime } from '../../utils/formatUtils.js'
import ReviewEditor from './ReviewEditor.vue';
import { store } from '../../store';

const props = defineProps(['review', 'post'])

const state = reactive({
    parentReview: null,
    showPanel: false,
    subReviews: [],
    pageIndex: 1,
    pageSize: 10
})

const formattedTime = computed(() => {
    return humanizedTime(props.review.createdTime)
})

const replyTo = computed(() => {
    try {
        if (state.parentReview != null) {
            //console.log(state.parentReview.user)
            return state.parentReview.user.nickname
        } else if (props.post.user.nickname) {
            return props.post.user.nickname
        } else {
            throw new Error('获取评论用户名失败！')
        }
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
})

async function getParentReview(parentId) {
    try {
        const response = await getReviewById(parentId)
        if (!response.ok) throw new Error(await response.text())

        state.parentReview = await response.json()
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

async function toggleReviewPanel() {
    const isShow = state.showPanel
    if (isShow == false) {
        await getSubReview()
    }
    state.showPanel = !isShow
}

async function getSubReview() {
    try {
        const response = await getSubReviewById(props.review.id, state.pageIndex, state.pageSize)
        if (!response.ok) throw new Error(await response.text())

        state.subReviews = (await response.json()).content
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

async function toggleLike() {
    try {
        if (props.review.liked == false) {
            const response = await likeAReview(props.review.id)
            if (!response.ok) throw new Error(await response.text())

            const result = await response.text()
            if (result == false) throw new Error('点赞失败！')

            const lastCount = props.review.likeCount
            props.review.likeCount = lastCount + 1
            props.review.liked = true
        } else {
            const response = await dislikeAReview(props.review.id)
            if (!response.ok) throw new Error(await response.text())

            const result = await response.text()
            if (result == false) throw new Error('取消点赞失败！')

            const lastCount = props.review.likeCount
            props.review.likeCount = lastCount - 1
            props.review.liked = false
        }
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

const isLiked = computed(() => {
    return props.review.liked
})

const avatar = computed(() => {
    if (props.review.user.avatarUrl == null) {
        return `https://api.multiavatar.com/${props.review.user.nickname}.svg`
    } else {
        return props.review.user.avatarUrl
    }
})

onMounted(() => {
    if (props.review.parentId != null) {
        getParentReview(props.review.parentId)
    }
})

</script>