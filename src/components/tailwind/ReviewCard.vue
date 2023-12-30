<template>
    <div>
        <div class="flex relative flex-col px-[1rem] py-[1rem] border-gray-100 border-b-[1px]">
            <div class="timeline-top absolute w-[0.15rem] top-[2.5rem] left-[2.7rem] bg-gray-200 z-0"></div>
            <div class='flex flex-row pl-[0.5rem] justify-between items-center'>
                <div class="flex flex-row items-center gap-x-4">
                    <div class="relative z-10" >
                        <a>
                            <img v-if="props.review.user.avatarUrl" class="cursor-default rounded-[6px] w-[2.5rem] h-[2.5rem]" :src="avatar" />
                            <div v-else class="flex justify-center items-center w-[2.5rem] h-[2.5rem] rounded-[6px] cursor-default bg-blue-500">
                                <div class="text-white text-[14pt] font-bold">{{ props.review.user.nickname.charAt(0) }}</div>
                            </div>
                        </a>
                    </div>
                    <div>
                        <div class="text-[14pt] font-bold cursor-default">
                            {{ props.review.user.nickname }}
                            <i v-if="props.review.user.verified" class="bi bi-patch-check-fill verify relative text-[10pt] text-blue-500"></i>
                        </div>
                    </div>
                </div>
                <div>
                    <div class='text-[10pt] text-gray-400'>{{ formattedTime }}</div>
                </div>
            </div>
            <div class="pl-[4rem] text-[12pt]"> {{ props.review.content }} </div>
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
import { computed } from 'vue'
import { humanizedTime } from '@/utils/formatUtils.js'

const props = defineProps(['review', 'parentReview'])

const formattedTime = computed(() => {
    return humanizedTime(props.review.createdTime)
})

const avatar = computed(() => {
    const { previewUrl, originUrl, contentType } = props.review.user.avatarUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl
})
</script>