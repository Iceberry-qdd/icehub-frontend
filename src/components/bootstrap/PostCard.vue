<template>
    <div class="card" :class="[state.post.type == 'MARKDOWN' ? 'card-mkd' : '']">
        <div ref="cardMask" id="card-mask" @click.self="routeToPost(state.post.id)" :class="cardMaskClass"></div>
        <button type="button" class="btn menu btn-no-select" :id="`pmb-${state.post.id}`">
            <down @click="state.isShowMenu = true" theme="outline" size="24" fill="#333" :strokeWidth="2"
                class="z-index-96" />
        </button>
        <Transition name="fade">
            <PostMenus class="post-menus" :post="state.post" v-if="state.isShowMenu">
            </PostMenus>
        </Transition>
        <div class="user-info d-flex">
            <Transition name="fade">
                <UserInfoPop @mouseleave="state.showUserInfoPop = false" :user="state.post.user"
                    v-if="state.showUserInfoPop" class="user-info-pop z-index-98">
                </UserInfoPop>
            </Transition>
            <a @mouseenter="state.showUserInfoPop = true" class="z-index-97 position-relative no-underline"
                @click="routeToUser(state.post.user.nickname)">
                <Avatar :user="state.post.user" class="w-[2.5rem] h-[2.5rem] rounded-[8px] text-[14pt]"></Avatar>
            </a>
            <div class="user-text z-index-97">
                <div @click="routeToUser(state.post.user.nickname)"
                    class="nickname cursor-pointer flex flex-row items-center gap-1">
                    <div>{{ state.post.user.nickname }}</div>
                    <i class="bi bi-patch-check-fill verify mb-1" v-if="state.post.user.verified"></i>
                </div>
                <div class="post-time">
                    <div>{{ state.post.plan ? `将于${formattedTime}发布` : formattedTime }}</div>
                    <div v-if="state.post.status != 'PUBLIC'">• {{ postStatus }}</div>
                    <div v-if="state.post.updatedTime">• 已编辑</div>
                </div>
            </div>
        </div>

        <div class="m-card-body" :class="[state.post.type == 'MARKDOWN' ? 'mkd' : '']"
            :style="{ 'margin-left': state.post.type == 'MARKDOWN' ? '0' : '3.5rem' }">
            <div v-if="state.shrinkContent" class="expand-btn" @click="state.shrinkContent = false">展开</div>
            <p class="card-text" id="content" :class="[state.shrinkContent ? 'max-height-50vh' : '']">
                <VueShowdown tag="markdown" :extensions="['exts']" :markdown="state.post.content"></VueShowdown>
            </p>
            <RepostCard
                v-if="state.post.rootId && !state.post.plan" :postId="state.post.rootId"
                class="z-index-96 relative">
            </RepostCard>
        </div>

        <div class="card-pics container z-index-96" v-if="hasPics">
            <div class="wrapper" v-for="(pic, idx) in state.post.attachmentsUrl" :key="idx" :style="wrapperStyle">
                <IconAltOn @mouseenter="state.showAltText[idx] = true" v-if="pic.altText && state.showAltText[idx] == false"
                    class="alt-icon absolute btm-1 rgt-1 black-80-bg rounded-full pdg-1 box-content z-index-100 cursor-pointer">
                </IconAltOn>
                <Transition name="alt">
                    <div @mouseleave="state.showAltText[idx] = false" v-if="pic.altText && state.showAltText[idx] == true"
                        class="altTextContainer absolute bottom-0 w-full max-h-full h-fit overflow-scroll m-cursor-text black-85-bg white-text text-[11pt] z-index-100 p-3 leading-[1.5rem] text-justify break-words">
                        {{ pic.altText }}
                    </div>
                </Transition>
                <div class="absolute w-full h-full flex flex-row justify-center items-center z-[99]" v-if="pic.hidden">
                    <div @click="getImageUrlIgnoreNSFW(pic.id)"
                        class="white-text text-[11pt] black-80-bg h-fit w-fit py-2 px-3 rounded-[8px] cursor-pointer">已隐藏
                    </div>
                </div>
                <img loading="lazy" @click="showSlide(state.post.attachmentsUrl, idx)" class="pic img-fluid m-pic"
                    :class="mPicClass" :src="getImageUrl(pic, idx)" :alt="pic.altText">
                <div @click="playAnimateImage(idx)" v-if="pic.contentType == 'image/gif' && !state.showOriginUrl[idx]"
                    class="absolute justify-center items-center w-full h-full top-0 right-0  text-white cursor-pointer">
                    <IconGif class="w-[2.5rem] h-[2.5rem] rounded-full bg-[#000000BB] gif"></IconGif>
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

        <div v-if="!state.post.plan" class="btn-group z-index-96"
            :class="[state.post.type == 'MARKDOWN' ? 'btn-group-mkd' : 'btn-group-umkd']" role="group">
            <Teleport to="#app">
                <RepostPanel v-if="state.showRepostPanel" :post="state.post" @dismiss="state.showRepostPanel = false">
                </RepostPanel>
            </Teleport>
            <button type="button" class="btn op op-repost" @click="repostIt">
                <share theme="filled" size="18" :fill="isReposted ? '#198754' : '#333'" :strokeWidth="3"
                    :class="{ 'm-active': isReposted }" />
                {{ humanizedNumber(state.post.repostCount) }}
            </button>
            <button @click="routeToPost(state.post.id)" type="button" class="btn op op-review">
                <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                {{ humanizedNumber(state.post.reviewCount) }}
            </button>
            <button type="button" class="btn op op-like" @click="toggleLike">
                <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3"
                    :class="isLiked ? 'liked' : ''" />
                {{ humanizedNumber(state.post.likeCount) }}
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url("bootstrap/dist/css/bootstrap.css");

