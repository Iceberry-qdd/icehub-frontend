<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div
        class="border-b-[1px] pb-[0] pt-[1rem] px-[1rem] relative rounded-none"
        :class="cardContainerClass">
        <div
            v-if="showPinTop"
            class="-translate-y-2 flex flex-row gap-x-1 items-center justify-start">
            <div class="material-icons-round p-0 text-[1rem]">push_pin</div>
            <div class="text-[0.825rem] text-zinc-500">已置顶</div>
        </div>
        <div
            v-if="$route.name !== 'postDetail'"
            id="card-mask"
            ref="cardMask"
            :class="cardMaskClass"
            class="absolute inset-0 z-[96]"
            @click.self.stop="routeToPost(state.post.id)" />
        <button
            :id="`pmb-${state.post.id}`"
            type="button"
            class="absolute border-0 btn-no-select content-center flex flex-nowrap flex-row gap-x-[0.2rem] items-center outline-none py-[0.5rem] right-[3%] top-[0.5rem] z-[97]">
            <Down
                theme="outline"
                size="24"
                fill="#333"
                class="z-[96]"
                :stroke-width="2"
                @click="state.isShowMenu = true">
            </Down>
        </button>
        <Transition name="fade">
            <PostMenus
                v-if="state.isShowMenu"
                class="absolute cursor-pointer h-auto right-[3%] top-[1rem] z-[100]"
                :post="state.post">
            </PostMenus>
        </Transition>
        <div class="flex gap-[1rem]">
            <Transition name="fade">
                <UserInfoPop
                    v-if="state.showUserInfoPop"
                    :user="state.post.user"
                    class="absolute top-[1rem] z-[103]"
                    @mouseleave="state.showUserInfoPop = false">
                </UserInfoPop>
            </Transition>
            <a
                class="no-underline relative z-[97]"
                @mouseenter="state.showUserInfoPop = true"
                @click="routeToUser(state.post.user.nickname)">
                <Avatar
                    :user="state.post.user"
                    class="h-[2.5rem] rounded-[8px] text-[2.5rem] w-[2.5rem]">
                </Avatar>
            </a>
            <div class="z-[97]">
                <div
                    class="cursor-pointer flex flex-row font-bold gap-x-1 hover:underline hover:underline-offset-4 items-center"
                    @click="routeToUser(state.post.user.nickname)">
                    <div>{{ state.post.user.nickname }}</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconVerify v-if="state.post.user.verified" class="h-[0.9rem] text-blue-500 w-[0.9rem]"></IconVerify>
                </div>
                <div class="flex flex-row gap-x-[0.5rem] text-[9pt] text-gray-400">
                    <div :title="standardDateTime(state.post.createdTime)">
                        {{ state.post.plan ? `将于${formattedTime}发布` : formattedTime }}
                    </div>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div v-if="state.post.status != 'PUBLIC'">• {{ postStatus }}</div>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div v-if="state.post.updatedTime">• 已编辑</div>
                </div>
            </div>
        </div>

        <div :class="cardBodyClass">
            <div
                v-if="state.shrinkContent"
                class="-translate-x-1/2 -translate-y-full absolute bg-[#cfe2ffaa] cursor-pointer left-1/2 px-[1rem] py-[0.25rem] rounded-full text-[11pt] top-[calc(100%-50px)] z-[96]"
                @click="state.shrinkContent = false">
                展开
            </div>
            <p
                id="content"
                class="break-all overflow-y-hidden text-[11pt] text-justify"
                :class="[state.shrinkContent ? 'max-h-[50vh]' : '']">
                <VueShowdown
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.post.content">
                </VueShowdown>
            </p>
            <RepostCard
                v-if="state.post.rootId && !state.post.plan"
                :post-id="state.post.rootId"
                class="mt-[0.5rem] relative z-[96]">
            </RepostCard>
            <ImageGrid
                v-if="hasPics"
                :id="state.post.id"
                :images="state.post.images"
                type="post"
                class="bottom-[0.5rem]  mt-[0.5rem]"
                @real-image="handleRealImage">
            </ImageGrid>
        </div>

        <div
            v-if="!state.post.plan"
            class="flex flex-row items-center justify-center z-[96]"
            :class="cardButtonClass"
            role="group">
            <Teleport to="#app">
                <RepostPanel
                    v-if="state.showRepostPanel"
                    :post="state.post"
                    @dismiss="state.showRepostPanel = false">
                </RepostPanel>
            </Teleport>
            <button
                type="button"
                :title="`${state.post.repostCount} 转发`"
                class="active:border-0 active:outline-none basis-1/3 border-0 content-center flex flex-nowrap flex-row gap-x-[0.2rem] items-center justify-start py-[0.5rem] rounded-none text-[12pt] z-[97]"
                @click="repostIt">
                <Share
                    theme="filled"
                    size="18"
                    :fill="isReposted ? '#198754' : '#333'"
                    :stroke-width="3"
                    :class="{ 'bg-[#d1e7dd] hover:bg-[#d1e7dd]': isReposted }">
                </Share>
                {{ humanizedNumber(state.post.repostCount) }}
            </button>
            <button
                type="button"
                :title="`${state.post.reviewCount} 评论`"
                class="active:border-0 active:outline-none basis-1/3 border-0 content-center flex flex-nowrap flex-row gap-x-[0.2rem] items-center justify-center py-[0.5rem] rounded-none text-[12pt] z-[97]"
                @click="routeToPost(state.post.id)">
                <Message
                    theme="outline"
                    size="19"
                    fill="#333"
                    :stroke-width="3">
                </Message>
                {{ humanizedNumber(state.post.reviewCount) }}
            </button>
            <button
                type="button"
                :title="`${state.post.likeCount} 点赞`"
                class="active:border-0 active:outline-none basis-1/3 border-0 content-center flex flex-nowrap flex-row gap-x-[0.2rem] items-center justify-end py-[0.5rem] rounded-none text-[12pt] z-[97]"
                @click="toggleLike">
                <Like
                    :theme="likedIconTheme"
                    size="20"
                    :fill="likedIconColor"
                    :stroke-width="3"
                    :class="isLiked ? 'text-red-500 bg-red-200 hover:bg-red-200' : ''">
                </Like>
                {{ humanizedNumber(state.post.likeCount) }}
            </button>
        </div>
    </div>
