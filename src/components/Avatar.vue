<template>
    <div class="cursor-pointer shrink-0">
        <picture v-if="!!avatar && !props.user?.avatar?.emoji">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="avatar.url" type="image/webp" />
            <img
                :style="{'background-image': `url(${avatar.thumb})`}"
                :src="avatar.thumb"
                class="bg-center bg-cover bg-no-repeat object-cover"
                :class="cornerShapeClass"
                loading="lazy"
                v-bind="$attrs"
                @click="routeToProfile" />
        </picture>
        <div
            v-else
            class="default-bg flex img items-center justify-center"
            :class="cornerShapeClass"
            v-bind="$attrs">
            <!-- eslint-disable-next-line vue/static-class-names-order, vue/singleline-html-element-content-newline -->
            <div class="text-white dark:text-white/75 font-bold text-[45%]">{{ noPicAvatarText }}</div>
        </div>
    </div>
</template>

<style scoped>
.default-bg,.preview.default-bg:where([theme="dark"], [theme="dark"] *){
    background-color: v-bind(defaultBgColor);
}

.default-bg:where([theme="dark"], [theme="dark"] *){
    background-color: #262626;
}

img,.img{
    border-radius: v-bind(borderRadius);
}

@supports (corner-shape: square){
    .shape-square{
        corner-shape: square;
    }
}

@supports (corner-shape: squircle){
    .shape-rounded{
        corner-shape: squircle;
        border-radius: 100% !important;
    }
}

@supports (corner-shape: round){
    .shape-circle{
        corner-shape: round;
    }
}
</style>

<script setup>
import { store } from '@/indexApp/js/store.js'
import { computed } from 'vue'

// eslint-disable-next-line vue/no-unsupported-features
defineOptions({
  inheritAttrs: false
})

const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL
const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})

const noPicAvatarText = computed(() => {
    const emoji = props.user?.avatar?.emoji?.emoji
    return emoji ? emoji : props.user.nickname.charAt(0).toUpperCase()
})

function routeToProfile(){
    // TODO Not implement
}

const avatar = computed(() => {
    if(props.user.avatar instanceof File){
        let URL = window.URL || window.webkitURL
        let imgUrl = URL.createObjectURL(props.user.avatar)
        return {thumb: imgUrl, url: imgUrl}
    }else if(!!props.user.avatar){
        return {thumb: props.user.avatar.thumb, url:`${BASE_URL}${props.user.avatar.url}?width=600`}
    } else {
        return undefined
    }
})

const defaultBgColor = computed(() => {
    return props.user?.avatar?.emoji?.bgColor || 'rgb(var(--color-primary))'
})

const borderRadius = computed(() => {
    switch (store.AVATAR_STYLE) {
        case 'circle':
            return '100%'
        case 'rounded':
            return '16%'
        case 'square':
            return '0'
        default:
            return '16%'
    }
})

const cornerShapeClass = computed(() => {
    switch (store.AVATAR_STYLE) {
        case 'circle':
            return 'shape-circle'
        case 'rounded':
            return 'shape-rounded'
        case 'square':
            return 'shape-square'
        default:
            return 'shape-rounded'
    }
})
</script>