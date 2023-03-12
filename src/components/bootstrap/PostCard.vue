<template>
    <div class="card">
        <div id="card-mask" @click.self="routeToPost(state.post.id)"></div>
        <button type="button" class="btn menu">
            <down @click="state.isShowMenu = true" theme="outline" size="24" fill="#333" :strokeWidth="2" class="z-index-96" />
            <Transition name="fade">
                <PostMenus :post="state.post" @dismissMenu="state.isShowMenu = false" v-if="state.isShowMenu"></PostMenus>
            </Transition>
        </button>
        <div class="user-info d-flex">
            <Transition name="fade">
                <UserInfoPop @mouseleave="state.showUserInfoPop = false" :user="state.post.user" v-if="state.showUserInfoPop" class="user-info-pop z-index-98"></UserInfoPop>
            </Transition>
            <a @mouseenter="state.showUserInfoPop = true" class="z-index-97 position-relative"
                @click="routeToUser(state.post.user.nickname)">
                <img class="avatar img-fluid" loading="lazy" :src="avatar">

            </a>
            <div class="user-text z-index-97">
                <div @click="routeToUser(state.post.user.nickname)"
                    class="nickname cursor-pointer flex flex-row items-center gap-1">
                    <div>{{ state.post.user.nickname }}</div>
                    <i class="bi bi-patch-check-fill verify mb-1" v-if="state.post.user.verified"></i>
                </div>
                <div class="post-time">
                    <div>{{ formattedTime }}</div>
                    <div v-if="state.post.status != 'PUBLIC'">•</div>
                    <div v-if="state.post.status != 'PUBLIC'">{{ postStatus }}</div>
                </div>
            </div>
        </div>

        <div class="m-card-body">
            <p class="card-text" id="content">{{ state.post.content }}</p>
            <RepostCard v-if="state.post.root" :post="state.post.root" class="z-index-96 relative"></RepostCard>
        </div>
        <div class="card-pics container z-index-96" :class="cardClass" v-if="hasPics">
            <div class="imgs-grid" :class="gridTemplateClass">
                <div class="col wrapper relative" :class="gridWrapperClass" v-for="(pic, idx) in state.post.attachmentsUrl" :key="idx" :index="idx">
                    <IconAltOn @mouseenter="state.showAltText[idx]=true" v-show="pic.altText && state.showAltText[idx]==false" class="absolute btm-1 rgt-1 black-80-bg rounded-full pdg-1 box-content z-index-100 cursor-pointer"></IconAltOn>
                    <Transition name="alt">
                        <div @mouseleave="state.showAltText[idx]=false" v-show="pic.altText && state.showAltText[idx]==true" class="altTextContainer absolute bottom-0 w-full max-h-full h-fit overflow-scroll m-cursor-text black-85-bg white-text text-[11pt] z-index-100 p-3 leading-[1.5rem] text-justify break-words">
                            {{ pic.altText }}
                        </div>
                    </Transition>
                    <div class="absolute w-full h-full flex-row justify-center items-center z-[99]" :class="[pic.hidden==true?'flex':'hidden']">
                        <div @click="getImageUrlIgnoreNSFW(idx)" class="white-text text-[11pt] black-80-bg h-fit w-fit py-2 px-3 rounded-[8px] cursor-pointer">敏感内容</div>
                    </div>
                    <img loading="lazy" @click="showSlide(state.post.attachmentsUrl, idx)" class="pic img-fluid"
                        :class="gridWrapperClass" :src="getImageUrl(pic, idx)" :alt="pic.altText">
                    <div @click="playAnimateImage(idx)"
                        :class="[pic.contentType == 'image/gif' && state.showOriginUrl[idx] == false?'flex':'hidden']"
                        class="absolute justify-center items-center w-full h-full top-0 right-0  text-white cursor-pointer">
                        <IconGif class="w-[2.5rem] h-[2.5rem] rounded-full bg-[#000000BB] gif"></IconGif>
                    </div>
                </div>
            </div>
        </div>  
        <div class="card-tags container z-index-96" v-if="hasTags">
            <div class="row row-cols-auto gx-3">
                <div class="col" v-for="tag in state.post.tags">
                    <span class="badge bg-primary" id="badge"># {{ tag }}</span>
                </div>
            </div>
        </div>
        <div class="btn-group z-index-96" role="group">
            <button type="button" class="btn op op-repost" @click="repostIt">
                <share theme="filled" size="18" :fill="isReposted ? '#198754' : '#333'" :strokeWidth="3"
                    :class="{ 'm-active': isReposted }" />
                {{ state.post.repostCount }}
            </button>
            <button @click="routeToPost(state.post.id)" type="button" class="btn op op-review">
                <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                {{ state.post.reviewCount }}
            </button>
            <button type="button" class="btn op op-like" @click="toggleLike">
                <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3"
                    :class="isLiked ? 'liked' : ''" />
                {{ state.post.likeCount }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.fade-enter-active{
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active{
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from{
    opacity: 0;
}

.fade-leave-to{
    opacity: 0;
}

.alt-enter-active{
    transition: translate 0.3s ease-in-out;
}

.alt-leave-active{
    transition: translate 0.3s ease-in-out;
}

.alt-enter-from{
    translate: 0 100%;
}

.alt-leave-to{
    translate: 0 100%;
}

.altTextContainer::-webkit-scrollbar{
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
}

.m-cursor-text{
    cursor: text;
}

.pdg-1{
    padding: 0.25rem;
}

.btm-1{
    bottom: 0.3rem;
}

.rgt-1{
    right: 0.3rem;
}
.black-80-bg{
    background-color: #000000AA !important;
}

.black-85-bg{
    background-color: #000000BB !important;
}
.white-text{
    color: white !important;
}
.gif {
    color: white;
}

.z-index-96 {
    z-index: 96 !important;
}

.z-index-97 {
    z-index: 97 !important;
}

.z-index-98 {
    z-index: 98 !important;
}

.z-index-100{
    z-index: 100 !important;
}

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

.container,
.row {
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

/* .img-wrapper-h-grid-2 {
    height: 160px;
}

.img-wrapper-h-grid-3 {
    height: 120px;
} */

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
    background-color: #fecaca;
}

.nickname {
    font-weight: bold;
}

.nickname:hover {
    text-decoration: underline;
}

.verify {
    font-size: 10pt !important;
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
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}

.card-pics {
    margin: 0.5rem 0.8rem 0 3.5rem;
    bottom: 0.5rem;
}

.card-pics-1 {
    display: block;
}

/* .card-pics-2,.card-pics-3 {
    display: flex;
} */

.card-tags {
    margin: 0 0 0.5rem 2.8rem;
}

#badge {
    border-radius: 4rem !important;
    background-color: cadetblue !important;
}
</style>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import PostMenus from '@/components/tailwind/PostMenus.vue' //NOTE 组件字母小写会导致hmr失效
import { likeAPost, dislikeAPost, getUserInfoByNickname,getImageUrlIgnoreHidden } from '@/api'
import router from '@/route';
import { store } from '@/store'
import { humanizedTime } from '@/utils/formatUtils.js'
import UserInfoPop from '@/components/tailwind/UserInfoPop.vue'
import { Down, Like, Message, Share } from '@icon-park/vue-next'
import RepostCard from '@/components/tailwind/RepostCard.vue'
import IconGif from '@/components/icons/IconGif.vue'
import IconAltOn from '@/components/icons/IconAltOn.vue'

const props = defineProps(['post'])

const state = reactive({
    post: props.post,
    showOriginUrl: [false, false, false, false, false, false, false, false, false],
    reaction: [false, props.post.liked, false],
    showUserInfoPop: false,
    isShowMenu: false,
    showAltText: [false, false, false, false, false, false, false, false, false]
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
    else if (picturesCount == 2 || picturesCount == 4) return 'img-wrapper-h-grid-2 m-pic'
    else return 'img-wrapper-h-grid-3 m-pic'
})

const gridTemplateClass = computed(() => {
    const picturesCount = state.post.attachmentsUrl.length
    if (picturesCount == 1) return 'imgs-grid-1'
    else if (picturesCount == 2 || picturesCount == 4) return 'imgs-grid-2'
    else return 'imgs-grid-3'
})

function getImageUrl(image, idx) {
    const { originUrl, previewUrl } = image || [null, null]
    if (state.showOriginUrl[idx] == true) { return originUrl }
    return previewUrl || originUrl
}

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

function showSlide(images, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(images, idx)
}


const avatar = computed(() => {
    const defaultUrl = `https://api.multiavatar.com/${state.post.user.nickname}.svg`
    const { previewUrl, originUrl,contentType } = state.post.user.avatarUrl || [null, null,null]
    if(contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
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

function resizePicture() {
    const picturesCount = state.post.attachmentsUrl.length
    if (picturesCount == 1) return
    const pics = document.querySelectorAll('.m-pic')
    pics.forEach(pic => { pic.style.height = pic.clientWidth + 'px' })
}

function playAnimateImage(idx) { state.showOriginUrl[idx] = true }

const postStatus = computed(() => {
    const status = state.post.status
    const statusMap = new Map([
        ['PUBLIC', '公开'],
        ['NOT_TIMELINE', '公共时间线上隐藏'],
        ['ONLY_FOLLOWER', '订阅者可见'],
        ['ONLY_CO_FOLLOWER', '互相订阅者可见'],
        ['ONLY_SPECIFIED', '指定用户可见'],
        ['ONLY_SELF', '仅自己可见']
    ])
    return statusMap.get(status)
})

async function getImageUrlIgnoreNSFW(imageIndex){
    const postId = state.post.id
    try{
        const response = await getImageUrlIgnoreHidden(postId,imageIndex)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        state.post.attachmentsUrl[imageIndex]=result
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

onMounted(() => {
    resizePicture()
})

</script>