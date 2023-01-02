<template>
    <div class="card">
        <button type="button" class="btn menu">
            <!-- <i class="bi bi-chevron-down"></i> -->
            <down theme="outline" size="24" fill="#333" :strokeWidth="2" />
        </button>
        <div class="user-info d-flex">
            <UserInfoPop @mouseleave="state.showUserInfoPop = false" :user="props.post.user"
                v-if="state.showUserInfoPop" class="user-info-pop"></UserInfoPop>
            <a @mouseenter="state.showUserInfoPop = true" class="position-relative"
                @click="routeToUser(props.post.user.nickname)">
                <img class="avatar img-fluid" loading="lazy" :src="avatar">
                <i class="bi bi-patch-check-fill verify" v-if="props.post.user.verified"></i>
            </a>
            <div class="user-text">
                <div class="nickname">{{ props.post.user.nickname }}</div>
                <div class="post-time">{{ formattedTime }}</div>
            </div>
        </div>

        <div class="m-card-body" @click="routeToPost(props.post.id)">
            <p class="card-text" id="content">{{ props.post.content }}</p>
        </div>
        <div class="card-pics container" v-if="hasPics">
            <div class="grid-item row row-cols-3">
                <div class="col wrapper" v-for="(pic, idx) in props.post.attachmentsUrl">
                    <img loading="lazy" @click="showSlide(post.attachmentsUrl, idx)" class="pic img-fluid" :src="pic">
                </div>
            </div>
        </div>
        <div class="card-tags container" v-if="hasTags">
            <div class="row row-cols-auto gx-3">
                <div class="col" v-for="tag in props.post.tags">
                    <span class="badge bg-primary" id="badge"># {{ tag }}</span>
                </div>
            </div>
        </div>
        <div class="btn-group" role="group">
            <button type="button" class="btn op op-repost" @click="toggleRepost">
                <!-- <i class="bi bi-arrow-return-right"></i> -->
                <!-- <span class="material-icons-round">shortcut</span> -->
                <share theme="outline" size="18" fill="#333" :strokeWidth="3" />
                {{ props.post.repostCount }}
            </button>
            <button type="button" class="btn op op-review" @click="toggleReview">
                <!-- <i class="bi bi-chat-square"></i> -->
                <!-- <span class="material-icons-round">chat_bubble_outline</span> -->
                <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                {{ props.post.reviewCount }}
            </button>
            <button type="button" class="btn op op-like" @click="toggleLike">
                <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3" />
                <!-- <span :class="{ liked: isLiked }" class="material-icons-round">{{ isLiked ? 'favorite' : 'favorite_border' }}</span> -->
                {{ props.post.likeCount }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.user-info-pop {
    position: absolute;
    top: 4.5rem;
    z-index: 103;
}

.btn-group {
    margin: 0 3.5rem;
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

.container,
.row {
    --bs-gutter-x: 0;
    --bs-gutter-y: 0;
    /* width: 80%; */
}

.container {
    width: 80% !important;
}

.wrapper {
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 4px;
}

.wrapper img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
    transition: transform 400ms;
}

.wrapper:hover img {
    transform: scale(1.2);

}

.card:hover {
    background-color: #F5F5F5;
    cursor: pointer;
}

.btn:active {
    outline: none !important;
    border: 0;
}

.btn {
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
    /* border: 1px solid #EEEEEE; */
}

#verify-badge {
    background-color: red !important;
}

.m-card-body {
    margin-left: 3.5rem;
    padding: 0.5rem 0 0.5rem 0 !important;
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
    margin-left: 3.5rem;
    ottom: 0.5rem;
    margin-top: 0.5rem;
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
import { computed, onUpdated, reactive } from 'vue';
import { likeAPost, dislikeAPost, getUserInfoByNickname } from '../../api'
import router from '../../route';
import { store } from '../../store'
import { humanizedTime } from '../../utils/formatUtils.js'
import UserInfoPop from '../tailwind/UserInfoPop.vue';
import { Down, Like, Message, Share } from '@icon-park/vue-next'

const props = defineProps(['post'])

const state = reactive({
    reaction: [false, props.post.liked, false],
    showUserInfoPop: false
})

function routeToPost(postId) {
    store.setSelectPost(props.post)
    router.push({ name: 'postDetail', params: { id: postId } })
}

async function routeToUser(nickname) {
    await getUser(nickname)
    router.push({ name: 'profile', params: { nickname: nickname } })
}

async function getUser(nickname) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error(await response.text())

        const user = await response.json()
        store.setSelectUser(user)
    } catch (e) {
        store.setMsg(e)
        console.error(e)
    }
}

async function toggleLike() {
    try {
        if (props.post.liked == false) {
            const response = await likeAPost(props.post.id)
            if (!response.ok) throw new Error(await response.text())

            const result = await response.text()
            if (result == false) throw new Error("点赞失败!")

            const lastCount = props.post.likeCount
            props.post.likeCount = lastCount + 1
            props.post.liked = true
        } else {
            const response = await dislikeAPost(props.post.id)
            if (!response.ok) throw new Error(await response.text())

            const result = await response.text()
            if (result == false) throw new Error("取消点赞失败!")

            const lastCount = props.post.likeCount
            props.post.likeCount = lastCount - 1
            props.post.liked = false
        }
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

function toggleReview() {
    const lastState = props.reaction[1]
    props.reaction[1] = !lastState
}

function toggleRepost() {
    const lastState = props.reaction[0]
    props.reaction[0] = !lastState
}

function showSlide(urls, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(urls, idx)
}

const avatar = computed(() => {
    if (props.post.user.avatarUrl == null) {
        return `https://api.multiavatar.com/${props.post.user.nickname}.svg`
    } else {
        return props.post.user.avatarUrl
    }
})

const hasPics = computed(() => {
    return props.post.attachmentsUrl.length != 0
})

const hasTags = computed(() => {
    return props.post.tags != undefined && props.post.tags.length != 0
})

const isLiked = computed(() => {
    return props.post.liked
})

const likedIconTheme = computed(() => {
    return props.post.liked ? 'filled' : 'outline'
})

const likedIconColor = computed(() => {
    return isLiked.value ? '#d0021b' : '#333'
})

const formattedTime = computed(() => {
    return humanizedTime(props.post.createdTime)
})

onUpdated(() => {
    //console.log(props.post)
})
</script>