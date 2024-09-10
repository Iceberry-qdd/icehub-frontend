<template>
    <div
        ref="repostCard"
        :class="{'border-[1px] border-gray-300': !!state.post}"
        class="bg-white cursor-pointer dark:bg-[#121212] dark:border-neutral-700 flex flex-col gap-y-1 rounded-[8px]"
        @click="routeToUserProfile">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-if="state.post" class="pt-2">
            <div class="flex flex-row gap-x-1 items-center px-2 text-[11pt]">
                <Avatar
                    :user="state.post.user"
                    class="cursor-default h-[1.5rem] rounded-[4px] text-[1.5rem] w-[1.5rem]">
                </Avatar>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="font-bold">{{ state.post.user.nickname }}</div>
                <IconVerify
                    v-if="state.post.user.verified"
                    class="dark:text-blue-300 h-[0.9rem] text-blue-500 w-[0.9rem]">
                </IconVerify>
                <div
                    v-if="state.post.user.confirmFollow"
                    class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                    lock
                </div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="dark:text-white/50 text-gray-400 top-[1px]">发布于 {{ humanizedTime(state.post.createdTime) }}</div>
            </div>

            <div class="break-all px-2 relative text-[11pt]">
                <VueShowdown
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.post.content"
                    class="break-all overflow-y-hidden text-[11pt] text-justify"
                    :class="{'shrink-content': state.shrinkContent, 'max-h-[45vh]': state.shrinkContent}">
                </VueShowdown>
            </div>
            <ImageGrid
                v-if="hasPics"
                :id="`img-${state.post.id}`"
                :images="[state.post.images ? state.post.images[0] : undefined]"
                :aspect-ratio="16/9"
                type="post"
                class="bottom-[0.5rem] mt-[0.5rem]"
                @real-image="undefined">
            </ImageGrid>
        </div>
        <div v-else>
            <div
                class="bg-gray-100 dark:bg-neutral-800 dark:text-white/25 px-2 py-3 rounded-[8px] text-[10pt] text-center text-neutral-400">
                {{ state.fetchFailedText }}
            </div>
        </div>
    </div>
</template>

<style scoped>
markdown.shrink-content::before {
    border-radius: 8px;
}
</style>

<script setup>
import { computed, reactive, onMounted, ref } from 'vue'
import { humanizedTime } from '@/indexApp/utils/formatUtils.js'
import { useRouter } from 'vue-router'
import { VueShowdown } from 'vue-showdown'
import { getPostById } from '@/indexApp/js/api.js'
import Avatar from '@/components/Avatar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import ImageGrid from '@/indexApp/components/ImageGrid.vue'

const repostCard = ref()
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

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    post: props.post,
    shrinkContent: true,
    fetchFailedText: null
})

function routeToUserProfile() {
    if (!state.post) return

    router.push({ name: 'postDetail', params: { id: state.post.id } })
}

const hasPics = computed(() => {
    return !!state.post.images?.length
})

function setSuitableHeight() {
    const markdown = repostCard.value.querySelector('markdown')
    state.shrinkContent = !markdown || markdown.clientHeight < markdown.scrollHeight
}

async function fetchPost() {
    try {
        const response = await getPostById(props.postId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.post = result
    } catch (e) {
        state.fetchFailedText = "该帖子不可用"
    }
}

onMounted(async () => {
    if (!props.post) {
        await fetchPost()
    }

    setSuitableHeight()
})
</script>