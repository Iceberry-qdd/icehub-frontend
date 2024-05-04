<template>
    <div class="cursor-pointer">
        <picture v-if="state.avatar && !props.user?.avatar?.emoji">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="srcset" type="image/webp" />
            <img
                :style="{'background-image': `url(${state.avatar.thumb})`}"
                :src="state.avatar.thumb"
                class="bg-center bg-cover bg-no-repeat object-cover"
                loading="lazy"
                v-bind="$attrs"
                @click="routeToProfile" />
        </picture>
        <div
            v-else
            class="flex items-center justify-center"
            :style="{'background-color': props.user?.avatar?.emoji?.bgColor || '#3b82f6'}"
            v-bind="$attrs">
            <!-- eslint-disable-next-line vue/static-class-names-order, vue/singleline-html-element-content-newline -->
            <div class="text-white font-bold text-[45%]">{{ noPicAvatarClass }}</div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { computed, reactive, watch } from 'vue'

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
    avatar: props.user.avatar
})

const noPicAvatarClass = computed(() => {
    const emoji = props.user?.avatar?.emoji?.emoji
    return emoji ? emoji : props.user.nickname.charAt(0).toUpperCase()
    
})

function routeToProfile(){
    // TODO Not implement
}

const srcset = computed(() => {
    if(props.user.avatar instanceof File){
        return state.avatar.url
    }else{
        return `${import.meta.env.VITE_OBJECT_BASE_URL}${state.avatar.url}?width=600`
    }
})

watch(() => props.user.avatar, (newVal, oldVal) => {
    if(props.user.avatar instanceof File){
        let URL = window.URL || window.webkitURL
        let imgUrl = URL.createObjectURL(props.user.avatar)
        state.avatar = {thumb: imgUrl, url: imgUrl}
    }
})
</script>