.scheduled-card {
    z-index: 98 !important;
    background-color: #e5e7eb88 !important;
    pointer-events: none;
}

.alt-icon {
    widows: 1.6rem;
    height: 1.6rem;
}

.fade-enter-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

.alt-enter-active {
    transition: translate 0.3s ease-in-out;
}

.alt-leave-active {
    transition: translate 0.3s ease-in-out;
}

.alt-enter-from {
    translate: 0 100%;
}

.alt-leave-to {
    translate: 0 100%;
}

.m-card-body .expand-btn {
    z-index: 96;
    position: absolute;
    left: 50%;
    top: calc(100% - 50px);
    translate: -50% -100%;
    padding: 0.25rem 1rem;
    border-radius: 9999px;
    background-color: #cfe2ffAA;
    font-size: 11pt;
    cursor: pointer;
}

.altTextContainer::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
}

.m-cursor-text {
    cursor: text;
}

.pdg-1 {
    padding: 0.25rem;
}

.btm-1 {
    bottom: 0.3rem;
}

.rgt-1 {
    right: 0.3rem;
}

.black-80-bg {
    background-color: #000000AA !important;
}

.black-85-bg {
    background-color: #000000BB !important;
}

.white-text {
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

.z-index-100 {
    z-index: 100 !important;
}

.card-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 96;
    background-color: transparent;
}

.card-mask-mkd-shrink {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 96;
    background: linear-gradient(0deg, white 15%, transparent 50%);
}

.m-active {
    background-color: #d1e7dd;
}

.user-info-pop {
    position: absolute;
    top: 1rem;
    z-index: 103;
}

.btn-group-umkd {
    margin: 0 0.8rem 0 3.5rem;
}

.btn-group-mkd {
    margin: 0 0.8rem 0 0rem;
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

.container,
.row {
    --bs-gutter-x: 0;
    --bs-gutter-y: 0;
    /* width: 80%; */
}

.wrapper:hover img {
    transform: scale(1.2);
}

.card:hover {
    background-color: #F5F5F5;
    cursor: default;
}

.card-mkd:hover {
    background-color: transparent !important;
    cursor: auto !important;
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

.btn.menu {
    position: absolute;
    right: 3%;
}

.post-menus {
    z-index: 100;
    position: absolute;
    height: auto;
    right: 3%;
    top: 1rem;
    cursor: pointer;
}

.bi {
    font-size: 1.0rem;
    margin-right: 0.3rem;
}

.card {
    border-radius: 0 !important;
    border-bottom: 1px solid #EEEEEE;
    padding: 1rem 1rem 0 1rem;
    position: relative;
}

#verify-badge {
    background-color: red !important;
}

.m-card-body {
    padding: 0.5rem 0.8rem 0.5rem 0 !important;
}

.m-card-body.mkd {
    padding: 0 !important;
}

.card-text {
    text-align: justify;
    font-size: 11pt;
    word-break: break-all;
    /* max-height: 95vh; */
    overflow-y: hidden;
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.3rem;
}

.card-tags {
    margin: 0 0 0.5rem 2.8rem;
}

#badge {
    border-radius: 4rem !important;
    background-color: cadetblue !important;
}

