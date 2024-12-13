<template>
    <div class="bg-white border-[1px] dark:bg-[#121212] dark:border-neutral-700 relative rounded-[8px]">
        <Banner
            :user="props.user"
            class="aspect-[5/2] object-cover rounded-t-[8px] w-full">
        </Banner>
        <div class="-mt-[calc(3.5rem/2)] pb-4">
            <div class="flex flex-row items-center justify-center w-full">
                <Avatar
                    :user="props.user"
                    class="border-[0.2rem] border-white box-content dark:border-[#121212] h-[3.5rem] object-cover rounded-[8px] text-[3.5rem] w-[3.5rem]">
                </Avatar>
            </div>
            <div class="flex flex-col items-center justify-center w-full">
                <div class="flex flex-row gap-x-1 items-center">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="font-bold text-[1rem]">{{ state.user.nickname }}</div>
                    <IconVerify
                        v-if="props.user.verified"
                        class="dark:text-blue-300 h-[0.9rem] text-blue-500 w-[0.9rem]">
                    </IconVerify>
                    <div
                        v-if="state.user.confirmFollow"
                        class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                        lock
                    </div>
                </div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="break-all brief dark:text-white/50 max-w-[85%] text-[0.9rem] text-neutral-400">{{ state.user.remark }}</div>
                <div class="flex flex-row mt-2 text-[0.9rem] w-full">
                    <div class="flex flex-col gap-1 items-center justify-center w-1/3">
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <div class="font-bold text-[1rem]">{{ humanizedNumber(state.user.postCount) }}</div>
                        <div class="dark:text-white/50 text-neutral-400">帖子</div>
                    </div>
                    <div class="flex flex-col gap-1 items-center justify-center w-1/3">
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <div class="font-bold text-[1rem]">{{ humanizedNumber(state.user.followCount) }}</div>
                        <div class="dark:text-white/50 text-neutral-400">订阅他的</div>
                    </div>
                    <div class="flex flex-col gap-1 items-center justify-center w-1/3">
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <div class="font-bold text-[1rem]">{{ humanizedNumber(state.user.fanCount) }}</div>
                        <div class="dark:text-white/50 text-neutral-400">他的订阅</div>
                    </div>
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
import { reactive, defineAsyncComponent } from 'vue'
import Avatar from '@/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'
import { humanizedNumber } from '@/indexApp/utils/formatUtils.js'
const IconVerify = defineAsyncComponent(() => import('@/components/icons/IconVerify.vue'))

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