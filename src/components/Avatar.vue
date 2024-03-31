<template>
    <div class="cursor-pointer">
        <picture v-if="props.user?.avatar && !props.user?.avatar?.emoji">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <source :srcset="`${props.user.avatar.url}?width=80`" type="image/webp" />
            <img
                :style="{'background-image': `url(${props.user.avatar.thumb})`}"
                :src="props.user.avatar.thumb"
                class="bg-center bg-cover bg-no-repeat"
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

const noPicAvatarClass = computed(() => {
    const emoji = props.user?.avatar?.emoji?.emoji
    return emoji ? emoji : props.user.nickname.charAt(0).toUpperCase()
    
})

function routeToProfile(){
    // TODO Not implement
}
</script>