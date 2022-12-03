<template>
    <div class="card">
        <button type="button" class="btn menu">
            <i class="bi bi-chevron-down"></i>
        </button>
        <div class="user-info d-flex">
            <a class="position-relative" @click="showUserProfile(props.post.user.id)">
                <img class="avatar img-fluid" loading="lazy" :src="defaultAvatar" width="40" height="40">
                <i class="bi bi-patch-check-fill verify" v-if="props.post.user.verified"></i>
            </a>
            <div class="user-text">
                <div class="nickname">{{ props.post.user.nickname }}</div>
                <div class="post-time">{{ formattedTime }}</div>
            </div>
        </div>

        <div class="card-body">
            <p class="card-text" id="content">{{ props.post.content }}</p>
        </div>
        <div class="card-pics container" v-if="hasPics">
            <div class="row row-cols-3 gy-1 gx-1">
                <div class="col" v-for="(pic, idx) in props.post.attachmentsUrl">
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
            <button type="button" class="btn op" @click="toggleRepost">
                <i class="bi bi-arrow-return-right"></i>
                {{ props.post.repostCount }}
            </button>
            <button type="button" class="btn op" @click="toggleReview">
                <i class="bi bi-chat-square"></i>
                {{ props.post.reviewCount }}
            </button>
            <button type="button" class="btn op" @click="toggleLike">
                <i class="bi bi-heart" v-if="!isLiked"></i>
                <i class="bi bi-heart-fill" style="color: red;" v-else></i>
                {{ props.post.likeCount }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");


.verify {
    position: absolute;
    left: 32px;
    top: 28px;
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
    border-bottom: 1px solid #DDDDDD;
    padding: 1rem 1rem 0 1rem;
}

.avatar {
    border-radius: 16%;
}

#verify-badge {
    background-color: red !important;
}

.card-body {
    margin-left: 2.5rem;
    padding-top: 0.5rem !important;
}

.user-text {
    margin-left: 1rem;
}

.card-text {
    text-align: justify;
    font-size: 11pt;
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
    margin-left: 2.8rem;
    margin-bottom: 1rem;
    display: flex;
}

.card-tags {
    /*margin-left: 2.8rem;*/
    margin: 0 0 0.5rem 2.8rem;
}

.row {
    width: 70%;
}

#badge {
    border-radius: 4rem !important;
    background-color: cadetblue !important;
}
</style>

<script setup>
import { computed, reactive } from 'vue';
import { likeAPost, dislikeAPost } from '../../api'
import { store } from '../../store'

const props = defineProps(['post'])

const state = reactive({
    reaction: [false, props.post.liked, false]
})

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
</script>