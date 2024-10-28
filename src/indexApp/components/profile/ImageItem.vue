<template>
    <div class="relative">
        <div
            v-if="props.image.hidden && !state.showRealImage"
            class="absolute flex flex-row h-full items-center justify-center w-full z-[99]">
            <div
                class="bg-black/75 cursor-pointer h-fit px-3 py-2 rounded-[8px] text-[11pt] text-white w-fit"
                @click="getImageUrlIgnoreNSFW(props.index)">
                已隐藏
            </div>
        </div>
        <picture>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="getImageUrl(props.image)" type="image/webp" />
            <img
                :style="{ 'background-image': `url(${props.image.thumb})`, 'aspect-ratio': `${props.aspectRatio}` }"
                :class="mPicClass"
                loading="lazy"
                class="object-cover pic w-full"
                :src="props.image.thumb"
                :alt="props.image?.altText"
                @click="routeTo" />
        </picture>
        <div
            v-if="isGif(props.image.url) && !state.showRealImage"
            class="absolute cursor-pointer flex flex-row h-full items-center justify-center right-0 text-white top-0 w-full"
            @click="playAnimateImage(props.index)">
            <IconGif class="bg-[#000000BB] h-[2.5rem] rounded-full text-inherit w-[2.5rem]"></IconGif>
        </div>
    </div>
</template>

<style scoped>
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
</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss, vue/no-ref-object-reactivity-loss -->
<script setup>
import IconGif from '@/components/icons/IconGif.vue'
import { reactive, computed, ref } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { getImageUrlIgnoreHidden } from '@/indexApp/js/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
    /**
     * 图片id
     */
    id: {
        type: String,
        required: true
    },
    /** 要展示的图片 */
    image: {
        type: Object,
        required: true
    },
    /** 图片所在的type类型的id，如图片来自帖子，则表示帖子id */
    typeId: {
        type: String,
        required: true
    },
    /** 图片所在帖子的顺序下标，用于区分从那张图获取原始链接 */
    index: {
        type: Number,
        required: true
    },
    /** 图片网格存在哪里，支持post | review */
    type: {
        type: String,
        required: true,
        validator: (value, _) => {
            return ['post', 'review'].includes(value)
        }
    },
    /** 每张图片的宽高比，默认不设置 */
    aspectRatio: {
        type: Number,
        required: false,
        default: undefined
    }
})
const emits = defineEmits(['realImage'])
const state = reactive({
    showRealImage: false
})

const mPicClass = reactive({
    'aspect-square': true,
    'bg-no-repeat': true,
    'bg-cover': true,
    'bg-center': true
})

function isGif(url) {
    return url && !url.startsWith('data') && url.toLowerCase().endsWith('.gif')
}

async function getImageUrlIgnoreNSFW(index) {
    try {
        const response = await getImageUrlIgnoreHidden(props.typeId, index, props.type)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        emits('realImage', { id: props.id, image: result })
        state.showRealImage = true
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}

function getImageUrl(image) {
    const { url, hidden } = image
    return hidden ? url : `${import.meta.env.VITE_OBJECT_BASE_URL}${url}?width=200`
}

function playAnimateImage() {
    state.showRealImage = true
}

function routeTo() {
    switch (props.type) {
        case 'post':
            router.push({ 'name': 'postDetail', params: { id: props.typeId } })
            break;
        case 'review':
            router.push({ 'name': 'replyDetail', params: { id: props.typeId } })
            break;
        default:
            break;
    }
}
</script>