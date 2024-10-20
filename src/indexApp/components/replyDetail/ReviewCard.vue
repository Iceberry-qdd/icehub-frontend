<template>
    <div class="flex flex-col max-sm:p-3 p-4 relative">
        <div
            v-if="props.tireDirection === 'top'"    
            class="absolute bg-gray-200 dark:bg-neutral-800 left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
        <div
            v-if="props.tireDirection === 'mid'"  
            class="absolute bg-gray-200 dark:bg-neutral-800 h-full left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-mid top-0 w-[0.15rem] z-0" />
        <div
            v-if="props.tireDirection === 'bottom'"  
            class="absolute bg-gray-200 dark:bg-neutral-800 h-[2.5rem] left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-bottom top-0 w-[0.15rem] z-0" />
        <div class="flex flex-row gap-x-4 justify-between max-sm:gap-x-3">
            <div class="flex-none relative z-10">
                <Avatar
                    :user="props.review.user"
                    class="cursor-default h-[2.5rem] rounded-[6px] text-[2.5rem] w-[2.5rem]">
                </Avatar>
            </div>
            <div class="flex flex-1 flex-col">
                <div class="flex flex-row gap-x-4 h-fit items-center justify-between">
                    <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                        <div class="font-bold hover:underline text-[12pt]">
                            {{ props.review.user.nickname }}
                        </div>
                        <IconVerify
                            v-if="props.review.user.verified"
                            class="dark:text-onPrimary h-[0.9rem] text-primary w-[0.9rem]">
                        </IconVerify>
                        <div
                            v-if="props.review.user.confirmFollow"
                            class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                            lock
                        </div>
                    </div>
                    <div>
                        <!-- eslint-disable-next-line vue/html-quotes, vue/singleline-html-element-content-newline -->
                        <div class='dark:text-white/50 text-[10pt] text-gray-400'>{{ humanizedTime(props.review.createdTime) }}</div>
                    </div>
                </div>
                <div
                    ref="reviewBody"
                    class="relative text-[12pt]">
                    <VueShowdown
                        tag="markdown"
                        :extensions="['exts']"
                        :markdown="props.review.content"
                        class="max-sm:w-[calc(100vw-2.5rem-0.75rem*3)] overflow-hidden sm:w-[calc(36rem-2.5rem-1rem*3)]"
                        :class="{'shrink-content': state.shrinkContent, 'max-h-[45vh]': state.shrinkContent}">
                    </VueShowdown>
                    <ImageGrid
                        v-if="props.review.images?.length"
                        :id="`img-${props.review.id}`"
                        :images="props.review.images"
                        type="review"
                        class="bottom-[0.5rem] pt-[0.5rem] relative z-[20]"
                        @real-image="handleRealImage">
                    </ImageGrid>
                    <div class="absolute bg-transparent h-full top-0 w-full z-[21]" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.liked {
    color: red;
    background-color: #fecaca;
}

.timeline-top {
    height: calc(100% - 2.5rem);
}
</style>

<script setup>
// 只包括评论和一层回复
import { humanizedTime } from '@/indexApp/utils/formatUtils.js'
import Avatar from '@/components/Avatar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import { VueShowdown } from 'vue-showdown'
import ImageGrid from '@/indexApp/components/ImageGrid.vue'
import { onMounted, reactive, ref } from 'vue'

const reviewBody = ref()
const props = defineProps({
    /** 传入的评论对象 */
    // eslint-disable-next-line vue/no-unused-properties
    review: {
        type: Object,
        required: true
    },
    /** 悬线的方向，top | mid | bottom */
    tireDirection:{
        type: String,
        required: true
    }
})

const state = reactive({
    shrinkContent: true
})

function handleRealImage({index, image}){
    // Do nothing
}

function setSuitableHeight() {
    const markdown = reviewBody.value.querySelector('markdown')
    state.shrinkContent = markdown.clientHeight < markdown.scrollHeight
}

onMounted(() => {
    setSuitableHeight()
})
</script>