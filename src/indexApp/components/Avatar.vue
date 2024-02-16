<template>
    <div class="cursor-pointer">
        <img
            v-if="props.user?.avatarUrl"
            :src="avatarPic"
            loading="lazy"
            v-bind="$attrs"
            @click="routeToProfile" />
        <div
            v-else
            class="bg-blue-500 flex items-center justify-center"
            v-bind="$attrs">
            <!-- eslint-disable-next-line vue/static-class-names-order, vue/singleline-html-element-content-newline -->
            <div class="text-white font-bold text-[100%]">{{ props.user?.nickname.charAt(0) }}</div>
        </div>
    </div>
</template>

<style scoped>
.h-1\.7{
    height: 1.7rem;
}

.w-1\.7{
    width: 1.7rem;
}
</style>

<script setup>
import { computed } from 'vue'

// eslint-disable-next-line vue/no-unsupported-features
defineOptions({
  inheritAttrs: false
})

const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})
const avatarPic = computed(() => {
    const { previewUrl, originUrl, contentType } = props.user.avatarUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl
})

function routeToProfile(){
    // TODO Not implement
}
</script>