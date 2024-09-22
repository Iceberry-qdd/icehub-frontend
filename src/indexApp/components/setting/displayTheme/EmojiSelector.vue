<template>
    <div>
        <div class="gap-x-2 gap-y-4 grid grid-cols-3">
            <div class="flex-1 text-center">
                <div
                    :class="{'ring-[3px] ring-offset-2': props.emoji === 'notoColorEmoji'}"
                    class="aspect-video border-[1px] cursor-pointer font-['Noto_Color_Emoji'] grid grid-cols-6 p-2 rounded-[12px] select-none"
                    @click="emits('select', 'notoColorEmoji')">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span v-for="(item, idx) in state.emojiList" :key="idx">{{ item }}</span>
                </div>
                <div class="cursor-default mt-2">Noto Color Emoji</div>
            </div>
            <div class="flex-1 text-center text-neutral-400">
                <div
                    class="aspect-video bg-[length:80%] bg-black/50 bg-center bg-repeat-y border-[1px] content-center cursor-not-allowed not-support rounded-[12px] text-center text-white/75">
                    此设备不支持
                </div>
                <div class="cursor-default mt-2">Apple Color Emoji</div>
            </div>
            <div class="flex-1 text-center">
                <div
                    :class="{'ring-[3px] ring-offset-2': props.emoji === 'default'}"
                    class="aspect-video border-[1px] cursor-pointer font-['system-ui'] grid grid-cols-6 p-2 rounded-[12px] select-none"
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