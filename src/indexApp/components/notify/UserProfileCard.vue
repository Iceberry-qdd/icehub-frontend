<template>
    <div class="bg-white border-[1px] relative rounded-[8px]">
        <Banner
            :user="props.user"
            class="h-[10rem] object-cover rounded-t-[8px] w-full">
        </Banner>
        <div class="-translate-y-1/2 flex flex-row items-center justify-center w-full">
            <Avatar
                :user="props.user"
                class="border-[0.2rem] border-white box-content h-[3.5rem] object-cover rounded-[8px] text-[18pt] w-[3.5rem]">
            </Avatar>
        </div>
        <div class="-translate-y-[1.5rem] flex flex-col items-center justify-center w-full">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="font-bold text-[14pt]">{{ state.user.nickname }}</div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="break-all brief max-w-[85%] text-[11pt]">{{ state.user.remark }}</div>
            <div class="flex flex-row mt-[1rem] w-full">
                <div class="flex flex-col gap-1 items-center justify-center w-1/3">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="font-bold">{{ humanizedNumber(state.user.postCount) }}</div>
                    <div>帖子</div>
                </div>
                <div class="flex flex-col gap-1 items-center justify-center w-1/3">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="font-bold">{{ humanizedNumber(state.user.followingCount) }}</div>
                    <div>订阅他的</div>
                </div>
                <div class="flex flex-col gap-1 items-center justify-center w-1/3">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="font-bold">{{ humanizedNumber(state.user.followerCount) }}</div>
                    <div>他的订阅</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.brief {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
</style>

<script setup>
import { reactive } from 'vue'
import Avatar from '@/indexApp/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'
import { humanizedNumber } from '@/indexApp/utils/formatUtils.js'

const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    user: props.user
})
</script>