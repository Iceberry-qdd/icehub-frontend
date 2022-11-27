<template>
    <div class="card">
        <button type="button" class="btn menu">
            <i class="bi bi-chevron-down"></i>
        </button>
        <div class="user-info d-flex">
            <a class="position-relative" @click="showUserProfile(this.post.user.id)">
                <img class="avatar img-fluid" loading="lazy" :src="defaultAvatar" width="40" height="40">
                <i class="bi bi-patch-check-fill verify" v-if="this.post.user.verified"></i>
            </a>
            <div class="user-text">
                <div class="nickname">{{ this.post.user.nickname }}</div>
                <div class="post-time">{{ formattedTime }}</div>
            </div>
        </div>

        <div class="card-body">
            <p class="card-text" id="content">{{ this.post.content }}</p>
        </div>
        <div class="card-pics container" v-if="hasPics">
            <div class="row row-cols-3 gy-1 gx-1">
                <div class="col" v-for="(pic, idx) in this.post.attachmentsUrl">
                    <img loading="lazy" @click="showSlide(post.attachmentsUrl, idx)" class="pic img-fluid" :src="pic">
                </div>
            </div>
        </div>
        <div class="card-tags container" v-if="hasTags">
            <div class="row row-cols-auto gx-3">
                <div class="col" v-for="tag in this.post.tags">
                    <span class="badge bg-primary" id="badge"># {{ tag }}</span>
                </div>
            </div>
        </div>
        <div class="btn-group" role="group">
            <button type="button" class="btn op" @click="toggleRepost">
                <i class="bi bi-arrow-return-right"></i>
                {{ this.post.repostCount }}
            </button>
            <button type="button" class="btn op" @click="toggleReview">
                <i class="bi bi-chat-square"></i>
                {{ this.post.reviewCount }}
            </button>
            <button type="button" class="btn op" @click="toggleLike">
                <i class="bi bi-heart" v-if="!isLiked"></i>
                <i class="bi bi-heart-fill" style="color: red;" v-else></i>
                {{ this.post.likeCount }}
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
    margin-bottom: 0.5rem;
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

<script>
import { likeAPost, dislikeAPost } from '../../api'
import { store } from '../../store'
export default {
    props: ['post'],
    data() {
        return {
            reaction: [false, this.post.liked, false],
            store
        }
    },
    methods: {
        getCardId(key) {
        },
        showUserProfile(uid) {
            store.changeSelectUid(uid)
            //store.setMsg(uid)
        },
        async toggleLike() {
            try {
                if (this.post.liked == false) {
                    const response = await likeAPost(this.post.id)
                    if (!response.ok) throw new Error(await response.text())

                    const result = await response.text()
                    if (result == false) throw new Error("点赞失败!")

                    const lastCount = this.post.likeCount
                    this.post.likeCount = lastCount + 1
                    this.post.liked = true
                } else {
                    const response = await dislikeAPost(this.post.id)
                    if (!response.ok) throw new Error(await response.text())

                    const result = await response.text()
                    if (result == false) throw new Error("取消点赞失败!")

                    const lastCount = this.post.likeCount
                    this.post.likeCount = lastCount - 1
                    this.post.liked = false
                }
            } catch (e) {
                this.store.setMsg(e.message)
                console.error(e)
            }


        },
        toggleReview() {
            const lastState = this.reaction[1]
            this.reaction[1] = !lastState
        },
        toggleRepost() {
            const lastState = this.reaction[0]
            this.reaction[0] = !lastState
        },
        showSlide(urls, idx) {
            document.querySelector("body").setAttribute("style", "overflow:hidden")
            this.store.showSlide(urls, idx)
        }
    },
    computed: {
        defaultAvatar() {
            if (this.post.user.avatarUrl == null) {
                return `https://api.multiavatar.com/${this.post.user.nickname}.svg`
            } else {
                return this.post.user.avatarUrl
            }
        },
        hasPics() {
            return this.post.attachmentsUrl.length != 0
        },
        hasTags() {
            return this.post.tags != undefined && this.post.tags.length != 0
        },
        isLiked() {
            return this.post.liked
        },
        formattedTime() {
            let now = new Date()
            let postTime = new Date(Number.parseInt(this.post.createdTime))

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
        }
    },
    created() {
    }
}
</script>