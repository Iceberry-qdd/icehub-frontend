<template>
    <div class="bg-[#00000066] fixed-page sm:backdrop-blur-sm">
        <div
            class="absolute bg-white dark:bg-[#1e1e1e] dark:divide-neutral-700 divide-y-[1px] max-sm:rounded-none max-sm:w-full rounded-[8px] select-none sm:-translate-x-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:top-1/2 w-[min(25rem,100dvw)]">
            <div
                class="absolute bg-gray-500/25 cursor-pointer material-symbols-rounded max-sm:hidden max-sm:left-3 p-1 sm:right-3 top-3 z-[100]"
                @click="dismiss">
                close
            </div>
            <div
                class="absolute bg-gray-500/25 cursor-pointer left-3 material-symbols-rounded p-1 sm:hidden top-3 z-[100]"
                @click="dismiss">
                keyboard_arrow_down
            </div>
            <div
                class="aspect-video banner flex flex-col items-center justify-center max-sm:rounded-t-none rounded-t-[7px] sticky top-0 z-[99]">
                <Avatar
                    :user="state.user"
                    class="h-[5rem] preview rounded-[10px] text-[5rem] w-[5rem]">
                </Avatar>
                <div
                    class="absolute bottom-6 confirmBtn cursor-pointer max-sm:bottom-3 max-sm:px-4 max-sm:py-2 px-3 py-1 rounded-full text-[0.9rem]"
                    @click="setAvatar">
                    设为头像
                </div>
            </div>
            <div
                :class="tabBorderClass"
                class="after:bg-primary bg-inherit cursor-pointer dark:after:bg-onPrimary dark:text-white/50 flex flex-row h-[2.5rem] max-sm:h-[3rem] sticky tab text-[1rem] text-zinc-500 z-[99]">
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
            <div class="h-[min(24rem,calc(100dvh-25rem*9/16-2.5rem))] max-sm:h-[calc(100dvh-100dvw*9/16-3rem)] modern-scrollbar-y overflow-x-hidden overflow-y-auto palette sm:rounded-b-[8px]">
                <Footer
                    class="absolute z-[-1]"
                    is-loading
                    has-more>
                </Footer>
                <EmojiPanel
                    v-if="state.showEmojiPanel"
                    :show-history="false"
                    :column="8"
                    class="pr-1"
                    @insert-emoji-code="insertEmojiCode">
                </EmojiPanel>
                <div v-else-if="state.showBgColorPanel">
                    <div class="bg-[#1e1e1e] footnote sticky text-[0.85rem] text-center text-white/50 top-0">
                        暗色模式下，将统一显示为深灰色。
                    </div>
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
details>summary>.material-symbols-rounded {
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

.banner{
    background-image: v-bind(bannerBg);
}

.banner:where([theme="dark"], [theme="dark"] *){
    background-image: none;
    background-color: #1e1e1e;
}

.confirmBtn{
    background-color: v-bind(confirmBtnBg);
}

.confirmBtn:where([theme="dark"], [theme="dark"] *){
    background-color: #404040;
}

.footnote:not(:where([theme="dark"], [theme="dark"] *)){
    display: none;
}

@keyframes slide {
    0%{
        translate: 100% 0;
    }

    100%{
        translate: -100% 0;
    }
}

@media not all and (min-width: 640px) {
    .palette{
        padding-bottom: calc(var(--safe-area-max-inset-bottom) + 1rem);
    }
}
</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { reactive, computed, defineAsyncComponent } from 'vue'
import Avatar from '@/components/Avatar.vue'
import palette from '@/assets/tailwind-palette.json'
import Footer from '@/indexApp/components/Footer.vue'
const EmojiPanel = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/EmojiPanel.vue'))

const props = defineProps({
    /** 用户旧头像 */
    avatar: {
        type: [Object, undefined],
        required: true
    }
})
const emits = defineEmits(['avatar', 'dismiss'])
const state = reactive({
    user: {
        avatar: {
            emoji: {
                emoji: props?.avatar?.emoji?.emoji || '😀',
                bgColor: props?.avatar?.emoji?.bgColor || 'rgb(var(--color-primary))'
            }
        }
    },
    showEmojiPanel: true,
    showBgColorPanel: false,
    selectColor: props?.avatar?.emoji?.bgColor
})

function insertEmojiCode(unified){
    const emoji = String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
    state.user.avatar.emoji.emoji = emoji
}

function setAvatar(){
    if(!(/^#[0-9a-fA-F]{6}$/.test(state.user.avatar.emoji.bgColor))){
        state.user.avatar.emoji.bgColor = undefined
    }
    emits('avatar', {avatar: state.user.avatar})
    dismiss()
}

function dismiss(){
    emits('dismiss')
}

const emojiPanelTabClass = computed(() => ({
    'text-primary dark:text-onPrimary': state.showEmojiPanel,
}))

const bgColorPanelTabClass = computed(() => ({
    'text-primary dark:text-onPrimary': state.showBgColorPanel,
}))

const tabBorderClass = computed(() => ({
    'after:translate-x-0': state.showEmojiPanel,
    'after:translate-x-full': state.showBgColorPanel
}))

const bannerBg = computed(() => {
    if(!!state.selectColor){
        return `linear-gradient(to top right, ${state.selectColor}55, ${state.selectColor}25)`
    } else {
        return `linear-gradient(to top right, rgb(var(--color-primary) / 0.3), rgb(var(--color-primary) / 0.2))`
    }
    
})

const confirmBtnBg = computed(() => {
    return `${state.selectColor}44`
})

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
</script>