<template>
    <div class="bg-white max-h-[18rem] min-h-[8rem] overflow-x-hidden overflow-y-scroll panel pr-[1px] px-1 ring-1 ring-slate-900/5 rounded-[6px] shadow-lg">
        <div
            v-if="state.historyEmojis.length > 0"
            class="bg-white border-b-[1px] category gap-1 grid grid-cols-7 px-2 py-2 sticky top-0 z-[99]">
            <button
                v-for="(emoji, index) in state.historyEmojis"
                :key="index"
                type="button"
                :title="emoji.short_name"
                class="aria-selected border border-transparent cursor-pointer flex focus:bg-[#cfe2ff] h-[2rem] hover:bg-[#f1f3f4] items-center justify-center p-1 rounded-[8px] w-[2rem]"
                @click="chooseEmoji(emoji)">
                <span>{{ emojiCode(emoji.unified) }}</span>
            </button>
        </div>

        <div class="">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-for="(emojiList, catalogue) in state.emojiMap" :key="catalogue">
                <div
                    :id="catalogue"
                    :class="[state.historyEmojis.length > 0 ? 'top-[2.8rem]' : 'top-0']"
                    class="backdrop-blur-sm bg-[#FFFFFFDD] px-2 py-1 sticky text-[11pt] z-[98]">
                    {{ categoryZh[catalogue] }}
                </div>
                <div class="gap-2 grid grid-cols-6 p-2">
                    <button
                        v-for="(emoji) in emojiList"
                        :key="emoji.unified"
                        type="button"
                        :title="emoji.name"
                        class="border border-transparent cursor-pointer flex focus:bg-[#cfe2ff] h-[2.5rem] hover:bg-[#f1f3f4] items-center justify-center p-1 rounded-[8px] text-[16pt] w-[2.5rem]"
                        @click="chooseEmoji(emoji)">
                        <span>{{ emojiCode(emoji.unified) }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import emojiPack from 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/+esm'

const emits = defineEmits(['insertEmojiCode', 'dismissEmojiPanel'])
const props = defineProps({
        /** 触发该组件的元素id，用于检测点击事件关闭用 */
    switchId: {
        type:String,
        required:true
    }
})

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
    obj), {})
const state = reactive({
    emojiMap: emojis,
    historyEmojis: JSON.parse(localStorage.getItem('historyEmoji')) || []
})

function chooseEmoji(emoji) {
    storeEmojiToLocalStorage(emoji)
    emits('insertEmojiCode', emoji)
}

function storeEmojiToLocalStorage(emoji) {
    const KEY = 'historyEmoji'
    let historyEmojis = state.historyEmojis
    while (historyEmojis.length >= 7) {
        historyEmojis.pop()
    }
    historyEmojis.unshift(emoji)

    const obj = {}
    historyEmojis = historyEmojis.reduce((total, next) => {
        obj[next.name] ? '' : obj[next.name] = true && total.push(next)
        return total
    }, [])
    localStorage.setItem(KEY, JSON.stringify(historyEmojis))
}

function emojiCode(unified){
    return String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
}

onMounted(() => {
    const emojiPanel = document.querySelector(`#${props.switchId}`)
    document.querySelector('#app').addEventListener('click', function (event) {
        if (emojiPanel && !emojiPanel.contains(event.target)) {
            emits('dismissEmojiPanel')
        }
    })
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', () => { })
})
</script>