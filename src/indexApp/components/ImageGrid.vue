<template>
    <div class="flex flex-row flex-wrap gap-[0.3rem]">
        <div
            v-for="(pic, idx) in props.images"
            :key="idx"
            :style="wrapperWidth"
            class="overflow-hidden relative rounded-[4px] z-[97]">
            <IconAltOn
                v-if="pic.altText && state.showAltText[idx] == false"
                class="absolute bg-black/75 bottom-[0.3rem] box-content cursor-pointer h-[1.2rem] p-[0.25rem] right-[0.3rem] rounded-full text-white w-[1.2rem] z-[100]"
                @mouseenter="toggleAltTextShow(idx, true, 'mouseenter')"
                @click="toggleAltTextShow(idx, true)">
            </IconAltOn>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                <div
                    v-if="pic.altText && state.showAltText[idx] && store.MOBILE_MODE"
                    ref="altTextBg"
                    class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1001]"
                    @click.self="toggleAltTextShow(idx, false)" />
                <Transition name="alt">
                    <div
                        v-if="pic.altText && state.showAltText[idx]"
                        class="absolute bg-black/75 bottom-0 break-words cursor-text h-fit leading-[1.5rem] max-h-full max-sm:bg-white max-sm:dark:bg-[#1e1e1e] max-sm:fixed max-sm:max-h-[75vh] max-sm:pt-0 max-sm:rounded-t-[0.75rem] max-sm:z-[1001] no-scrollbar overflow-scroll p-3 text-[11pt] text-justify text-white w-full z-[100]"
                        @mouseleave="toggleAltTextShow(idx, false, 'mouseleave')">
                        <div class="bg-white dark:bg-[#1e1e1e] flex h-6 items-center justify-center sm:hidden sticky top-0">
                            <div class="bg-gray-200 dark:bg-neutral h-[0.35rem] rounded-full w-12" />
                        </div>
                        {{ pic.altText }}
                    </div>
                </Transition>
            </Teleport>
            <div
                v-if="pic.hidden && !state.showRealImage[idx]"
                class="absolute flex flex-row h-full items-center justify-center w-full z-[99]">
                <div
                    class="bg-black/75 cursor-pointer h-fit px-3 py-2 rounded-[8px] text-[11pt] text-white w-fit"
                    @click="getImageUrlIgnoreNSFW(idx)">
                    已隐藏
                </div>
            </div>
            <picture @click="showSlide(idx)">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <source :srcset="getImageUrl(pic)" type="image/webp" />
                <img
                    :style="{'background-image': `url(${pic.thumb})`, 'aspect-ratio': `${props.aspectRatio}`}"
                    :class="mPicClass"
                    loading="lazy"
                    class="duration-[400ms] hover:scale-[1.2] object-cover pic rounded-[4px] transition-transform w-full"
                    :src="pic.thumb"
                    :alt="pic.altText" />
            </picture>
            <div
                v-if="isGif(pic.url) && !state.showRealImage[idx]"
                class="absolute cursor-pointer flex flex-row h-full items-center justify-center right-0 text-white top-0 w-full"
                @click="playAnimateImage(idx)">
                <IconGif class="bg-[#000000BB] h-[2.5rem] rounded-full text-inherit w-[2.5rem]"></IconGif>
            </div>
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
import IconAltOn from '@/components/icons/IconAltOn.vue'
import { reactive, computed, ref } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { getImageUrlIgnoreHidden } from '@/indexApp/js/api.js'

const altTextBg = ref()
const props = defineProps({
    /** 要展示的图片列表 */
    images: {
        type: Array,
        required: true
    },
    /** 图片组所在的id */
    id: {
        type: String,
        required: true
    },
    /** 图片网格存在哪里，支持post | review */
    type: {
        type: String,
        required: true
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
    showAltText: [...props.images.map(() => false)],
    showRealImage: [...props.images.map(() => false)],
    gridImageWidth: {
        0: 0,
        1: 560,
        2: 560,
        3: 560
    }
})

const gridColCount = computed(() => {
    const picCount = props.images?.length || 0
    if (picCount === 0) return 0
    if (picCount === 1) return 1
    if ((picCount > 1 && picCount <= 2) || picCount == 4) return 2
    return 3
})

const wrapperWidth = reactive({
    width: `calc((100% - 0.3rem * ${gridColCount.value - 1}) / ${gridColCount.value})`
})

const mPicClass = reactive({
    'aspect-square': gridColCount.value !== 1,
    'max-h-[90vh]': gridColCount.value === 1,
    'bg-no-repeat': true,
    'bg-cover': true,
    'bg-center': true
})

const typeId = computed(() => props.id.replace('img-', ''))

function isGif(url){
    return url && !url.startsWith('data') && url.toLowerCase().endsWith('.gif')
}

async function getImageUrlIgnoreNSFW(index) {
    try {
        if(!typeId.value || !props.type){
            throw new Error('The id or type is empty!')
        }
        const response = await getImageUrlIgnoreHidden(typeId.value, index, props.type)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()

        emits('realImage', {index: index, image: result})
        state.showRealImage[index] = true
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}

function showSlide(idx) {
    store.showSlide(props.images, idx)
}

// TODO 如果width > height, 则应该取height作为链接参数
function getImageUrl(image) {
    const { url, hidden } = image
    const size = state.gridImageWidth[gridColCount.value]
    return hidden ? url : `${import.meta.env.VITE_OBJECT_BASE_URL}${url}?width=${size}`
}

/**
 * 切换下标为idx的图片的altText显示状态
 * @param {Number} index 图片下标
 * @param {Boolean} isShow 是否显示，要切换的新值
 * @param {String} mode 从那种交互模式触发, 值可选 click | mousemove | mouseleave等，默认值为click
 */
function toggleAltTextShow(index, isShow, mode = 'click'){
    if(mode !== 'click' && store.MOBILE_MODE) return
    state.showAltText[index] = isShow
}

function playAnimateImage(idx) {
    state.showRealImage[idx] = true
}
</script>