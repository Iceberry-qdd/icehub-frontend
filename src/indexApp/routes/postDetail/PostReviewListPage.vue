<template>
    <div>
        <ReviewEditor 
            v-if="props.allowReview && !store.MOBILE_MODE"
            :post="props.post"
            :from-review-panel="false">
        </ReviewEditor>
        <div
            v-if="!props.allowReview"
            class="bg-primaryContainer-inActive cursor-default dark:bg-neutral-800 flex gap-2 h-[3rem] items-center justify-left my-[2%] p-4 rounded-lg translate-x-[2%] w-[96%]">
            <IconInfo class="bg-primary box-content dark:bg-onPrimary dark:text-neutral-800 p-[0.1rem] rounded-full text-white"></IconInfo>
            <span class="dark:text-white/50 text-[#303133] text-[11pt]">该帖子的评论功能已关闭</span>
        </div>
        <div v-if="state.reviews.length > 0">
            <TransitionGroup name="reviews">
                <Review
                    v-for="(review, index) in state.reviews"
                    :key="review.id"
                    :review="review"
                    :post="props.post"
                    :index="index"
                    @incr-review-count="review.reviewCount++">
                </Review>
            </TransitionGroup>
        </div>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewReview">
        </Footer>
    </div>
</template>

<script setup>
import { onMounted, reactive, provide, computed, watch } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { getPostReviews } from '@/indexApp/js/api.js'
import Review from '@/indexApp/components/postDetail/Review.vue'
import ReviewEditor from '@/indexApp/components/postDetail/ReviewEditor.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import Footer from '@/indexApp/components/Footer.vue'

const emits = defineEmits(['incrReviewCount'])
const props = defineProps({
    /** 是否允许评论 */
    allowReview: {
        type: Boolean,
        required: false,
        default: true
    },
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: false,
        default: undefined
    },
    /** 排序参数 */
    sort: {
        type: Object,
        required: false,
        default: () => { return { by: 'CREATE_TIME', direction: 'DESC' } }
    },
    /** 父级新发布的帖子 */
    newReview: {
        type: Object,
        required: false,
        default: undefined
    }
})
const state = reactive({
    reviews: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: new Date().getTime(),
    totalPages: 0,
    isLoading: false,
    showReviewPanel: false,
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function getReviews() {
    try {
        state.isLoading = true
        const response = await getPostReviews(props.post.id, state.pageIndex, state.pageSize, state.lastTimestamp, props.sort.by, props.sort.direction)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        state.reviews.push(...content)
        state.totalPages = totalPages
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

function fetchNewReview() {
    getReviews()
}

function newReviewOnUi({ review }) {
    emits('incrReviewCount')
    state.reviews.unshift(review)
}

function deleteReviewOnUi(reviewId) {
    if (!reviewId) return
    const preDeleteReviewIndex = state.reviews.findIndex(it => it.id == reviewId)
    if (preDeleteReviewIndex != -1) {
        state.reviews.splice(preDeleteReviewIndex, 1)
    }
}

watch(() => props.post, (newVal, _) => {
    if (!!newVal) {
        getReviews()
    }
})

watch(() => props.sort.by, (_newVal, _) => {
    resetPageParams()
    getReviews()
})

watch(() => props.sort.direction, (_newVal, _) => {
    resetPageParams()
    getReviews()
})

watch(() => props.newReview, (newVal, _) => {
    if(!!newVal){
        newReviewOnUi(newVal)
    }
})

function resetPageParams() {
    state.reviews = []
    state.pageIndex = 1
    state.pageSize = 10
    state.lastTimestamp = new Date().getTime()
    state.totalPages = 0
}

onMounted(async () => {
    if (!!props.post) {
        await getReviews()
    }
})

provide('deleteReviewOnUi', { deleteReviewOnUi })
provide('newReviewOnUi', { newReviewOnUi })
</script>