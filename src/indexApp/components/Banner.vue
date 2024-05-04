<template>
    <div class="cursor-pointer">
        <picture v-if="state.banner">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="srcset" type="image/webp" />
            <img
                :style="{'background-image': `url(${state.banner.thumb})`}"
                class="bg-center bg-cover bg-no-repeat img-fluid pic"
                :src="state.banner.thumb"
                loading="lazy"
                v-bind="$attrs" />
        </picture>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div v-else v-bind="$attrs" class="bg-gradient-to-r from-sky-500 to-indigo-500" />
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { reactive, watch, computed } from 'vue'

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

const state = reactive({
    banner: props.user.banner
})

const srcset = computed(() => {
    if(props.user.banner instanceof File){
        return state.banner.url
    }else{
        return `${import.meta.env.VITE_OBJECT_BASE_URL}${state.banner.url}?width=600`
    }
})

watch(() => props.user.banner, (newVal, oldVal) => {
    if(props.user.banner instanceof File){
        let URL = window.URL || window.webkitURL
        let imgUrl = URL.createObjectURL(props.user.banner)
        state.banner = {thumb: imgUrl, url: imgUrl}
    }
})
</script>