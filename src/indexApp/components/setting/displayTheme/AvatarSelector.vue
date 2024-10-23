<template>
    <div class="flex flex-row gap-x-4">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-for="(item, name) in props.avatarOptions" :key="name">
            <Avatar
                :user="state.user"
                :class="[props.avatar === name ? 'ring-[3px] ring-offset-2 ring-primary-inActive dark:ring-onPrimary ring-offset-primaryContainer' : '', item.class]"
                class="h-[2.5rem] text-[1.7rem] w-[2.5rem]"
                @click="emits('select', name)">
            </Avatar>
            <div class="cursor-default mt-2 text-center">{{ item.zh }}</div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import Avatar from '@/components/Avatar.vue'

const emits = defineEmits(['select'])
const props = defineProps({
    /** 选中的头像风格 */
    avatar: {
        type:String,
        required: true
    },
    /** 支持的头像风格 */
    avatarOptions: {
        type: Object,
        required: true
    }
})

const state = reactive({
    user: JSON.parse(localStorage.getItem("CUR_USER"))
})
</script>