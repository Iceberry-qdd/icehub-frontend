<template>
    <div ref="replyBody">
        <div class="border-b-[1px] border-gray-100 dark:border-b-[#1e1e1e] dark:hover:bg-neutral-900 flex flex-col gap-y-2 hover:bg-gray-50 max-sm:p-3 p-4 relative">
            <div
                v-if="state.tieSub == 'mid'"
                class="absolute bg-gray-200 dark:bg-neutral-800 h-full left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-mid top-0 w-[0.15rem] z-0" />
            <div
                v-if="state.tieSub == 'top'"
                class="absolute bg-gray-200 dark:bg-neutral-800 h-[calc(100%-2.5rem)] left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] top-[2.5rem] w-[0.15rem] z-0" />
            <div
                v-if="state.tieSub == 'bottom'"
                class="absolute bg-gray-200 dark:bg-neutral-800 h-[2.5rem] left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-bottom top-0 w-[0.15rem] z-0" />
            <div
                class="absolute bg-transparent cursor-pointer h-full left-0 top-0 w-full z-10"
                @click.self="routeToReplyDetail(state.reply.id)" />
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row gap-x-4 items-center max-sm:gap-x-3 relative">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                        <div
                            v-if="state.showUserInfoPop && store.MOBILE_MODE"
                            class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1001]"
                            @click="state.showUserInfoPop = false" />
                        <Transition name="fade">
                            <UserInfoPop
                                v-if="state.showUserInfoPop"
                                :user="state.reply.user"
                                class="absolute h-fit max-sm:bottom-0 max-sm:fixed max-sm:left-0 max-sm:w-screen max-sm:z-[1001] sm:top-0 w-[20rem] z-[98]"
                                @mouseleave="state.showUserInfoPop = false">
                            </UserInfoPop>
                        </Transition>
                    </Teleport>
                    <div class="relative z-10">
                        <Avatar
                            :user="state.reply.user"
                            class="h-[2.5rem] rounded-[6px] text-[2.5rem] w-[2.5rem]"
                            @mouseenter="handleAvatarMouseenter"
                            @click="handleAvatarClick">
                        </Avatar>
                    </div>
                    <div class="z-20">
                        <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                            <div
                                class="font-bold hover:underline hover:underline-offset-4 text-[12pt]"
                                @click="routeToUser(state.reply.user.nickname)">
                                {{ state.reply.user.nickname }}
                            </div>
                            <IconVerify
                                v-if="state.reply.user.verified"
                                class="dark:text-blue-300 h-[0.9rem] text-blue-500 w-[0.9rem]">
                            </IconVerify>
                            <div
                                v-if="state.reply.user.confirmFollow"
                                class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                                lock
                            </div>
                        </div>
                        <div
                            class="dark:text-white/50 text-[0.85rem] text-gray-400"
                            @click="routeToUser(replyTo)">
                            回复
                            <span class="cursor-pointer hover:dark:text-white hover:underline">@{{ replyTo }}</span>
                        </div>
                    </div>
                </div>
                <div class="z-[20]">
                    <div
                        :title="standardDateTime(state.reply.createdTime)"
                        class="dark:text-white/50 text-[10pt] text-gray-400">
                        {{ humanizedTime(state.reply.createdTime) }}
                    </div>
                </div>
            </div>

            <div class="max-sm:pl-[3.25rem] overflow-x-hidden pl-[3.5rem] relative text-[12pt]">
                <div
                    v-if="state.shrinkContent"
                    class="-translate-x-1/2 absolute bg-[#cfe2ffaa] bottom-2 cursor-pointer dark:bg-neutral-800 dark:text-blue-200 left-1/2 px-[1rem] py-[0.25rem] rounded-full text-[0.9rem] z-[96]"
                    @click="state.shrinkContent = false">
                    展开
                </div>
                <VueShowdown
                    tag="markdown"
                    :extensions="['exts']"
                    class="break-all overflow-y-hidden"
                    :class="{'shrink-content': state.shrinkContent, 'max-h-[45vh]': state.shrinkContent}"
                    :markdown="state.reply.content">
                </VueShowdown>
                <ImageGrid
                    v-if="state.reply.images?.length"
                    :id="`img-${state.reply.id}`"
                    :images="state.reply.images"
                    type="review"
                    class="bottom-[0.5rem] pt-[0.5rem] relative z-[20]"
                    @real-image="handleRealImage">
                </ImageGrid>
            </div>
            <div class="flex flex-row gap-x-8 justify-end max-sm:pl-[3rem] pl-[3.5rem] z-[97]">
                <button
                    :id="`rmb-${state.reply.id}`"
                    type="button"
                    title="更多"
                    class="btn flex flex-row gap-x-2 items-center op text-[11pt]"
                    @click="toggleMenu">
                    <span
                        class="hover:bg-[#d3d3d5] material-symbols-rounded p-[0.4rem] text-[20px]">
                        more_horiz
                    </span>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                        <div
                            v-if="state.showReplyMenu && store.MOBILE_MODE"
                            class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1000]" />
                        <Transition name="fade">
                            <ReviewMenu
                                v-if="state.showReplyMenu"
                                class="absolute bottom-[1rem] cursor-pointer h-auto max-sm:bottom-0 max-sm:fixed max-sm:left-0 max-sm:pb-2 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-screen max-sm:z-[1000] rounded-[8px] sm:max-w-[18rem] sm:min-w-[10rem]"
                                :review="state.reply">
                            </ReviewMenu>
                        </Transition>
                    </Teleport>
                </button>
                <button
                    type="button"
                    :title="`${state.reply.replyCount} 评论`"
                    class="btn flex flex-row gap-x-1 items-center op text-[11pt]"
                    :class="{'cursor-not-allowed text-[#C1C1C1] dark:text-white/25': !props.allowReply}"
                    @click="props.allowReply ? state.showReplyPanel = true : undefined">
                    <span
                        class="icon-message p-[0.4rem] rounded-full"
                        :class="{'not-allowed': !props.allowReply}">
                        <IconMessage
                            :size="19"
                            :stroke-width="3">
                        </IconMessage>
                    </span>
                    {{ humanizedNumber(state.reply.replyCount) }}
                    <Teleport to="#app">
                        <Transition name="fade">
                            <ReviewPanel
                                v-if="state.showReplyPanel"
                                class="fixed top-0"
                                :parent-review="state.reply"
                                @dismiss="dismissReplyPanel">
                            </ReviewPanel>
                        </Transition>
                    </Teleport>
                </button>
                <button
                    type="button"
                    :title="`${state.reply.likeCount} 点赞`"
                    class="btn flex flex-row gap-x-1 items-center op text-[11pt]"
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
                    {{ humanizedNumber(state.reply.likeCount) }}
                </button>
            </div>
            <div
                v-if="showMoreReplyButton"
                class="dark:text-blue-300 hover:underline max-sm:ml-[3rem] ml-[3.5rem] text-[#0d6efd] text-[11pt] z-[19]"
                :class="[state.isLoading ? 'pointer-events-none' : 'cursor-pointer']">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconLoading v-if="state.isLoading == true" class="dark:text-white/50 h-5 text-slate-500 w-5"></IconLoading>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <span v-else @click="fetchMoreReply">加载更多回复</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

