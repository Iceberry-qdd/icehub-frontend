<template>
    <div class="card">
        <div id="card-mask" @click.self="routeToPost(state.post.id)"></div>
        <button type="button" class="btn menu">
            <down @click="state.isShowMenu = true" theme="outline" size="24" fill="#333" :strokeWidth="2" />
            <PostMenus :post="state.post" @dismissMenu="state.isShowMenu = false" v-if="state.isShowMenu"></PostMenus>
        </button>
        <div class="user-info d-flex">
            <UserInfoPop @mouseleave="state.showUserInfoPop = false" :user="state.post.user"
                v-if="state.showUserInfoPop" class="user-info-pop z-[98]"></UserInfoPop>
            <a @mouseenter="state.showUserInfoPop = true" class="z-[97] position-relative"
                @click="routeToUser(state.post.user.nickname)">
                <img class="avatar img-fluid" loading="lazy" :src="avatar">
                <i class="bi bi-patch-check-fill verify" v-if="state.post.user.verified"></i>
            </a>
            <div class="user-text z-[97]">
                <div @click="routeToUser(state.post.user.nickname)" class="nickname cursor-pointer">{{ state.post.user.nickname }}
                </div>
                <div class="post-time">{{ formattedTime }}</div>
            </div>
        </div>

        <div class="m-card-body">
            <p class="card-text" id="content">{{ state.post.content }}</p>
            <RepostCard v-if="state.post.root" :post="state.post.root" class="z-[96] relative"></RepostCard>
        </div>
        <div class="card-pics container z-[96]" :class="cardClass" v-if="hasPics">
            <div class="imgs-grid" :class="gridTemplateClass">
                <div class="col wrapper" :class="gridWrapperClass" v-for="(pic, idx) in state.post.attachmentsUrl" :key="idx" :index="idx">
                    <img loading="lazy" @click="showSlide(state.post.attachmentsUrl, idx)"  class="pic img-fluid" :class="gridWrapperClass" :src="pic">
                </div>
            </div>
        </div>
        <div class="card-tags container z-[96]" v-if="hasTags">
            <div class="row row-cols-auto gx-3">
                <div class="col" v-for="tag in state.post.tags">
                    <span class="badge bg-primary" id="badge"># {{ tag }}</span>
                </div>
            </div>
        </div>
        <div class="btn-group z-[96]" role="group">
            <button type="button" class="btn op op-repost" @click="repostIt">
                <share theme="filled" size="18" :fill="isReposted ? '#198754' : '#333'" :strokeWidth="3" :class="{ 'm-active': isReposted }" />
                {{ state.post.repostCount }}
            </button>
            <button @click="routeToPost(state.post.id)" type="button" class="btn op op-review">
                <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                {{ state.post.reviewCount }}
            </button>
            <button type="button" class="btn op op-like" @click="toggleLike">
                <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3" />
                {{ state.post.likeCount }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

#card-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 96;
    background-color: transparent;
}

.m-active {
    background-color: #d1e7dd;
}

.imgs-grid {
    display: grid;
    gap: 0.35rem;
}

.imgs-grid-3 {
    grid-template-columns: repeat(3, 1fr);
}

.imgs-grid-2 {
    grid-template-columns: repeat(2, 1fr);
}

.imgs-grid-1 {
    grid-template-columns: repeat(1, 1fr);
}

.user-info-pop {
    position: absolute;
    top: 4.5rem;
    z-index: 103;
}

.btn-group {
    margin: 0 0.8rem 0 3.5rem;
}

.op-repost {
    justify-content: flex-start;
}

.op-review {
    justify-content: center;
}

.op-like {
    justify-content: flex-end;
}

.user-info {
    gap: 1rem;
}

.grid-item {
    gap: 0.3rem;
}

.container,.row {
    --bs-gutter-x: 0;
    --bs-gutter-y: 0;
    /* width: 80%; */
}

.container {
    width: auto !important;
}

.wrapper {
    overflow: hidden;
    border-radius: 4px;
}

.wrapper>img {
    width: 100%;
    /* height: 160px; */
    object-fit: cover;
    border-radius: 4px;
    transition: transform 400ms;
}

.img-wrapper-h-grid-1 {
    max-height: 90vh;
    min-height: fit-content;
}

.img-wrapper-h-grid-2 {
    height: 160px;
}

.img-wrapper-h-grid-3 {
    height: 120px;
}

.wrapper:hover img {
    transform: scale(1.2);
}

.card:hover {
    background-color: #F5F5F5;
    cursor: default;
}

.btn:active {
    outline: none !important;
    border: 0;
}

.btn {
    z-index: 97;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: center;
    align-items: center;
    column-gap: 0.2rem;
    border: 0;
    border-radius: 0;
    padding: 0.5rem 0;
}

.material-icons-round {
    font-size: 16pt;
}

