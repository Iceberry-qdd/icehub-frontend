<template>
    <div class="bg-white max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] modern-scrollbar-y overflow-x-hidden overflow-y-auto rounded-[6px]">
        <div
            v-if="props.showHistory && state.historyEmojis.length > 0"
            class="bg-white border-b-[1px] category gap-1 grid grid-cols-7 px-2 py-2 sticky top-0 z-[99]">
            <button
                v-for="(unified, index) in state.historyEmojis"
                :key="index"
                type="button"
                class="aria-selected border border-transparent cursor-pointer flex focus:bg-[#cfe2ff] h-[2rem] hover:bg-[#f1f3f4] items-center justify-center p-1 rounded-[8px] w-[2rem]"
                @click="chooseEmoji(unified)">
                <span>{{ emojiCode({ unified: unified }) }}</span>
            </button>
        </div>

        <div
            ref="emojiContainer"
            class="relative">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-for="(emojiList, catalogue) in state.emojiMap" :key="catalogue">
                <div
                    :id="catalogue"
                    :class="[showHistory ? 'top-[2.8rem]' : 'top-0']"
                    class="backdrop-blur-sm bg-[#FFFFFFDD] px-2 py-1 sticky text-[11pt] z-[98]">
                    {{ categoryZh[catalogue] }}
                </div>
                <div
                    ref="emojiGrid"
                    :style="{'grid-template-columns': `repeat(${props.column}, minmax(0, 1fr))`}"
                    class="gap-2 grid pl-1">
                    <button
                        v-for="(emoji) in emojiList"
                        :id="`e-${emoji.unified}`"
                        :key="emoji.unified"
                        type="button"
                        :title="emoji.short_name"
                        class="border border-transparent cursor-pointer flex flex-col focus:bg-[#cfe2ff] h-[2.5rem] hover:bg-[#f1f3f4] items-center justify-center p-1 relative rounded-[8px] text-[16pt] w-[2.5rem]"
                        @mouseenter.self="toggleSkinPanel(emoji, true)"
                        @mouseleave.self="toggleSkinPanel(emoji, false)">
                        <span @click="chooseEmoji(emoji.unified)">{{ emojiCode(emoji) }}</span>
                        <Transition name="skin-fade">
                            <div
                                v-if="emoji.skin_variations && state.showSkinPanel[emoji.unified]"
                                id="skinPanel"
                                :style="skinPanelStyle(emoji.unified)"
                                class="absolute bg-white bottom-full flex flex-row flex-wrap gap-1 px-1 py-1 ring-1 ring-gray-100 rounded-[8px] shadow-md w-[calc(2rem*5+0.25rem*4+0.5rem)] z-[98]">
                                <div
                                    v-for="(skinVariation, skinCode) in emoji.skin_variations"
                                    :key="skinVariation.unified"
                                    class="box-border flex focus:bg-[#cfe2ff] h-[2rem] hover:bg-[#f1f3f4] items-center justify-center p-2 rounded-[8px] w-[2rem]"
                                    @click.self="chooseEmoji(skinVariation.unified)">
                                    {{ emojiCode(emoji, skinCode) }}
                                </div>
                            </div>
                        </Transition>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.skin-fade-enter-active {
    transition: opacity 0.3s ease-in-out;
}

.skin-fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.skin-fade-enter-from {
    opacity: 0;
}

.skin-fade-leave-to {
    opacity: 0;
}
</style>

<!-- eslint-disable vue/no-unused-properties -->
<script setup>
import { reactive, onMounted, onUnmounted, computed, ref } from 'vue'
import { store } from '@/indexApp/js/store.js'
// jsdelivr服务不稳定，选择本地打包进去：https://github.com/jsdelivr/jsdelivr/issues/18565
import emojiPack from '@/assets/emoji-datasource-apple@15.1.2+esm.js'

