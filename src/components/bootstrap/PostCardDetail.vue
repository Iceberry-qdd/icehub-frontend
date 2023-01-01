<template>
    <div class="card" @click="routeTo(props.post.id)">
        <button type="button" class="btn menu">
            <down theme="outline" size="24" fill="#333" :strokeWidth="2"/>
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
                <share theme="outline" size="18" fill="#333" :strokeWidth="3"/>
                {{ props.post.repostCount }}
            </button>
            <button type="button" class="btn op op-review" @click="toggleReviewPanel">
                <!-- <i class="bi bi-chat-square"></i> -->
                <!-- <span class="material-icons-round">chat_bubble_outline</span> -->
                <message theme="outline" size="19" fill="#333" :strokeWidth="3"/>
                {{ props.post.reviewCount }}
            </button>
            <button type="button" class="btn op op-like" @click="toggleLike">
                <!-- <span :class="{ liked: isLiked }" class="material-icons-round">{{ isLiked ? 'favorite' : 'favorite_border' }}</span> -->
                <like theme="outline" size="20" fill="#333" :strokeWidth="3"/>
                {{ props.post.likeCount }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");
.op-repost{
    justify-content: flex-start;
}

.op-review{
    justify-content: center;
}

.op-like{
    justify-content: flex-end;
}

.btn:active {
    outline: none !important;
    border: 0;
}

.user-info{
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

.material-icons-round:hover{
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

.pic {
    width: 8rem;
    height: 8rem;
    border-radius: 4px;
    object-fit: cover;
}

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
import { likeAPost, dislikeAPost } from '../../api'
import router from '../../route';
import { store } from '../../store'
import {Down,Like,Message,Share} from '@icon-park/vue-next'

const props = defineProps(['post'])

const state = reactive({
    reaction: [false, props.post.liked, false]
})

function routeTo(postId) {
    //store.setSelectPostId(postId)
    router.push({ name: 'postDetail', params: { id: postId } })
}

function getCardId(key) {
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
        store.setMsg(e.message)
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
    let now = new Date()
    let postTime = new Date(Number.parseInt(props.post.createdTime))

    if (postTime.getFullYear() != now.getFullYear()) {
        return `${postTime.getFullYear()}-${postTime.getMonth() + 1}-${postTime.getDate()}`
    }

    if (postTime.getMonth() != now.getMonth()) {
        return `${postTime.getMonth() + 1}月${postTime.getDate()}日`
    }

    if (postTime.getDate() != now.getDate()) {
        return `${now.getDate() - postTime.getDate()}天前`
    }

    if (postTime.getHours() != now.getHours()) {
        return `${now.getHours() - postTime.getHours()}小时前`
    }

    if (postTime.getMinutes() != now.getMinutes()) {
        return `${now.getMinutes() - postTime.getMinutes()}分钟前`
    }

    if (postTime.getSeconds() != now.getSeconds()) {
        return `${now.getSeconds() - postTime.getSeconds()}秒前`
    }
    return postTime
})

onUpdated(() => {
    console.log(props.post)
})
</script>