.liked {
    color: red;
}

.nickname {
    font-weight: bold;
}

.nickname:hover {
    text-decoration: underline;
}

.verify {
    position: absolute;
    left: 32px;
    top: 28px;
    color: #0d6efd;
}

.op {
    font-size: 12pt;
}

.menu {
    position: absolute;
    right: 1rem;
}

.bi {
    font-size: 1.0rem;
    margin-right: 0.3rem;
}

.card {
    border-radius: 0 !important;
    border-bottom: 1px solid #EEEEEE;
    padding: 1rem 1rem 0 1rem;
}

.avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 16%;
}

#verify-badge {
    background-color: red !important;
}

.m-card-body {
    margin-left: 3.5rem;
    padding: 0.5rem 0.8rem 0.5rem 0 !important;
}

.card-text {
    text-align: justify;
    font-size: 11pt;
    word-break: break-all;
}

.post-time {
    color: darkgrey;
    font-size: small;
}

.card-pics {
    margin: 0.5rem 0.8rem 0 3.5rem;
    bottom: 0.5rem;
}

.card-pics-1 {
    display: block;
}

.card-pics-2,
.card-pics-3 {
    display: flex;
}

.card-tags {
    margin: 0 0 0.5rem 2.8rem;
}

#badge {
    border-radius: 4rem !important;
    background-color: cadetblue !important;
}
</style>

<script setup>
import { computed, reactive } from 'vue';
import PostMenus from '@/components/tailwind/PostMenus.vue' //NOTE 组件字母小写会导致hmr失效
import { likeAPost, dislikeAPost, getUserInfoByNickname } from '@/api'
import router from '@/route';
import { store } from '@/store'
import { humanizedTime } from '@/utils/formatUtils.js'
import UserInfoPop from '@/components/tailwind/UserInfoPop.vue'
import { Down, Like, Message, Share } from '@icon-park/vue-next'
import RepostCard from '@/components/tailwind/RepostCard.vue'

const props = defineProps(['post'])

const state = reactive({
    post: props.post,
    reaction: [false, props.post.liked, false],
    showUserInfoPop: false,
    isShowMenu: false
})

const cardClass = computed(() => {
    const picturesCount = state.post.attachmentsUrl.length
    if (picturesCount == 1) return 'card-pics-1'
    else if (picturesCount == 2 || picturesCount == 4) return 'card-pics-2'
    else return 'card-pics-3'
})

const gridWrapperClass = computed(() => {
    const picturesCount = state.post.attachmentsUrl.length
    if (picturesCount == 1) return 'img-wrapper-h-grid-1'
    else if (picturesCount == 2 || picturesCount == 4) return 'img-wrapper-h-grid-2'
    else return 'img-wrapper-h-grid-3'
})

const gridTemplateClass = computed(() => {
    const picturesCount = state.post.attachmentsUrl.length
    if (picturesCount == 1) return 'imgs-grid-1'
    else if (picturesCount == 2 || picturesCount == 4) return 'imgs-grid-2'
    else return 'imgs-grid-3'
})

function routeToPost(postId) {
    store.setSelectPost(state.post)
    router.push({ name: 'postDetail', params: { id: postId } })
}

async function routeToUser(nickname) {
    await getUser(nickname)
    router.push({ name: 'profile', params: { nickname: nickname } })
}

async function getUser(nickname) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error((await response.json()).error)

        const user = await response.json()
        store.setSelectUser(user)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

async function toggleLike() {
    try {
        if (state.post.liked == false) {
            const response = await likeAPost(state.post.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error("点赞失败!")

            const lastCount = state.post.likeCount
            state.post.likeCount = lastCount + 1
            state.post.liked = true
        } else {
            const response = await dislikeAPost(state.post.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error("取消点赞失败!")

            const lastCount = state.post.likeCount
            state.post.likeCount = lastCount - 1
            state.post.liked = false
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function repostIt() { store.repost(state.post) }

function showSlide(urls, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(urls, idx)
}

const avatar = computed(() => {
    if (state.post.user.avatarUrl == null) {
        return `https://api.multiavatar.com/${state.post.user.nickname}.svg`
    } else {
        return state.post.user.avatarUrl
    }
})

const hasPics = computed(() => {
    return state.post.attachmentsUrl.length != 0
})

const hasTags = computed(() => {
    return state.post.tags != undefined && state.post.tags.length != 0
})

const isLiked = computed(() => { return state.post.liked })

const isReposted = computed(() => { return state.post.reposted })

const likedIconTheme = computed(() => {
    return state.post.liked ? 'filled' : 'outline'
})

const likedIconColor = computed(() => {
    return isLiked.value ? '#FF0000' : '#333'
})

const formattedTime = computed(() => {
    return humanizedTime(state.post.createdTime)
})

</script>