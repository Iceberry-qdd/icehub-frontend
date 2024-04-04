<template>
    <div class="bg-[#00000066] fixed h-full w-full z-[101]">
        <div
            class="absolute bg-gray-500/25 cursor-pointer material-icons-round p-1 right-[calc((100vw-25rem)/2+0.5rem)] top-[calc((100vh-40rem)/2+0.5rem)] z-[99]"
            @click="dismiss">
            close
        </div>
        <div
            class="absolute bg-white divide-y-[1px] h-[40rem] rounded-[8px] select-none translate-x-[calc((100vw-25rem)/2)] translate-y-[calc((100vh-40rem)/2)] w-[25rem]">
            <div
                :style="{'background-image': `linear-gradient(to top right, ${state.selectColor}55, ${state.selectColor}25)`}"
                class="flex flex-col h-[15rem] items-center justify-center rounded-t-[7px] sticky top-0 z-[99]">
                <Avatar
                    :user="state.user"
                    class="h-[5rem] rounded-[10px] text-[5rem] w-[5rem]">
                </Avatar>
                <div
                    :style="{'background-color': `${state.selectColor}44`}"
                    class="absolute bottom-[1.5rem] cursor-pointer px-3 py-1 rounded-full text-[0.9rem]"
                    @click="setAvatar">
                    设为头像
                </div>
            </div>
            <div
                :class="tabBorderClass"
                class="after:bg-blue-500 bg-white cursor-pointer flex flex-row h-[2.5rem] sticky tab text-[0.9rem] text-zinc-500 top-[15rem] z-[99]">
                <div
                    :class="emojiPanelTabClass"
                    class="basis-1/2 flex items-center justify-center"
                    @click="handleEmojiTabClick">
                    选择表情
                </div>
                <div
                    :class="bgColorPanelTabClass"
                    class="basis-1/2 flex items-center justify-center"
                    @click="handleBgColorTabClick">
                    背景颜色
                </div>
            </div>
            <div class="h-[calc(40rem-15rem-2.5rem)] overflow-x-hidden overflow-y-auto panel rounded-b-[8px]">
                <EmojiPanel
                    v-if="state.showEmojiPanel"
                    switch-id=""
                    class=""
                    :show-history="false"
                    :column="8"
                    @insert-emoji-code="insertEmojiCode">
                </EmojiPanel>
                <div v-else-if="state.showBgColorPanel">
                    <div
                        v-for="(colors, color) in palette"
                        :key="color"
                        class="grid grid-cols-10 grid-rows-1">
                        <!-- <div v-for="(quality,p2) in color" :key="quality">{{ `${quality}-${p1}-${p2}` }}</div> -->
                        <div
                            v-for="(value, quality) in colors"
                            :key="`${color}-${quality}`"
                            :style="{'background-color': value}"
                            class="aspect-square cursor-pointer delay-75 duration-100 hover:scale-110 transition-transform"
                            @click="selectColor({color: color, quality: quality, value: value, base: palette[color]['500']})" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
details>summary>.material-icons-round {
    font-size: 1.5rem;
}

.tab::after{
    content: '';
    width: 50%;
    height: 2px;
    position: absolute;
    bottom: 0;
    transition: transform 100ms ease-in-out;
}

.panel::-webkit-scrollbar {
    width: 8px !important;
    -webkit-appearance: none;
    background: transparent;
    border-radius: 9999px;
}

.panel::-webkit-scrollbar-thumb {
    width: 8px !important;
    -webkit-appearance: none;
    background: #00000033;
    border-radius: 9999px;
}
</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { reactive, onMounted, onUnmounted, computed } from 'vue'
import Avatar from '@/components/Avatar.vue'
import EmojiPanel from '@/indexApp/components/menus/postEditorMenus/EmojiPanel.vue'
import palette from '@/indexApp/components/profile/tailwind-palette.json'

const props = defineProps({
    /** 用户旧头像 */
    avatar: {
        type:Object,
        required: true
    }
})
const emits = defineEmits(['avatar', 'dismiss'])
const state = reactive({
    user: {
        avatar: {
            emoji: {
                emoji: props?.avatar?.emoji?.emoji || '😀',
                bgColor: props?.avatar?.emoji?.bgColor || '#3b82f6'
            }
        }
    },
    showEmojiPanel: true,
    showBgColorPanel: false,
    selectColor: props?.avatar?.emoji?.bgColor || '#3b82f6'
})

function insertEmojiCode(unified){
    const emoji = String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
    state.user.avatar.emoji.emoji = emoji
}

function setAvatar(){
    emits('avatar', {avatar: state.user.avatar})
    dismiss()
}

function dismiss(){
    emits('dismiss')
}

const emojiPanelTabClass = computed(() => ({
    'text-blue-500': state.showEmojiPanel,
}))

const bgColorPanelTabClass = computed(() => ({
    'text-blue-500': state.showBgColorPanel,
}))

const tabBorderClass = computed(() => ({
    'after:translate-x-0': state.showEmojiPanel,
    'after:translate-x-full': state.showBgColorPanel
}))

function handleEmojiTabClick(){
    state.showEmojiPanel = true
    state.showBgColorPanel = false
}

function handleBgColorTabClick(){
    state.showEmojiPanel = false
    state.showBgColorPanel = true
}

function selectColor({value, base}){
    state.user.avatar.emoji.bgColor=value
    state.selectColor = base
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style", "overflow:hidden")
})
</script>