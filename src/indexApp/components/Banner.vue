<template>
    <div class="cursor-pointer">
        <img
            v-if="props.user && props.user.bannerUrl"
            class="img-fluid pic"
            :src="bannerPic"
            loading="lazy"
            v-bind="$attrs" />
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-else v-bind="$attrs" class="bg-gradient-to-r from-sky-500 to-indigo-500" />
    </div>
</template>

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
const bannerPic = computed(() => {
    const { previewUrl, originUrl, contentType } = props.user.bannerUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl
})
</script>