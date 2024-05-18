<template>
    <div>
        <div class="border-b-[1px] border-gray-100 flex flex-col gap-y-2 px-[1rem] py-[1rem] relative">
            <div
                v-if="state.tieSub == 'mid'"
                class="absolute bg-gray-200 h-full left-[2.2rem] timeline-mid top-0 w-[0.15rem] z-0" />
            <div
                v-if="state.tieSub == 'top'"
                class="absolute bg-gray-200 left-[2.2rem] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
            <div
                v-if="state.tieSub == 'bottom'"
                class="absolute bg-gray-200 h-[2.5rem] left-[2.2rem] timeline-bottom top-0 w-[0.15rem] z-0" />
            <div
                class="absolute bg-transparent h-full left-0 top-0 w-full z-10"
                @click.self="routeToReplyDetail(state.reply.id)" />
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row gap-x-4 items-center relative">
                    <Transition name="fade">
                        <UserInfoPop
                            v-if="state.showUserInfoPop"
                            :user="state.reply.user"
                            class="absolute shadow-lg top-0 user-info-pop z-[99]"
                            @mouseleave="state.showUserInfoPop = false">
                        </UserInfoPop>
                    </Transition>
                    <div class="relative z-10">
                        <Avatar
                            :user="state.reply.user"
                            class="h-[2.5rem] rounded-[6px] text-[2.5rem] w-[2.5rem]"
                            @mouseenter="state.showUserInfoPop = true"
                            @click="routeToUser(state.reply.user.nickname)">
                        </Avatar>
                    </div>
                    <div class="z-20">
                        <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                            <div
                                class="font-bold hover:underline hover:underline-offset-4 text-[12pt]"
                                @click="routeToUser(state.reply.user.nickname)">
                                {{ state.reply.user.nickname }}
                            </div>
                            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                            <IconVerify v-if="state.reply.user.verified" class="h-[0.9rem] text-blue-500 w-[0.9rem]"></IconVerify>
                        </div>
                        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                        <div class="text-[11pt]" @click="routeToUser(replyTo)">
                            回复
                            <span class="cursor-pointer font-bold hover:underline">@{{ replyTo }}</span>
                        </div>
                    </div>
                </div>
                <div class="z-[20]">
                    <div
                        :title="standardDateTime(state.reply.createdTime)"
                        class="text-[10pt] text-gray-400">
                        {{ humanizedTime(state.reply.createdTime) }}
                    </div>
                </div>
            </div>

            <div class="overflow-x-hidden pl-[3.5rem] text-[12pt]">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <VueShowdown tag="markdown" :extensions="['exts']" :markdown="state.reply.content"></VueShowdown>
                <ImageGrid
                    v-if="state.reply.images?.length"
                    :id="`img-${state.reply.id}`"
                    :images="state.reply.images"
                    type="review"
                    class="bottom-[0.5rem] pt-[0.5rem] relative z-[20]"
                    @real-image="handleRealImage">
                </ImageGrid>
            </div>
            <div class="flex flex-row justify-between pl-[3.5rem] z-20">
                <button
                    :id="`rmb-${state.reply.id}`"
                    type="button"
                    title="更多"
                    class="btn flex flex-row gap-x-2 items-center op text-[11pt]"
                    @click="toggleMenu">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <More theme="outline" size="20" fill="#333" :stroke-width="3"></More>
                    <Transition name="fade">
                        <ReviewMenu
                            v-if="state.showReplyMenu"
                            class="absolute bottom-[1rem]"
                            :review="state.reply">
                        </ReviewMenu>
                    </Transition>
                </button>
                <button
                    type="button"
                    :title="`${state.reply.replyCount} 评论`"
                    class="btn flex flex-row gap-x-1 items-center op text-[11pt]"
                    @click="state.showReplyPanel = true">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <Message theme="outline" size="19" fill="#333" :stroke-width="3"></Message>
                    {{ humanizedNumber(state.reply.replyCount) }}
                    <Teleport to="#app">
                        <ReviewPanel
                            v-if="state.showReplyPanel"
                            class="fixed top-0"
                            :parent-review="state.reply"
                            @dismiss="dismissReplyPanel">
                        </ReviewPanel>
                    </Teleport>
                </button>
                <button
                    type="button"
                    :title="`${state.reply.likeCount} 点赞`"
                    class="btn flex flex-row gap-x-1 items-center op text-[11pt]"
                    @click="toggleLike">
                    <Like
                        :theme="likedIconTheme"
                        size="20"
                        :fill="likedIconColor"
                        :stroke-width="3"
                        :class="isLiked ? 'text-red-500 bg-red-200 hover:bg-red-200' : ''">
                    </Like>
                    {{ humanizedNumber(state.reply.likeCount) }}
                </button>
            </div>
            <div
                v-if="showMoreReplyButton"
                class="hover:underline ml-[3.5rem] text-[#0d6efd] text-[11pt] z-[19]"
                :class="[state.isLoading ? 'pointer-events-none' : 'cursor-pointer']">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconLoading v-if="state.isLoading == true" class="h-5 text-slate-500 w-5"></IconLoading>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <span v-else @click="fetchMoreReply">加载更多回复</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.timeline-top {
    height: calc(100% - 2.5rem);
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
</style>

<script setup>
// 只包括回复，单独从Review复制出来
import { computed, reactive, defineAsyncComponent, provide } from 'vue'
import { humanizedTime, humanizedNumber, standardDateTime } from '@/indexApp/utils/formatUtils.js'
import { dislikeAReview, likeAReview } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { Like, Message, More } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'
import ImageGrid from '@/indexApp/components/ImageGrid.vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import Avatar from '@/components/Avatar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import { VueShowdown } from 'vue-showdown'
const ReviewMenu = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewMenu.vue'))
const UserInfoPop = defineAsyncComponent(() => import('@/indexApp/components/postDetail/UserInfoPop.vue'))
const ReviewPanel = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewPanel.vue'))

const router = useRouter()
const props = defineProps({
    /** 传入的评论对象 */
    review: {
        type: Object,
        required: true
    },
    /** 时间线位置，top | mid | bottom */
    tieSub: {
        type: String,
        required: true
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
    showReplyMenu: false
})

const replyTo = computed(() => {
    return state.review?.user?.nickname || '神秘用户'
})

function fetchMoreReply() {
    state.isLoading = true
    emits('fetchMoreReply')
}

async function toggleLike() {
    try {
        if (state.reply.liked == false) {
            const response = await likeAReview(state.reply.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error('点赞失败！')

            const lastCount = state.reply.likeCount
            state.reply.likeCount = lastCount + 1
            state.reply.liked = true
        } else {
            const response = await dislikeAReview(state.reply.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error('取消点赞失败！')

            const lastCount = state.reply.likeCount
            state.reply.likeCount = lastCount - 1
            state.reply.liked = false
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function dismissReplyPanel() {
    state.showReplyPanel = false
}

const isLiked = computed(() => {
    return state.reply.liked
})

const likedIconTheme = computed(() => {
    return state.reply.liked ? 'filled' : 'outline'
})

const likedIconColor = computed(() => {
    return isLiked.value ? '#FF0000' : '#333'
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

provide('dismissReviewMenus', { dismissReviewMenus: dismissReplyMenus })
</script>