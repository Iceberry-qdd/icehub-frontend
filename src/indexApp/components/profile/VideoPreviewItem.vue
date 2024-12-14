<template>
    <div class="relative">
        <div
            v-if="!props.bigPlayButton"
            class="absolute bottom-0 material-symbols-rounded no-hover p-1 play-arrow right-0 text-[1.75rem] text-white">
            play_arrow
        </div>
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <button
            v-else
            type="button"
            class="absolute shaka-no-propagation shaka-play-button"
            icon="play"
            aria-label="播放">
        </button>
        <picture v-if="!!props.video?.poster">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="getImageUrl(props.video.poster)" type="image/webp" />
            <img
                :style="{ 'background-image': `url(${thumb})`, 'aspect-ratio': `${props.aspectRatio}` }"
                :class="mPicClass"
                loading="lazy"
                class="object-cover pic w-full"
                :src="thumb"
                :alt="altText"
                @click="routeTo" />
        </picture>
        <SnowScreen
            v-else
            class="aspect-video w-full"
            :text="store.getVideoErrorMsg(props.video.status)">
        </SnowScreen>
    </div>
</template>

<style scoped>
.play-arrow{
    text-shadow: 0 0 2px rgb(0 0 0 / 1);
}

.shaka-play-button{
    opacity: 1;
    inset: 50% 50%;
    translate: -50% -50%;
    box-sizing: border-box;
    padding: calc(15% / 2);
    width: 0;
    height: 0;
    margin: 0;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, .1) 0 0 20px 0;
    border: none;
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: rgba(255, 255, 255, .9);
    transition: opacity cubic-bezier(.4, 0, .6, 1) .6s;
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
</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss, vue/no-ref-object-reactivity-loss -->
<script setup>
import { reactive, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
const SnowScreen = defineAsyncComponent(() => import('@/indexApp/components/SnowScreen.vue'))

const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL
const router = useRouter()
const props = defineProps({
    /** 要展示的视频 */
    video: {
        type: Object,
        required: true
    },
    /** 图片所在的type类型的id，如图片来自帖子，则表示帖子id */
    typeId: {
        type: String,
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
    },
    /** 海报图的宽度，不传递默认为-1，表示使用原图片宽度 */
    width: {
        type: Number,
        required: false,
        default: -1
    },
    /** 是否显示中央播放按钮 */
    bigPlayButton: {
        type: Boolean,
        required: false,
        default: false
    }
})

const {thumb, altText} = props.video?.poster || {thumb: undefined, altText: undefined}

const mPicClass = reactive({
    'aspect-square': true,
    'bg-no-repeat': true,
    'bg-cover': true,
    'bg-center': true
})

function getImageUrl(image) {
    const { url, hidden } = image
    return hidden ? url : `${BASE_URL}${url}${props.width === -1 ? '' : '?width=200'}`
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