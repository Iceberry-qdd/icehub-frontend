<template>
    <div class="border-b-[1px] border-gray-100 flex flex-col px-[1rem] py-[1rem] relative">
        <div class="absolute bg-gray-200 left-[2.2rem] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
        <div class="flex flex-row items-center justify-between">
            <div class="flex flex-row gap-x-4 items-center">
                <div class="relative z-10">
                    <Avatar
                        :user="props.review.user"
                        class="cursor-default h-[2.5rem] rounded-[6px] text-[2.5rem] w-[2.5rem]">
                    </Avatar>
                </div>
                <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                    <div class="font-bold hover:underline text-[12pt]">
                        {{ props.review.user.nickname }}
                    </div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconVerify v-if="props.review.user.verified" class="h-[0.9rem] text-blue-500 w-[0.9rem]"></IconVerify>
                </div>
            </div>
            <div>
                <!-- eslint-disable-next-line vue/html-quotes, vue/singleline-html-element-content-newline -->
                <div class='text-[10pt] text-gray-400'>{{ humanizedTime(props.review.createdTime) }}</div>
            </div>
        </div>
        <div class="ml-[3.5rem] relative text-[12pt]">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <VueShowdown tag="markdown" :extensions="['exts']" :markdown="props.review.content"></VueShowdown>
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

const props = defineProps({
    /** 传入的评论对象 */
    // eslint-disable-next-line vue/no-unused-properties
    review: {
        type: Object,
        required: true
    }
})

function handleRealImage({index, image}){
    // Do nothing
}
</script>