<template>
    <div class="cursor-pointer">
        <img class="pic img-fluid" v-if="props.user && props.user.bannerUrl" :src="bannerPic" loading="lazy" v-bind="$attrs" />
        <div v-else v-bind="$attrs" class="bg-gradient-to-r from-sky-500 to-indigo-500"></div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps(['user'])

const bannerPic = computed(() => {
    const { previewUrl, originUrl, contentType } = props.user.bannerUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl
})

</script>