.icon-message.not-allowed{
    background-color: transparent;
    cursor: not-allowed;
}

.icon-message.not-allowed>.m-icon:where([theme="dark"], [theme="dark"] *){
    color: rgb(255 255 255 / 0.25);
}
</style>

<script setup>
// 只包括回复，单独从Review复制出来
import { computed, reactive, defineAsyncComponent, provide, onMounted, ref } from 'vue'
import { humanizedTime, humanizedNumber, standardDateTime } from '@/indexApp/utils/formatUtils.js'
import { dislikeAReview, likeAReview } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import ImageGrid from '@/indexApp/components/ImageGrid.vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import Avatar from '@/components/Avatar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import { VueShowdown } from 'vue-showdown'
import IconLike from '@/components/icons/IconLike.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import { debounce } from '@/indexApp/utils/jsHelper'
const ReviewMenu = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewMenu.vue'))
const UserInfoPop = defineAsyncComponent(() => import('@/indexApp/components/postDetail/UserInfoPop.vue'))
const ReviewPanel = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewPanel.vue'))

const replyBody = ref()
const router = useRouter()
const props = defineProps({
    /** 传入的评论对象 */
    review: {
        type: Object,
        required: false,
        default: undefined
    },
    /** 时间线位置，top | mid | bottom */
    tieSub: {
        type: String,
        required: false,
        default: undefined,
        validator(value, _) {
            return ['top', 'mid', 'bottom'].includes(value)
        }
    },
    /** 传入的回复对象 */
    reply: {
        type: Object,
        required: true
    },
    /** 该回复的子回复总数 */
    totalReplyCount: {
        type: Number,
        required: true
    },
    /** 通过fetch获得的子回复总数 */
    fetchedReplyCount: {
        type: Number,
        required: true
    },
    /** 该回复的索引，用于判断索引显示的位置 */
    index: {
        type: Number,
        required: true
    },
    /** 是否允许回复 */
    allowReply: {
        type:Boolean,
        required: false,
        default: true
    }
})
const emits = defineEmits(['fetchMoreReply'])

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    review: props.review,
    reply: props.reply,
    tieSub: props.tieSub,
    showUserInfoPop: false,
    isLoading: false,
    showReplyPanel: false,
    showReplyMenu: false,
    shrinkContent: true
})

