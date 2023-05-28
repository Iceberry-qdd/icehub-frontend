<template>
    <div class="card">
        <button type="button" class="btn menu">
            <down @click="state.isShowMenu = true" theme="outline" size="24" fill="#333" :strokeWidth="2" />
            <PostMenus id="post-menus" :post="state.post" @dismissMenu="state.isShowMenu = false" v-if="state.isShowMenu"></PostMenus>
        </button>
        <div class="user-info d-flex">
            <a class="position-relative" @click="showUserProfile(props.post.user.id)">
                <img @click="routeToUserProfile" class="avatar img-fluid" loading="lazy" :src="avatarUrl">
            </a>
            <div class="user-text">
                <div @click="routeToUserProfile" class="nickname cursor-pointer hover:underline flex flex-row items-center gap-1">
                    <div>{{ props.post.user.nickname }}</div>
                    <i class="bi bi-patch-check-fill verify" v-if="props.post.user.verified"></i>
                </div>
                <div class="post-time">
                    <div>发布于 {{ formattedTime }}</div>
                    <div v-if="state.post.status != 'PUBLIC'">•</div>
                    <div v-if="state.post.status != 'PUBLIC'">{{ postStatus }}</div>
                </div>
            </div>
        </div>

        <div class="m-card-body">
            <p class="card-text" id="content">
                <VueShowdown tag="markdown" :markdown="state.post.content"></VueShowdown>
            </p>
            <RepostCard v-if="state.post.root" :post="state.post.root" class="repostCard"></RepostCard>
        </div>
        <div class="card-pics container" v-if="hasPics">
            <div class="imgs-grid" :class="gridTemplateClass">
                <div class="col wrapper relative" :class="gridWrapperClass" v-for="(pic, idx) in props.post.attachmentsUrl" :key="idx" :index="idx">
                    <IconAltOn @mouseenter="state.showAltText[idx]=true" v-show="pic.altText && state.showAltText[idx]==false" class="alt-icon absolute btm-1 rgt-1 black-80-bg rounded-full pdg-1 box-content z-index-100 cursor-pointer"></IconAltOn>
                    <Transition name="fade">
                        <div @mouseleave="state.showAltText[idx]=false" v-show="pic.altText && state.showAltText[idx]==true" class="altTextContainer absolute bottom-0 w-full max-h-full h-fit overflow-scroll m-cursor-text black-85-bg white-text text-[11pt] z-index-100 p-3 leading-[1.5rem] text-justify break-words">
                            {{ pic.altText }}
                        </div>
                    </Transition>
                    <div class="absolute w-full h-full flex flex-row justify-center items-center z-[99]" :class="[pic.hidden==true?'flex':'hidden']">
                        <div @click="getImageUrlIgnoreNSFW(idx)" class="white-text text-[11pt] black-80-bg h-fit w-fit py-2 px-3 rounded-[8px] cursor-pointer">敏感内容</div>
                    </div>
                    <img loading="lazy" @click="showSlide(state.post.attachmentsUrl, idx)" class="pic m-pic img-fluid"
                        :class="gridWrapperClass" :src="getImageUrl(pic, idx)" :alt="pic.altText">
                    <div @click="playAnimateImage(idx)"
                        :class="[pic.contentType == 'image/gif' && state.showOriginUrl[idx] == false?'flex':'hidden']"
                        class="absolute flex justify-center items-center w-full h-full top-0 right-0  text-white cursor-pointer">
                        <IconGif class="w-[2.5rem] h-[2.5rem] rounded-full bg-[#000000BB] gif"></IconGif>
                    </div>
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
            <button type="button" class="btn op op-repost" @click="repostIt">
                <share theme="filled" size="18" :fill="isReposted ? '#198754' : '#333'" :strokeWidth="3"
                    :class="{ 'm-active': isReposted }" />
                {{ props.post.repostCount }}
            </button>
            <button type="button" class="btn op op-review" @click="toggleReviewPanel">
                <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                {{ props.post.reviewCount }}
            </button>
            <button type="button" class="btn op op-like" @click="toggleLike">
                <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3"
                    :class="isLiked ? 'liked' : ''" />
                {{ props.post.likeCount }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.alt-icon{
    widows: 1.6rem;
    height: 1.6rem;
}

.fade-enter-active{
    transition: translate 0.3s ease-in-out;
}

.fade-leave-active{
    transition: translate 0.3s ease-in-out;
}

.fade-enter-from{
    translate: 0 100%;
}

.fade-leave-to{
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

.z-index-100{
    z-index: 100 !important;
}

#post-menus{
    z-index: 102;
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

.btn-group {
    display: flex;
}

.gif {
    color: white;
}

.repostCard {
    margin-left: 4rem;
}

.m-active {
    background-color: #d1e7dd;
}

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

/* .img-wrapper-h-grid-2 {
    height: 160px;
}

.img-wrapper-h-grid-3 {
    height: 120px;
} */

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
    column-gap: 0.25rem;
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
    background-color: #fecaca;
}

.nickname {
    font-weight: bold;
    font-size: 14pt;
}

.verify {
    font-size: 11pt !important;
    color: #0d6efd;
}

.op {
    font-size: small;
}

.menu {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
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
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}

.card-pics {
    /* margin-left: 4rem; */
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    /* display: flex; */
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
import { computed, reactive, onMounted } from 'vue'
import { likeAPost, dislikeAPost, getImageUrlIgnoreHidden } from '@/api.js'
import router from '@/route.js';
import { store } from '@/store.js'
import { Down, Like, Message, Share } from '@icon-park/vue-next'
import { standardTime } from '@/utils/formatUtils.js'
import RepostCard from '@/components/tailwind/RepostCard.vue'
import PostMenus from '@/components/tailwind/PostMenus.vue'
import IconGif from '@/components/icons/IconGif.vue'
import IconAltOn from '@/components/icons/IconAltOn.vue'
import { VueShowdown } from 'vue-showdown'

const props = defineProps(['post'])

const state = reactive({
    reaction: [false, props.post.liked, false],
    showOriginUrl: [false, false, false, false, false, false, false, false, false],
    post: props.post,
    isShowMenu: false,
    showAltText: [false, false, false, false, false, false, false, false, false]
})

const likedIconTheme = computed(() => {
    return state.post.liked ? 'filled' : 'outline'
})

const likedIconColor = computed(() => {
    return isLiked.value ? '#FF0000' : '#333'
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

function routeToUserProfile() {
    router.push({ name: 'profile', params: { nickname: state.post.user.nickname } })
}

function showUserProfile(uid) { store.changeSelectUid(uid) }

function repostIt() { store.repost(state.post) }

async function toggleLike() {
    try {
        if (props.post.liked == false) {
            const response = await likeAPost(props.post.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error("点赞失败!")

            const lastCount = props.post.likeCount
            props.post.likeCount = lastCount + 1
            props.post.liked = true
        } else {
            const response = await dislikeAPost(props.post.id)
            if (!response.ok) throw new Error((await response.json()).error)

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

function showSlide(images, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(images, idx)
}

const avatarUrl = computed(() => {
    const defaultUrl = `https://api.multiavatar.com/${props.post.user.nickname}.svg`
    const { previewUrl, originUrl,contentType } = props.post.user.avatarUrl || [null, null,null]
    if(contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
})

const hasPics = computed(() => {
    return props.post.attachmentsUrl.length != 0
})

const hasTags = computed(() => {
    return props.post.tags != undefined && props.post.tags.length != 0
})

const isLiked = computed(() => { return props.post.liked })

const isReposted = computed(() => { return state.post.reposted })

const formattedTime = computed(() => { return standardTime(state.post.createdTime) })

function getImageUrl(image, idx) {
    const { originUrl, previewUrl } = image || [null, null]
    if (state.showOriginUrl[idx] == true) { return originUrl }
    return previewUrl || originUrl
}

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