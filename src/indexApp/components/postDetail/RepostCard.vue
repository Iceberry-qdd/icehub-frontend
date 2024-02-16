<template>
    <div
        ref="repostCard"
        class="border-[1px] border-gray-300 cursor-pointer flex flex-col gap-y-1 m-bg-white rounded-[8px]"
        @click="routeToUserProfile">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-if="state.post" class="pt-2">
            <div class="flex flex-row gap-x-2 items-center px-2 text-[11pt]">
                <Avatar
                    :user="state.post.user"
                    class="cursor-default h-[1.5rem] rounded-[4px] w-[1.5rem]">
                </Avatar>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="font-bold">{{ state.post.user.nickname }}</div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="text-gray-400 top-[1px]">发布于 {{ humanizedTime(state.post.createdTime) }}</div>
            </div>

            <div
                class="break-all px-2 relative text-[11pt]"
                :class="[state.shrinkContent ? 'max-h-[50vh] overflow-hidden rounded-b-[8px]' : '']">
                <div
                    v-if="state.shrinkContent"
                    class="bg-slate-400 bottom-0 left-0 relative right-0 shrink-mask top-0" />
                <VueShowdown
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.post.content">
                </VueShowdown>
            </div>
            <div class="flex flex-col gap-y-1 relative">
                <div
                    v-if="isCoverHidden"
                    class="absolute flex flex-row h-full items-center justify-center w-full z-[99]">
                    <div
                        class="black-80-bg cursor-pointer h-fit px-3 py-2 rounded-[8px] text-[11pt] w-fit white-text">
                        已隐藏
                    </div>
                </div>
                <img
                    v-if="state.post.attachmentsUrl.length > 0"
                    loading="lazy"
                    :src="getCoverImageUrl(state.post.attachmentsUrl[0])"
                    class="h-[15rem] img-fluid object-cover pic rounded-b-[8px] w-full" />
                <div
                    v-if="isGifCover && !isCoverHidden"
                    class="absolute cursor-pointer flex h-full items-center justify-center right-0 text-white top-0 w-full">
                    <IconGif class="bg-[#000000BB] gif h-[2.5rem] rounded-full w-[2.5rem]"></IconGif>
                </div>
            </div>
        </div>
        <div v-else>
            <div
                class="bg-gray-100 px-2 py-3 rounded-[8px] text-[10pt] text-center">
                {{ state.fetchFailedText }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.black-80-bg {
    background-color: #000000AA !important;
}

.white-text {
    color: white !important;
}

.m-bg-white {
    background-color: white !important;
}

.shrink-mask {
    width: 100%;
    height: 50vh;
    background: linear-gradient(0deg, white 6%, transparent 50%);
    position: absolute;
}
</style>

<script setup>
import { computed, reactive, onMounted, ref } from 'vue'
import { humanizedTime } from '@/indexApp/utils/formatUtils.js'
import { useRouter } from 'vue-router'
import IconGif from '@/components/icons/IconGif.vue'
import { VueShowdown } from 'vue-showdown'
import { getPostById } from '@/indexApp/js/api.js'
import Avatar from '@/indexApp/components/Avatar.vue'

const router = useRouter()
const props = defineProps({
    /** 传入的帖子对象, 与postId二选一传递*/
    post: {
        type: Object,
        required: false,
        default: undefined
    },
    /** 传入的帖子id, 与post二选一传递 */
    postId: {
        type: String,
        required: false,
        default: undefined
    }
})
const repostCard = ref()

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    post: props.post ? props.post : null,
    shrinkContent: false,
    fetchFailedText: null
})

function routeToUserProfile() {
    if (!state.post) return

    router.push({ name: 'postDetail', params: { id: state.post.id } })
}

function getCoverImageUrl(attachment) {
    return attachment.previewUrl || attachment.originUrl
}

const isCoverHidden = computed(() => {
    if (!state.post.attachmentsUrl[0]) return false
    else return state.post.attachmentsUrl[0].hidden
})

const isGifCover = computed(() => {
    if (!state.post.attachmentsUrl[0]) return false
    else return state.post.attachmentsUrl[0].contentType == 'image/gif'
})

function setSuitableHeight() {
    if (state.post && state.post.type == 'MARKDOWN' && repostCard.value.clientHeight > window.innerHeight / 2) {
        state.shrinkContent = true
    }
}

async function fetchPost() {
    try {
        const response = await getPostById(props.postId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        state.post = result
    } catch (e) {
        state.fetchFailedText = "该帖子目前无法加载"
    }
}

onMounted(() => {
    if (!props.post) {
        fetchPost()
    }

    setSuitableHeight()
})
</script>