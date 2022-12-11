<template>
    <div>
        <div class="flex flex-col gap-y-4 pl-8 pr-8 py-2 border-gray-100 border-b-[1px]">
            <div class='flex flex-row justify-between items-center'>
                <div class="flex flex-row items-center gap-x-2">
                    <div class="h-[40px] w-[40px] border-gray-300 border-[1px] rounded-md">
                        <a href="as"><img src="https://api.multiavatar.com/User2.svg" height="40" width="40" /></a>
                        <i class="bi bi-patch-check-fill verify relative text-[10pt] left-[30px] bottom-[12px] text-blue-500"></i>
                    </div>
                    <div class="text-[12pt] font-bold">{{ props.review.user.nickname }}</div>
                    <div class="text-[11pt]"> 回复 <span class="cursor-pointer  font-bold">@{{ replyTo }}</span>
                    </div>
                </div>
                <div>
                    <div class='text-[10pt] text-gray-400'>{{ formattedTime }}</div>
                </div>
            </div>
            <div class="pl-[48px] text-[12pt]">
                {{ props.review.content }}
            </div>
            <div class="flex flex-row justify-around">
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2"
                    @click="toggleRepost">
                    <!-- <i class="bi bi-arrow-return-right"></i> -->
                    <span class="material-icons-round text-[13pt]">redo</span>
                    12k
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2"
                    @click="toggleReviewPanel">
                    <!-- <i class="bi bi-chat-square"></i> -->
                    <span class="material-icons-round text-[13pt]">chat_bubble_outline</span>
                    {{ props.review.reviewCount }}
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2" @click="toggleLike">
                    <span :class="{ liked: props.review.isLiked }" class="material-icons-round text-[13pt]">{{props.review.isLiked ? 'favorite' :'favorite_border' }}</span>
                    {{ props.review.likeCount }}
                </button>
            </div>
        </div>
        <ReviewEditor v-if="state.showPanel" class="bg-gray-100" :post="props.post" :parent="props.review">
        </ReviewEditor>
        <div v-if="state.subReviews.length > 0 && state.showPanel">
            <Review class="bg-gray-100" v-for="(review, index) in state.subReviews" :review="review" :post="props.post" :key="review.id" :index="index"></Review>
        </div>

    </div>
</template>

<style>

</style>

<script setup>
import { computed, reactive, onMounted } from 'vue';
import { getReviewById, getSubReviewById } from '../../api';
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
        //console.log(state.parentReview)
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

async function toggleReviewPanel() {
    //console.log(props.review)
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
        //console.log(state.subReviews)
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

onMounted(() => {
    if (props.review.parentId != null) {
        getParentReview(props.review.parentId)
    }
})

</script>