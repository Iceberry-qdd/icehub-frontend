<template>
    <div class="relative rounded-[8px] border-[1px] bg-white">
        <Banner
            :user="props.user"
            class="w-full h-[10rem] object-cover rounded-t-[8px]">
        </Banner>
        <div class="flex flex-row justify-center items-center w-full -translate-y-1/2">
            <Avatar
                :user="props.user"
                class="w-[3.5rem] h-[3.5rem] border-white box-content border-[0.2rem] object-cover rounded-[8px] text-[18pt]">
            </Avatar>
        </div>
        <div class="flex flex-col justify-center items-center w-full -translate-y-[1.5rem]">
            <div class="text-[14pt] font-bold">{{ state.user.nickname }}</div>
            <div class="text-[11pt] max-w-[85%] break-all brief">{{ state.user.remark }}</div>
            <div class="flex flex-row w-full mt-[1rem]">
                <div class="w-1/3 flex flex-col gap-1 justify-center items-center">
                    <div class="font-bold">{{ humanizedNumber(state.user.postCount) }}</div>
                    <div>帖子</div>
                </div>
                <div class="w-1/3 flex flex-col gap-1 justify-center items-center">
                    <div class="font-bold">{{ humanizedNumber(state.user.followingCount) }}</div>
                    <div>订阅他的</div>
                </div>
                <div class="w-1/3 flex flex-col gap-1 justify-center items-center">
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
import Avatar from '@/components/tailwind/Avatar.vue'
import Banner from '@/components/tailwind/Banner.vue'
import { humanizedNumber } from '@/utils/formatUtils'

const props = defineProps(['user'])
const state = reactive({
    user: props.user
})

</script>