const emits = defineEmits(['insertEmojiCode', 'dismissEmojiPanel'])
const props = defineProps({
    /** 触发该组件的元素id，用于检测点击事件关闭用 */
    switchId: {
        type:String,
        required:false,
        default:'emoji-panel'
    },
    /** 是否显示历史记录行 */
    showHistory: {
        type: Boolean,
        required: false,
        default: true
    },
    /** 每行表情个数，支持取值范围[1,12] */
    column: {
        type:Number,
        required: false,
        default: 6
    }
})
const emojiGrid = ref()
const emojiContainer = ref()
const categoryZh = {
    'Smileys & Emotion': '表情与角色',
    'People & Body': '角色与人物',
    'Animals & Nature': '动物与自然',
    'Activities': '活动',
    'Travel & Places': '旅行与景点',
    'Food & Drink': '食物与饮品',
    'Objects': '物品',
    'Symbols': '符号',
    'Flags': '旗帜',
    // 'Component': '组件'
}
const category = Object.keys(categoryZh)
const emojis = category.reduce((obj, key) => (
                                obj[key] = emojiPack.filter(e => e.category === key && e.has_img_apple === true)
                                                    .sort((a, b) => a.sort_order - b.sort_order),
                                obj), {}
                              )
const showSkinPanel = emojiPack.filter(emoji => emoji?.skin_variations) /*.map(emoji => {return {unified: emoji.unified, show: false}})*/
                               .reduce((obj, { unified }) => (obj[unified] = false, obj), {})
const state = reactive({
    emojiMap: emojis,
    historyEmojis: JSON.parse(localStorage.getItem('historyEmoji')) || [],
    showSkinPanel: showSkinPanel
})

const showHistory = computed(() => {
    return state.historyEmojis.length > 0 && props.showHistory
})

function chooseEmoji(unified) {
    if(store.MOBILE_MODE && state.showSkinPanel[unified] === false){
        state.showSkinPanel[unified] = true
        return
    }
    if(props.showHistory){
        storeEmojiToLocalStorage(unified)
    }
    emits('insertEmojiCode', unified)
}

function storeEmojiToLocalStorage(unified) {
    const KEY = 'historyEmoji'
    
    while (state.historyEmojis.length >= 7) {
        state.historyEmojis.pop()
    }

    const index = state.historyEmojis.findIndex(it => it === unified)
    if(index != -1){
        state.historyEmojis.splice(index, 1)
    }

    state.historyEmojis.unshift(unified)
    localStorage.setItem(KEY, JSON.stringify(state.historyEmojis))
}

function emojiCode({ unified, skin_variations }, selectSkin){
    if(!selectSkin){
        return String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
    }

    if(skin_variations && skin_variations[selectSkin]){
        return String.fromCodePoint(...skin_variations[selectSkin].unified.split('-').map(it => `0x${it}`))
    }
}

function skinPanelStyle(emojiBtnId){
    const emojiBtnEl = emojiContainer.value.querySelector(`#e-${emojiBtnId}`)
    const skinPanelEl = emojiBtnEl.querySelector(`#skinPanel`)

    const emojiBtnOffsetLeft = emojiBtnEl?.offsetLeft
    const emojiBtnOffsetWidth = emojiBtnEl?.offsetWidth
    const skinPanelOffsetLeft = skinPanelEl?.offsetLeft ?? -73 // 经测试，skinPanel.offsetLeft实际是个常量-73
    const emojiGridOffsetWidth = emojiContainer.value?.offsetWidth

    if(emojiBtnOffsetLeft + skinPanelOffsetLeft < 0){
        return {'translate': `${-emojiBtnOffsetLeft - skinPanelOffsetLeft}px 0`}
    }else if(emojiBtnOffsetLeft - skinPanelOffsetLeft + emojiBtnOffsetWidth > emojiGridOffsetWidth){
        return {'translate': `${emojiGridOffsetWidth - emojiBtnOffsetLeft + skinPanelOffsetLeft - emojiBtnOffsetWidth}px 0`}
    }
    return {}
}

function toggleSkinPanel(emoji, show){
    if(show && store.MOBILE_MODE) return
    if(emoji.skin_variations){
        state.showSkinPanel[emoji.unified] = show
    }
}

onMounted(() => {
    if(!props.switchId) return
    const emojiPanel = document.querySelector(`#${props.switchId}`)
    const emojiPanelBtn = document.querySelector(`#${props.switchId}-btn`)
    document.querySelector('#app').addEventListener('click', function (event) {
        const isClickPanel = emojiPanel && emojiPanel.contains(event.target)
        const isClickPanelBtn = emojiPanelBtn && emojiPanelBtn.contains(event.target)
        if (!isClickPanel && !isClickPanelBtn) {
            emits('dismissEmojiPanel')
        }
    })
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', () => { })
})
</script>