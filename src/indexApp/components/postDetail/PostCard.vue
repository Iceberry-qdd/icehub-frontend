<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div
        class="border-b-[1px] dark:border-b-[#1e1e1e] max-sm:pt-3 max-sm:px-3 pb-0 pt-4 px-4 relative rounded-none"
        :class="cardContainerClass">
        <div
            v-if="showPinTop"
            class="-translate-y-2 dark:text-white/25 flex flex-row gap-x-1 items-center justify-start">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="dark:text-inherit material-symbols-rounded p-0 text-[1rem]">push_pin</div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
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
            <span
                class="p-[0.4rem] rounded-full z-[96]"
                @click="state.isShowMenu = true">
                <IconDown
                    :size="24"
                    :stroke-width="2">
                </IconDown>
            </span>
        </button>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <Teleport to="#app" :disabled="!store.MOBILE_MODE">
            <div
                v-if="state.isShowMenu && store.MOBILE_MODE"
                class="bg-black/50 bottom-0 fixed fixed-page h-screen left-0 sm:hidden w-screen z-[1000]" />
            <Transition name="fade">
                <PostMenus
                    v-if="state.isShowMenu"
                    class="absolute cursor-pointer h-auto max-sm:bottom-0 max-sm:fixed max-sm:left-0 max-sm:pb-2 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-screen max-sm:z-[1000] right-[3%] rounded-[8px] sm:max-w-[18rem] sm:min-w-[12rem] sm:top-[1rem] z-[100]"
                    :post="state.post">
                </PostMenus>
            </Transition>
        </Teleport>
        <div class="flex gap-x-4 max-sm:gap-x-3">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                <div
                    v-if="state.showUserInfoPop && store.MOBILE_MODE"
                    class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1001]"
                    @click="state.showUserInfoPop = false" />
                <Transition name="fade">
                    <UserInfoPop
                        v-if="state.showUserInfoPop"
                        :user="state.post.user"
                        class="absolute h-fit max-sm:bottom-0 max-sm:fixed max-sm:left-0 max-sm:w-screen max-sm:z-[1001] sm:top-[1rem] w-[20rem] z-[103]"
                        @mouseleave="state.showUserInfoPop = false"
                        @close-user-info-pop="state.showUserInfoPop = false">
                    </UserInfoPop>
                </Transition>
            </Teleport>
            <a
                class="no-underline relative z-[97]"
                @mouseenter="handleAvatarMouseenter()"
                @click="handleAvatarClick()">
                <Avatar
                    :user="state.post.user"
                    class="h-[2.5rem] rounded-[8px] text-[2.5rem] w-[2.5rem]">
                </Avatar>
            </a>
            <div class="z-[97]">
                <div
                    class="cursor-pointer flex flex-row font-bold gap-x-1 items-center"
                    @click="routeToUser(state.post.user.nickname)">
                    <div
                        class="hover:underline hover:underline-offset-4">
                        {{ state.post.user.nickname }}
                    </div>
                    <IconVerify
                        v-if="state.post.user.verified"
                        class="dark:text-onPrimary h-[0.9rem] text-primary w-[0.9rem]">
                    </IconVerify>
                    <div
                        v-if="state.post.user.confirmFollow"
                        class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                        lock
                    </div>
                </div>
                <div class="dark:text-white/50 flex flex-row gap-x-[0.5rem] text-[9pt] text-gray-400">
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

        <div
            ref="cardBody"
            :class="cardBodyClass"
            class="max-sm:pr-0">
            <div class="relative">
                <div
                    v-if="state.shrinkContent"
                    class="-translate-x-1/2 absolute bg-primaryContainer-inActive bottom-2 cursor-pointer dark:bg-neutral-800 dark:text-onPrimary left-1/2 px-[1rem] py-[0.25rem] rounded-full text-[0.9rem] z-[96]"
                    @click="state.shrinkContent = false">
                    展开
                </div>

                <VueShowdown
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.post.content"
                    class="break-all overflow-y-hidden relative text-[11pt] text-justify"
                    :class="{'shrink-content': state.shrinkContent, 'max-h-[45vh]': state.shrinkContent}">
                </VueShowdown>
            </div>
            <RepostCard
                v-if="state.post.rootId && !state.post.plan"
                :post-id="state.post.rootId"
                class="mt-[0.5rem] relative z-[96]">
            </RepostCard>
            <ImageGrid
                v-if="hasPics"
                :id="`img-${state.post.id}`"
                :images="state.post.images"
                type="post"
                class="bottom-[0.5rem] mt-[0.5rem]"
                @real-image="handleRealImage">
            </ImageGrid>
        </div>

        <div
            v-if="!state.post.plan"
            class="flex flex-row items-center justify-center max-sm:mr-0 z-[96]"
            :class="cardButtonClass"
            role="group">
            <Teleport to="#app">
                <Transition name="fade">
                    <RepostPanel
                        v-if="state.showRepostPanel"
                        class="fixed top-0"
                        :post="state.post"
                        @dismiss="state.showRepostPanel = false">
                    </RepostPanel>
                </Transition>
            </Teleport>
            <button
                type="button"
                :title="`${state.post.repostCount} 转发`"
                class="active:border-0 active:outline-none basis-1/3 border-0 content-center flex flex-nowrap flex-row gap-x-[0.2rem] items-center justify-start py-[0.5rem] rounded-none text-[12pt] z-[97]"
                @click="repostIt">
                <span
                    class="-ml-2 icon-share p-[0.4rem] rounded-full"
                    :class="{ 'reposted': isReposted }">
                    <IconShare
                        :stroke-width="3">
                    </IconShare>
                </span>
                {{ humanizedNumber(state.post.repostCount) }}
            </button>
            <button
                type="button"
                :title="`${state.post.reviewCount} 评论`"
                :class="{'cursor-not-allowed text-[#C1C1C1] dark:text-white/25': !state.post.allowReview}"
                class="active:border-0 active:outline-none basis-1/3 border-0 content-center flex flex-nowrap flex-row gap-x-[0.2rem] items-center justify-center py-[0.5rem] rounded-none text-[12pt] z-[97]"
                @click="handleClickReviewBtn">
                <span
                    class="icon-message p-[0.4rem] rounded-full"
                    :class="{'not-allowed': !state.post.allowReview}">
                    <IconMessage
                        :size="19"
                        :stroke-width="3">
                    </IconMessage>
                </span>
                {{ humanizedNumber(state.post.reviewCount) }}
            </button>
            <button
                type="button"
                :title="`${state.post.likeCount} 点赞`"
                class="active:border-0 active:outline-none basis-1/3 border-0 content-center flex flex-nowrap flex-row gap-x-[0.2rem] items-center justify-end py-[0.5rem] rounded-none text-[12pt] z-[97]"
                @click="toggleLike">
                <span
                    class="icon-like p-[0.4rem] rounded-full"
                    :class="{'liked' : isLiked}">
                    <IconLike
                        :fill="likedIconFillColor"
                        :size="20"
                        :stroke-width="3">>
                    </IconLike>
                </span>
                {{ humanizedNumber(state.post.likeCount) }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.icon-share.reposted{
    background-color: #d1e7dd;
    color: #198754;
}

.icon-share.reposted:where([theme="dark"], [theme="dark"] *){
    background-color: #404040;
    color: rgb(255 255 255 / 0.5);
}

.icon-message.not-allowed{
    background-color: transparent;
    cursor: not-allowed;
}

.icon-message.not-allowed>.m-icon:where([theme="dark"], [theme="dark"] *){
    color: rgb(255 255 255 / 0.25);
}

.icon-like.liked{
    background-color: #fecaca;
    color: #ef4444;
}

.icon-like.liked>.m-icon{
    color: #ef4444;
}

.icon-like.liked:where([theme="dark"], [theme="dark"] *){
    background-color: #262626;
}
</style>

<!-- eslint-disable vue/no-ref-object-reactivity-loss -->
<script setup>
import { humanizedNumber, standardDateTime, humanizedTime } from '@/indexApp/utils/formatUtils.js'
import { computed, onMounted, reactive, ref, provide, defineAsyncComponent } from 'vue'
import { likeAPost, dislikeAPost, getUserInfoByNickname } from '@/indexApp/js/api.js'
import { useRouter, useRoute } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { VueShowdown } from 'vue-showdown'
import Avatar from '@/components/Avatar.vue'
import ImageGrid from '@/indexApp/components/ImageGrid.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import IconLike from '@/components/icons/IconLike.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import IconShare from '@/components/icons/IconShare.vue'
import IconDown from '@/components/icons/IconDown.vue'
import { debounce } from '@/indexApp/utils/jsHelper'
const PostMenus = defineAsyncComponent(() => import('@/indexApp/components/postDetail/PostMenus.vue')) //NOTE 组件字母小写会导致hmr失效
const UserInfoPop = defineAsyncComponent(() => import('@/indexApp/components/postDetail/UserInfoPop.vue'))
const RepostCard = defineAsyncComponent(() => import('@/indexApp/components/postDetail/RepostCard.vue'))
const RepostPanel = defineAsyncComponent(() => import('@/indexApp/components/postDetail/RepostPanel.vue'))

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
const cardBody = ref()
const emits = defineEmits(['showReviewPanel'])
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    post: props.post,
    reaction: [false, props.post.liked, false],
    showUserInfoPop: false,
    isShowMenu: false,
    user: JSON.parse(localStorage.getItem("CUR_USER")),
    shrinkContent: true,
    showRepostPanel: false
})

