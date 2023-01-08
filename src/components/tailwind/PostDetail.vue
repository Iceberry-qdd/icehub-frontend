<template>
    <div>
        <Header :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>
        <PostCardDetail v-if="state.post.user != undefined" :post="state.post"></PostCardDetail>
        <ReviewEditor v-if="store.SHOW_REVIEW_PANEL" :post="state.post"></ReviewEditor>
        <div v-if="state.reviews.length > 0">
            <Review v-for="(review, index) in state.reviews" :review="review" :post="state.post" :key="review.id"
                :index="index"></Review>
        </div>
        <div id="footer" class="w-full flex flex-row justify-center pt-4 text-sm text-gray-500">没有更多了</div>
    </div>
</template>

<style scoped>
#footer {
    height: 10vh;
}
</style>

<script setup>
import Header from '../tailwind/Header.vue'
import { onMounted, reactive } from 'vue';
import { getPostById, getPostReviews } from '../../api.js'
import { store } from '../../store';
import PostCardDetail from '../bootstrap/PostCardDetail.vue';
import Review from '../tailwind/Review.vue'
import ReviewEditor from '../tailwind/ReviewEditor.vue'

const state = reactive({
    post: store.SELECT_POST,
    reviews: [],
    pageIndex: 1,
    pageSize: 10,
    headerConfig: {
        title: '帖子详情',
        goBack: true,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
    }
})

async function getPost(id) {
    try {
        // console.log('a')
        const response = await getPostById(id)
        if (!response.ok) throw new Error(await response.text())

        state.post = await response.json()
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

async function getReviews(postId, pageIndex, pageSize) {
    try {
        const response = await getPostReviews(postId, pageIndex, pageSize)
        if (!response.ok) throw new Error(await response.text())

        const { content } = await response.json()
        state.reviews.push(...content)
        //console.log(state.reviews)
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

onMounted(() => {
    const postId = window.location.href.replace(new RegExp('.*/'), '')
    // console.log(id)
    if (state.post.user == undefined) {
        getPost(postId)
    }

    //console.log(state.post.id)
    getReviews(postId, state.pageIndex, state.pageSize)
})
</script>