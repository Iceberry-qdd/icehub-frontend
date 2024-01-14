<template>
    <div class="rounded-[8px] border-[1px] bg-white">
        <Banner
            :user="props.user"
            class="w-full h-[6rem] object-cover rounded-t-[8px]">
        </Banner>
        <div class="flex flex-col justify-start items-start gap-y-1 w-full px-2 -translate-y-[1.75rem]">
            <div class="flex flex-row justify-between items-end w-full">
                <Avatar
                    :user="props.user"
                    class="w-[3.5rem] h-[3.5rem] border-white box-content border-[0.2rem] object-cover rounded-[8px] text-[18pt]">
                </Avatar>
                <div class="flex flex-row justify-center items-center text-[11pt] bg-blue-500 text-white w-[4.5rem] h-[1.8rem] rounded-full">订阅</div>
            </div>
            <div class="text-[14pt] font-bold">
                {{ state.user.nickname }}
                <i class="text-[10pt] bi bi-patch-check-fill verify text-blue-500" v-if="state.user.verified"></i>
            </div>
            <div class="text-[10pt] break-all brief">{{ state.user.remark }}</div>
        </div>
    </div>
</template>

<style scoped>
.brief {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
</style>

<script setup>
import { reactive, computed } from 'vue'
import Avatar from '@/components/tailwind/Avatar.vue'
import Banner from '@/components/tailwind/Banner.vue'

const props = defineProps(['user'])
const state = reactive({
    user: props.user
})

</script>