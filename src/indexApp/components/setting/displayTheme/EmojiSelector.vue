<template>
    <div>
        <div class="gap-x-2 gap-y-4 grid grid-cols-3">
            <div class="flex-1 text-center">
                <div
                    :class="{'ring-[3px] ring-offset-2 ring-primary-inActive dark:ring-onPrimary ring-offset-primaryContainer': props.emoji === 'noto'}"
                    class="aspect-video border-[1px] border-gray-300 cursor-pointer dark:border-neutral-700 font-['Noto_Color_Emoji'] grid grid-cols-6 max-sm:grid-cols-4 p-2 rounded-[12px] select-none"
                    @click="emits('select', 'noto')">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span v-for="(item, idx) in state.emojiList" :key="idx">{{ item }}</span>
                </div>
                <div class="cursor-default mt-2">Noto Color Emoji</div>
            </div>
            <div class="flex-1 text-center text-neutral-400">
                <div
                    class="aspect-video border-[1px] border-gray-300 cursor-pointer dark:border-neutral-700 font-['apple_color_emoji'] grid grid-cols-6 max-sm:grid-cols-4 p-2 relative rounded-[12px] select-none">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span v-for="(item, idx) in state.emojiList" :key="idx">{{ item }}</span>
                    <div
                        class="absolute bg-[length:80%] bg-black/50 bg-center bg-repeat border-[1px] content-center cursor-not-allowed h-full not-support rounded-[12px] text-center text-white/75 w-full">
                        敬请期待
                    </div>
                </div>
                <div class="cursor-default mt-2">Apple Color Emoji</div>
            </div>
            <div class="flex-1 text-center">
                <div
                    :class="{'ring-[3px] ring-offset-2 ring-primary-inActive dark:ring-onPrimary ring-offset-primaryContainer': props.emoji === 'default'}"
                    class="aspect-video border-[1px] border-gray-300 cursor-pointer dark:border-neutral-700 font-['system-ui'] grid grid-cols-6 max-sm:grid-cols-4 p-2 rounded-[12px] select-none"
                    @click="emits('select', 'default')">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span v-for="(item, idx) in state.emojiList" :key="idx">{{ item }}</span>
                </div>
                <div class="cursor-default mt-2">系统默认</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.not-support{
    background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url('/apple_color_emoji_pic_light.webp');
}

@media not all and (min-width: 640px) {
    span:nth-of-type(6n-1),span:nth-of-type(6n){
        display: none;
    }
}
</style>

<script setup>
import { reactive } from 'vue'

const emits = defineEmits(['select'])
const props = defineProps({
    /** 选中的表情类型 */
    emoji: {
        type:String,
        required: true
    },
    /** 支持的表情类型 */
    emojiOptions: {
        type: Object,
        required: true
    }
})
const state = reactive({
    emojiList: ['😀','😁','😂','🤣','☺','😃','🖐🏻','🖐🏼','🖐','🖐🏽','🖐🏾','🖐🏿','🌤','⛅','⛈','🌧','🌪','🌙']
})
</script>