const replyTo = computed(() => {
    return state.review?.user?.nickname || '神秘用户'
})

function fetchMoreReply() {
    state.isLoading = true
    emits('fetchMoreReply')
}

const toggleLike = debounce(async function() {
    try {
        if (state.reply.liked == false) {
            const response = await likeAReview(state.reply.id)
            if (!response.ok) throw new Error((await response.json()).message)

            const result = await response.text()
            if (result == false) throw new Error('点赞失败！')

            const lastCount = state.reply.likeCount
            state.reply.likeCount = lastCount + 1
            state.reply.liked = true
        } else {
            const response = await dislikeAReview(state.reply.id)
            if (!response.ok) throw new Error((await response.json()).message)

            const result = await response.text()
            if (result == false) throw new Error('取消点赞失败！')

            const lastCount = state.reply.likeCount
            state.reply.likeCount = lastCount - 1
            state.reply.liked = false
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}, 300)

function dismissReplyPanel() {
    state.showReplyPanel = false
}

const isLiked = computed(() => {
    return state.reply.liked
})

const likedIconStrokeColor = computed(() => {
    return isLiked.value ? '#FF0000' : '#333'
})

const likedIconFillColor = computed(() => {
    return isLiked.value ? '#FF0000' : 'none'
})

const hasMore = computed(() => {
    return props.fetchedReplyCount < props.totalReplyCount
})

const showMoreReplyButton = computed(() => {
    return hasMore.value && props.index >= props.fetchedReplyCount - 1
})

function routeToUser(nickname) {
    router.push({ name: 'profile', params: { nickname: nickname } })
}

function routeToReplyDetail(replyId) {
    router.push({ name: 'replyDetail', params: { id: replyId } })
}

function toggleMenu(){
    state.showReplyMenu = true
}

function handleRealImage({index, image}){
    state.reply.images[index] = image
}

function dismissReplyMenus() {
    state.showReplyMenu = false
}

function handleAvatarClick(){
    if(!store.MOBILE_MODE){
        routeToUser(state.reply.user.nickname)
    } else {
        state.showUserInfoPop = true
    }
}

function handleAvatarMouseenter(){
    if(!store.MOBILE_MODE){
        state.showUserInfoPop = true
    }
}

function setSuitableHeight() {
    const markdown = replyBody.value.querySelector('markdown')
    state.shrinkContent = markdown.clientHeight < markdown.scrollHeight
}

onMounted(() => {
    setSuitableHeight()
})

provide('dismissReviewMenus', { dismissReviewMenus: dismissReplyMenus })
</script>