</template>

<style scoped>
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
</style>

<!-- eslint-disable vue/no-ref-object-reactivity-loss -->
<script setup>
import { humanizedNumber, standardDateTime, humanizedTime } from '@/indexApp/utils/formatUtils.js'
import { computed, onMounted, reactive, ref, provide, defineAsyncComponent } from 'vue'
import { likeAPost, dislikeAPost, getUserInfoByNickname } from '@/indexApp/js/api.js'
import { useRouter, useRoute } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { Down, Like, Message, Share } from '@icon-park/vue-next'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { VueShowdown } from 'vue-showdown'
import Avatar from '@/components/Avatar.vue'
import ImageGrid from '@/indexApp/components/ImageGrid.vue'
const PostMenus = defineAsyncComponent(() => import('@/indexApp/components/postDetail/PostMenus.vue')) //NOTE 组件字母小写会导致hmr失效
const UserInfoPop = defineAsyncComponent(() => import('@/indexApp/components/postDetail/UserInfoPop.vue'))
const RepostCard = defineAsyncComponent(() => import('@/indexApp/components/postDetail/RepostCard.vue'))
const RepostPanel = defineAsyncComponent(() => import('@/indexApp/components/postDetail/RepostPanel.vue'))
import IconVerify from '@/components/icons/IconVerify.vue'

const router = useRouter()
const route = useRoute()
const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})
const cardMask = ref()
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    post: props.post,
    reaction: [false, props.post.liked, false],
    showUserInfoPop: false,
    isShowMenu: false,
    user: JSON.parse(localStorage.getItem("CUR_USER")),
    shrinkContent: false,
    showRepostPanel: false
})

const isIndentBody = computed(() => {
    const isPostDetailRoute = route.name === 'postDetail'
    const isMarkdown = state.post.type === 'MARKDOWN'
    return !isPostDetailRoute && !isMarkdown
})

const cardContainerClass = reactive({
    'hover:bg-[#F5F5F5]': isIndentBody.value,
    'cursor-default': isIndentBody.value
})

const cardBodyClass = reactive({
    'py-[0.5rem]': isIndentBody.value,
    'pr-[0.8rem]': isIndentBody.value,
    'p-0': !isIndentBody.value,
    'ml-[3.5rem]': isIndentBody.value,
    'ml-0': !isIndentBody.value
})

const cardButtonClass = reactive({
    'ml-[3rem]': isIndentBody.value,
    'ml-0': !isIndentBody.value,
    'mr-[0.8rem]': isIndentBody.value,
    'mr-0': !isIndentBody.value
})

function routeToPost(postId, hash = undefined) {
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

const hasPics = computed(() => {
    return state.post.images?.length !== undefined
})

const hasTags = computed(() => {
    return state.post.tags != undefined && state.post.tags.length != 0
})
const showPinTop = computed(() => {
    return state.post.top && route.name === 'profile'
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
    return route.name === 'postDetail' ? standardDateTime(state.post.createdTime) : humanizedTime(state.post.createdTime)
})

const cardMaskClass = computed(() => ({
    'z-[98]': state.post.plan,
    'bg-[#e5e7eb88]': state.post.plan,
    'pointer-events-none': state.post.plan,
    'bg-gradient-to-t': state.shrinkContent,
    'from-white': state.shrinkContent,
    'to-transparent': state.shrinkContent,
    'bg-transparent': !state.shrinkContent
}))

const postStatus = computed(() => {
    const status = state.post.status
    const statusMap = new Map([
        ['PUBLIC', '公开'],
        ['NOT_TIMELINE', '探索页内隐藏'],
        ['ONLY_FOLLOWER', '订阅者可见'],
        ['ONLY_CO_FOLLOWER', '互相订阅者可见'],
        ['ONLY_SPECIFIED', '指定用户可见'],
        ['ONLY_SELF', '仅自己可见']
    ])
    return statusMap.get(status)
})

function setSuitableHeight() {
    if (state.post.type == 'MARKDOWN' && cardMask.value.clientHeight > window.innerHeight / 2) {
        state.shrinkContent = true
    }
}

function dismissPostMenus() {
    state.isShowMenu = false
}

function handleRealImage({index, image}){
    state.post.images[index] = image
}

provide('dismissPostMenus', { dismissPostMenus })

onMounted(() => {
    if (route.name !== 'postDetail') {
        setSuitableHeight()
    }
})
</script>