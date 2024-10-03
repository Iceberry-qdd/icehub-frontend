<template>
    <div
        class="flex flex-nowrap flex-row gap-x-3 items-center justify-start">
        <Avatar
            :user="props.user"
            class="h-[2rem] my-2 rounded-[6px] text-[2rem] w-[2rem]">
        </Avatar>
        <div class="flex flex-col flex-nowrap h-max items-start justify-start">
            <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                <div class="font-bold hover:underline text-[0.9rem]">{{ props.user.nickname }}</div>
                <IconVerify
                    v-if="props.user.verified"
                    class="dark:text-blue-300 h-[0.9rem] text-blue-500 w-[0.9rem]">
                </IconVerify>
                <div
                    v-if="props.user.confirmFollow"
                    class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                    lock
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Avatar from '@/components/Avatar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'

const props = defineProps({
    /** 用户对象 */
    user: {
        type: Object,
        required: true
    }
})
</script>