.max-height-50vh {
    max-height: 50vh !important;
}

.font-16 {
    font-size: 16pt;
}

.rounded-16 {
    border-radius: 8px;
}

.no-underline {
    text-decoration: none;
}

.m-pic {
    width: 100%;
    object-fit: cover;
    border-radius: 4px;
    transition: transform 400ms;
}

.m-ratio-1 {
    aspect-ratio: 1 / 1;
}

.m-max-h-\[90vh\] {
    max-height: 90vh;
}
</style>

<script setup>
import { humanizedNumber } from '@/utils/formatUtils'
import { computed, onMounted, reactive, ref, provide, defineAsyncComponent } from 'vue'
import { likeAPost, dislikeAPost, getUserInfoByNickname, getImageUrlIgnoreHidden } from '@/api'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { humanizedTime } from '@/utils/formatUtils.js'
import { Down, Like, Message, Share } from '@icon-park/vue-next'
import IconGif from '@/components/icons/IconGif.vue'
import IconAltOn from '@/components/icons/IconAltOn.vue'
import { ws, MsgPack } from '../../websocket.js'
import { VueShowdown } from 'vue-showdown'
import Avatar from '@/components/tailwind/Avatar.vue'
const PostMenus = defineAsyncComponent(() => import('@/components/tailwind/PostMenus.vue')) //NOTE 组件字母小写会导致hmr失效
const UserInfoPop = defineAsyncComponent(() => import('@/components/tailwind/UserInfoPop.vue'))
const RepostCard = defineAsyncComponent(() => import('@/components/tailwind/RepostCard.vue'))
const RepostPanel = defineAsyncComponent(() => import('@/components/tailwind/RepostPanel.vue'))

const router = useRouter()
const props = defineProps(['post'])
const cardMask = ref()

const state = reactive({
    post: props.post,
    showOriginUrl: [false, false, false, false, false, false, false, false, false],
    reaction: [false, props.post.liked, false],
    showUserInfoPop: false,
    isShowMenu: false,
    showAltText: [false, false, false, false, false, false, false, false, false],
    user: JSON.parse(localStorage.getItem("CUR_USER")),
    shrinkContent: false,
    showRepostPanel: false
})

const gridColCount = computed(() => {
    const picCount = state.post.attachmentsUrl.length
    if (picCount === 0) return 0
    if (picCount === 1) return 1
    if ((picCount > 1 && picCount <= 2) || picCount == 4) return 2
    return 3
})

const wrapperStyle = reactive({
    width: `calc((100% - 0.3rem * ${gridColCount.value - 1} - 3.5rem) / ${gridColCount.value})`,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '4px'
})

const mPicClass = reactive({
    'm-ratio-1': gridColCount.value !== 1,
    'm-max-h-[90vh]': gridColCount.value === 1
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
    const lastLikedState = state.post.liked
    const lastCount = state.post.likeCount

    state.post.liked = !lastLikedState
    state.post.likeCount = !lastLikedState ? lastCount + 1 : lastCount - 1

    try {
        if (state.post.plan) throw new Error('该帖子尚未发布，无法进行点赞操作')
        if (lastLikedState == false) {
            const response = await likeAPost(state.post.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error("点赞失败!")
        } else {
            const response = await dislikeAPost(state.post.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error("取消点赞失败!")
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)

        state.post.liked = lastLikedState
        state.post.likeCount = lastCount
    }
}

function repostIt() { state.showRepostPanel = true }

function showSlide(images, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(images, idx)
}

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

const cardMaskClass = computed(() => ({
    'scheduled-card': state.post.plan,
    'card-mask-mkd-shrink': state.shrinkContent,
    'card-mask': !state.shrinkContent
}))

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

async function getImageUrlIgnoreNSFW(imageId) {
    const postId = state.post.id
    try {
        const response = await getImageUrlIgnoreHidden(postId, imageId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()

        const imageIndex = state.post.attachmentsUrl.findIndex(it => it.id === imageId)

        if (imageIndex != -1) {
            state.post.attachmentsUrl[imageIndex] = result
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function setSuitableHeight() {
    if (state.post.type == 'MARKDOWN' && cardMask.value.clientHeight > window.innerHeight / 2) {
        state.shrinkContent = true
    }
}

function dismissPostMenus() {
    state.isShowMenu = false
}

provide('dismissPostMenus', { dismissPostMenus })

onMounted(() => {
    setSuitableHeight()
})

</script>