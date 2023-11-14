<template>
    <div v-if="state.review != null" id="reply-detail">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction">
        </Header>
        <Review :review="state.review"></Review>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
            <IconLoading v-if="state.isLoading==true" class="h-5 w-5 text-slate-500"></IconLoading>
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
import Header from '@/components/tailwind/Header.vue'
import { onMounted, reactive } from 'vue'
import { getReviewById } from '@/api.js'
import { store } from '@/store'
import Review from '@/components/tailwind/Review.vue'
import { useRoute } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'

const $route = useRoute()

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
    isLoading:false
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

onMounted(() => {  
    const reviewId = $route.params.id
    getReview(reviewId)
})
</script>