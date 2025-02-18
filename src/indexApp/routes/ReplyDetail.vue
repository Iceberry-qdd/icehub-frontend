<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <div v-if="state.review != null" id="reply-detail">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :menu-action="state.headerConfig.menuAction">
        </Header>
        <Review :review="state.review"></Review>
        <Footer
            :is-loading="state.isLoading"
            :has-more="false"
            @fetch-more="undefined">
        </Footer>
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
import Footer from '@/indexApp/components/Footer.vue'

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
        if (!response.ok) throw new Error((await response.json()).message)

        state.review = await response.json()
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
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