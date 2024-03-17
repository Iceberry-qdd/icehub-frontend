<template>
    <div class="cursor-pointer">
        <picture v-if="props.user?.banner">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="`${props.user.banner.url}?width=600`" type="image/webp" />
            <img
                :style="{'background-image': `url(${props.user.banner.thumb})`}"
                class="bg-center bg-cover bg-no-repeat img-fluid pic"
                :src="props.user.banner.thumb"
                loading="lazy"
                v-bind="$attrs" />
        </picture>
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
    // eslint-disable-next-line vue/no-unused-properties
    user: {
        type: Object,
        required: true
    }
})
</script>