const isIndentBody = computed(() => {
    return route.meta.key !== 'postDetail'
})

const cardContainerClass = computed(() => ({
    'hover:bg-gray-50 dark:hover:bg-neutral-900': isIndentBody.value,
    'cursor-default': isIndentBody.value
}))

const cardBodyClass = computed(() => ({
    'py-[0.5rem]': isIndentBody.value,
    'pr-[0.8rem]': isIndentBody.value,
    'p-0': !isIndentBody.value,
    'ml-[3.5rem]': isIndentBody.value && !store.MOBILE_MODE,
    'ml-[3.25rem]': isIndentBody.value && store.MOBILE_MODE,
    'ml-0': !isIndentBody.value
}))

const cardButtonClass = computed(() => ({
    'ml-[3.5rem]': isIndentBody.value && !store.MOBILE_MODE,
    'ml-[3.25rem]': isIndentBody.value && store.MOBILE_MODE,
    'ml-0': !isIndentBody.value,
    'mr-[0.8rem]': isIndentBody.value,
    'mr-0': !isIndentBody.value
}))

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
        if (!response.ok) throw new Error((await response.json()).message)

        const user = await response.json()
        store.setSelectUser(user)
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}

const toggleLike = debounce(async function () {
    const lastLikedState = state.post.liked
    const lastCount = state.post.likeCount

    state.post.liked = !lastLikedState
    state.post.likeCount = !lastLikedState ? lastCount + 1 : lastCount - 1

    try {
        if (state.post.plan) throw new Error('该帖子尚未发布，无法进行点赞操作')
        if (lastLikedState == false) {
            const response = await likeAPost(state.post.id)
            if (!response.ok) throw new Error((await response.json()).message)

            const result = await response.text()
            if (result == false) throw new Error("点赞失败!")
        } else {
            const response = await dislikeAPost(state.post.id)
            if (!response.ok) throw new Error((await response.json()).message)

            const result = await response.text()
            if (result == false) throw new Error("取消点赞失败!")
        }
    } catch (e) {
        store.setErrorMsg(e.message)

        state.post.liked = lastLikedState
        state.post.likeCount = lastCount
    }
}, 300)

