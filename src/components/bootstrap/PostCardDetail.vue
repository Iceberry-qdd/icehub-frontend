<template>
    <div class="card" @click="routeTo(props.post.id)">
        <button type="button" class="btn menu">
            <down theme="outline" size="24" fill="#333" :strokeWidth="2" />
        </button>
        <div class="user-info d-flex">
            <a class="position-relative" @click="showUserProfile(props.post.user.id)">
                <img class="avatar img-fluid" loading="lazy" :src="defaultAvatar">
                <i class="bi bi-patch-check-fill verify" v-if="props.post.user.verified"></i>
            </a>
            <div class="user-text">
                <div class="nickname">{{ props.post.user.nickname }}</div>
                <div class="post-time">{{ formattedTime }}</div>
            </div>
        </div>

        <div class="m-card-body">
            <p class="card-text" id="content">{{ props.post.content }}</p>
        </div>
        <div class="card-pics container" v-if="hasPics">
            <div class="imgs-grid" :class="gridTemplateClass">
                <div class="col wrapper" :class="gridWrapperClass" v-for="(pic, idx) in props.post.attachmentsUrl">
                    <img loading="lazy" @click="showSlide(post.attachmentsUrl, idx)" class="pic img-fluid"
                        :class="gridWrapperClass" :src="pic">
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
                <share theme="outline" size="18" fill="#333" :strokeWidth="3" />
                {{ props.post.repostCount }}
            </button>
            <button type="button" class="btn op op-review" @click="toggleReviewPanel">
                <!-- <i class="bi bi-chat-square"></i> -->
                <!-- <span class="material-icons-round">chat_bubble_outline</span> -->
                <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                {{ props.post.reviewCount }}
            </button>
            <button type="button" class="btn op op-like" @click="toggleLike">
                <!-- <span :class="{ liked: isLiked }" class="material-icons-round">{{ isLiked ? 'favorite' : 'favorite_border' }}</span> -->
                <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3" />
                {{ props.post.likeCount }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.imgs-grid {
    display: grid;
    gap: 0.35rem;
    width: 100%;
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

.op-repost {
    justify-content: flex-start;
}

.op-review {
    justify-content: center;
}

.op-like {
    justify-content: flex-end;
}

.btn:active {
    outline: none !important;
    border: 0;
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

.wrapper {
    overflow: hidden;
    border-radius: 4px;
}

.wrapper>img {
    width: 100%;
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
    column-gap: 0.5rem;
    border: 0;
    border-radius: 0;
    padding: 0.5rem 0;
}

.material-icons-round {
    font-size: 14pt;
    padding: 0.25rem;
}

.material-icons-round:hover {
    font-size: 14pt;
    padding: 0.25rem;
}

.liked {
    color: red;
}

.nickname {
    font-weight: bold;
    font-size: 14pt;
}

.verify {
    position: absolute;
    left: 40px;
    top: 34px;
    color: #0d6efd;
}

.op {
    font-size: small;
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
    width: 3rem;
    height: 3rem;
    border-radius: 16%;
}

#verify-badge {
    background-color: red !important;
}

.m-card-body {
    padding: 1rem 0 0.5rem 0 !important;
}

.card-text {
    text-align: justify;
    font-size: 14pt;
    word-break: break-all;
}

.post-time {
    color: darkgrey;
    font-size: small;
}

/* .pic {
    width: 8rem;
    height: 8rem;
    border-radius: 4px;
    object-fit: cover;
} */

.card-pics {
    /* margin-left: 4rem; */
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    display: flex;
}

.card-tags {
    /*margin-left: 2.8rem;*/
    margin: 0 0 0.5rem 3rem;
}

#badge {
    border-radius: 4rem !important;
    background-color: cadetblue !important;
}
</style>

<script setup>
import { computed, onUpdated, reactive } from 'vue';
import { likeAPost, dislikeAPost } from '@/api'
import router from '@/route.js';
import { store } from '@/store.js'
import { Down, Like, Message, Share } from '@icon-park/vue-next'
import { humanizedTime } from '@/utils/formatUtils.js'

const props = defineProps(['post'])

const state = reactive({
    reaction: [false, props.post.liked, false],
    post: props.post
})

const likedIconTheme = computed(() => {
    return state.post.liked ? 'filled' : 'outline'
})

const likedIconColor = computed(() => {
    return isLiked.value ? '#d0021b' : '#333'
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

function routeTo(postId) {
    router.push({ name: 'postDetail', params: { id: postId } })
}

function showUserProfile(uid) {
    store.changeSelectUid(uid)
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
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function toggleReviewPanel() {
    if (store.SHOW_REVIEW_PANEL == true) {
        store.dismissReviewPanel()
    } else {
        store.showReviewPanel()
    }
}

function toggleRepost() {
    const lastState = props.reaction[0]
    props.reaction[0] = !lastState
}

function showSlide(urls, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(urls, idx)
}

const defaultAvatar = computed(() => {
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

const formattedTime = computed(() => {
    return humanizedTime(state.post.createdTime)
})

onUpdated(() => {
    console.log(props.post)
})
</script>