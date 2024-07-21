<template>
    <div class="cursor-pointer">
        <picture v-if="banner">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="banner.url" type="image/webp" />
            <img
                :style="{'background-image': `url(${banner.thumb})`}"
                class="bg-center bg-cover bg-no-repeat img-fluid pic"
                :src="banner.thumb"
                loading="lazy"
                v-bind="$attrs" />
        </picture>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-else v-bind="$attrs" class="bg-gradient-to-r from-sky-500 to-indigo-500" />
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { computed } from 'vue'

// eslint-disable-next-line vue/no-unsupported-features
defineOptions({
    inheritAttrs: false
})

const props = defineProps({
    /** 传入的用户对象 */
    // eslint-disable-next-line vue/no-unused-properties
    user: {
        type: Object,
        required: true
    }
})

const banner = computed(() => {
    if (props.user.banner instanceof File) {
        let URL = window.URL || window.webkitURL
        let imgUrl = URL.createObjectURL(props.user.banner)
        return { thumb: imgUrl, url: imgUrl }
    } else if (!props.user.banner) {
        return undefined
    } else {
        return { thumb: props.user.banner.thumb, url: `${import.meta.env.VITE_OBJECT_BASE_URL}${props.user.banner.url}?width=600` }
    }
})
</script>