<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <div v-if="state.review != null" id="reply-detail">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :menu-action="state.headerConfig.menuAction">
        </Header>
        <Review :review="state.review"></Review>
        <div
            id="footer"
            class="flex flex-row h-[10vh] justify-center pt-4 text-gray-500 text-sm w-full">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <IconLoading v-if="state.isLoading == true" class="h-5 text-slate-500 w-5"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>
</template>

<style scoped>
#footer {
    height: 10vh;
}
</style>

<script setup>
import Header from '@/indexApp/components/Header.vue'
import { onMounted, reactive, provide } from 'vue'
import { getReviewById } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import Review from '@/indexApp/components/postDetail/Review.vue'
import { useRouter,useRoute } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'

const router = useRouter()
const route = useRoute()
const state = reactive({
    review: null,
    reviews: [],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    headerConfig: {
        title: '评论详情',
        goBack: true,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
    },
    isLoading: false
})

async function getReview(id) {
    try {
        const response = await getReviewById(id)
        if (!response.ok) throw new Error((await response.json()).error)

        state.review = await response.json()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function deleteReviewOnUi() {
    router.back()
}

onMounted(() => {
    const reviewId = route.params.id
    getReview(reviewId)
})

provide('deleteReviewOnUi', { deleteReviewOnUi })
</script>