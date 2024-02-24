<template>
    <div>
        <div class="border-b-[1px] border-gray-100 flex flex-col px-[1rem] py-[1rem] relative">
            <div class="absolute bg-gray-200 left-[2.7rem] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
            <div class="flex flex-row items-center justify-between pl-[0.5rem]">
                <div class="flex flex-row gap-x-4 items-center">
                    <div class="relative z-10">
                        <Avatar
                            :user="props.review.user"
                            class="cursor-default h-[2.5rem] rounded-[6px] text-[2.5rem] w-[2.5rem]">
                        </Avatar>
                    </div>
                    <div>
                        <div class="cursor-default font-bold text-[14pt]">
                            {{ props.review.user.nickname }}
                            <i
                                v-if="props.review.user.verified"
                                class="bi bi-patch-check-fill relative text-[10pt] text-blue-500 verify" />
                        </div>
                    </div>
                </div>
                <div>
                    <!-- eslint-disable-next-line vue/html-quotes, vue/singleline-html-element-content-newline -->
                    <div class='text-[10pt] text-gray-400'>{{ humanizedTime(props.review.createdTime) }}</div>
                </div>
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
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
import { humanizedTime } from '@/indexApp/utils/formatUtils.js'
import Avatar from '@/components/Avatar.vue'

const props = defineProps({
    /** 传入的评论对象 */
    // eslint-disable-next-line vue/no-unused-properties
    review: {
        type: Object,
        required: true
    }
})
</script>