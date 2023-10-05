<template>
    <div
        class="panel overflow-y-scroll overflow-x-hidden min-h-[8rem] px-1 pr-[1px] max-h-[18rem] bg-white rounded-[6px] shadow-md ring-1 ring-gray-200">
        <div class="category sticky z-[99] top-0 py-2 px-2 grid gap-1 grid-cols-7 bg-white border-b-[1px]"
            v-if="state.historyEmojis.length > 0">
            <button v-for="(emoji, index) in state.historyEmojis" :key="index" :title="emoji.short_name"
                @click="chooseEmoji(emoji)"
                class="flex aria-selected justify-center items-center w-[2rem] h-[2rem] p-1 border border-transparent rounded-[8px] cursor-pointer hover:bg-[#f1f3f4] focus:bg-[#cfe2ff]">
                <span :style="{ backgroundPosition: calcSpriteSheet(emoji.sheet_x, emoji.sheet_y) }"
                    class="w-[22px] h-[22px] bg-[length:6100%_6100%] bg-[url('https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/sheets-256/64.png')]"></span>
            </button>
        </div>

        <div class="">
            <div v-for="(emojis, category) in state.emojiMap" :key="category">
                <div :class="[state.historyEmojis.length > 0 ? 'top-[2.8rem]' : 'top-0']"
                    class="bg-[#FFFFFFDD] z-[98] py-1 px-2 text-[11pt] backdrop-blur-sm sticky" :id="category">
                    {{ categoryZh[category] }}
                </div>
                <div class="grid p-2 gap-2 grid-cols-6">
                    <button @click="chooseEmoji(emoji)" v-for="(emoji) in emojis" :key="emoji.unified" :title="emoji.name"
                        class="flex justify-center items-center w-[2.5rem] h-[2.5rem] p-1 border text-[16pt] border-transparent rounded-[8px] cursor-pointer hover:bg-[#f1f3f4] focus:bg-[#cfe2ff]">
                        <span :style="{ backgroundPosition: calcSpriteSheet(emoji.sheet_x, emoji.sheet_y) }"
                            class="w-[24px] h-[24px] bg-[length:6100%_6100%] bg-[url('https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/sheets-256/64.png')]"></span>
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
import emojiPack from 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/+esm'

const emits = defineEmits(['emojiName', 'dismissEmojiPanel'])

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

function calcSpriteSheet(sheet_x, sheet_y) {
    return `${100 / 60 * sheet_x}% ${100 / 60 * sheet_y}%`
}

function chooseEmoji(emoji) {
    storeEmojiToLocalStorage(emoji)
    emits('emojiName', [emoji.short_name])
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

onMounted(() => {
    const emojiPanel = document.querySelector('#emojiPanel')
    document.querySelector('#app').addEventListener('click', function (event) {
        if (!emojiPanel.contains(event.target)) {
            emits('dismissEmojiPanel')
        }
    })
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', () => { })
})
</script>