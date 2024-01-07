<template>
    <div class="cursor-pointer">
        <img @click="routeToProfile" :src="avatarPic" v-if="props.user?.avatarUrl" loading="lazy" v-bind="$attrs"/>
        <div v-else
            class="flex justify-center items-center bg-blue-500" v-bind="$attrs">
            <div class="text-white text-[18pt] font-bold">{{ props.user?.nickname.charAt(0) }}</div>
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

defineOptions({
  inheritAttrs: false
})

const props = defineProps(['user'])

const avatarPic = computed(() => {
    const { previewUrl, originUrl, contentType } = props.user.avatarUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl
})

</script>