function repostIt() { state.showRepostPanel = true }

const hasPics = computed(() => {
    return !!state.post.images?.length
})

const hasTags = computed(() => {
    return state.post.tags != undefined && state.post.tags.length != 0
})
const showPinTop = computed(() => {
    return state.post.top && route.meta.key === 'profile'
})

const isLiked = computed(() => { return state.post.liked })

const isReposted = computed(() => { return state.post.reposted })

const likedIconFillColor = computed(() => {
    return isLiked.value ? '#FF0000' : 'none'
})

const formattedTime = computed(() => {
    return route.meta.key === 'postDetail' ? standardDateTime(state.post.createdTime) : humanizedTime(state.post.createdTime)
})

const cardMaskClass = computed(() => ({
    'z-[98]': state.post.plan,
    'bg-[#e5e7eb88] dark:bg-neutral-800/75': state.post.plan,
    'pointer-events-none': state.post.plan
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
    const markdown = cardBody.value.querySelector('markdown')
    state.shrinkContent = markdown.clientHeight < markdown.scrollHeight
}

function dismissPostMenus() {
    state.isShowMenu = false
}

function handleRealImage({ index, image }) {
    state.post.images[index] = image
}

function handleAvatarClick() {
    if (!store.MOBILE_MODE) {
        routeToUser(state.post.user.nickname)
    } else {
        state.showUserInfoPop = true
    }
}

function handleAvatarMouseenter() {
    if (!store.MOBILE_MODE) {
        state.showUserInfoPop = true
    }
}

function handleClickReviewBtn() {
    emits('showReviewPanel')
}

provide('dismissPostMenus', { dismissPostMenus })

onMounted(() => {
    if (route.meta.key !== 'postDetail') {
        setSuitableHeight()
    } else {
        state.shrinkContent = false
    }
})
</script>