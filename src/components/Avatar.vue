<template>
    <div class="cursor-pointer">
        <picture v-if="!!avatar && !props.user?.avatar?.emoji">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="avatar.url" type="image/webp" />
            <img
                :style="{'background-image': `url(${avatar.thumb})`}"
                :src="avatar.thumb"
                class="bg-center bg-cover bg-no-repeat object-cover"
                loading="lazy"
                v-bind="$attrs"
                @click="routeToProfile" />
        </picture>
        <div
            v-else
            class="default-bg flex items-center justify-center"
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
        return {thumb: props.user.avatar.thumb, url:`${import.meta.env.VITE_OBJECT_BASE_URL}${props.user.avatar.url}?width=600`}
    } else {
        return undefined
    }
})

const defaultBgColor = computed(() => {
    return props.user?.avatar?.emoji?.bgColor || '#3b82f6'
})
</script>