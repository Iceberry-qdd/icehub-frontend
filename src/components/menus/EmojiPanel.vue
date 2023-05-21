<template>
    <div class="panel overflow-y-scroll overflow-x-hidden min-h-[8rem] px-1 pr-[1px] max-h-[18rem] bg-white rounded-[6px] shadow-md ring-1 ring-gray-200">
        <div class="category sticky z-[99] top-0 py-2 px-2 grid gap-1 grid-cols-9 bg-white border-b-[1px]">
            <button v-for="(emoji, index) in status.category" :key="index" :title="categoryZh[emoji.category]"
            @click="changeCategory(emoji.category)"
                class="flex aria-selected justify-center items-center w-[1.75rem] h-[1.75rem] p-1 border border-transparent rounded-[8px] cursor-pointer hover:bg-[#f1f3f4] focus:bg-[#cfe2ff]">
                <span :style="{ backgroundPosition: calcSpriteSheet(emoji.sheet_x, emoji.sheet_y) }"
                            class="w-[20px] h-[20px] bg-[length:6100%_6100%] bg-[url('https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/sheets-256/64.png')]"></span>
            </button>
        </div>

        <div class="">
            <div v-for="(emojis, category) in status.emojiMap" :key="category">
                <div class="bg-[#FFFFFFDD] z-[98] py-1 px-2 text-[11pt] backdrop-blur-sm sticky top-[2.8rem]" :id="category">
                    {{ categoryZh[category] }}
                </div>
                <div class="grid p-2 gap-2 grid-cols-6">
                    <button @click="chooseEmoji(emoji.short_name)" v-for="(emoji) in emojis" :key="emoji.unified" :title="emoji.name"
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
import { reactive,onMounted,onUnmounted } from 'vue'
import emojiPack from 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/+esm'

const emit = defineEmits(['emojiName'])

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
const categoryPicker = category.map(c=>emojis[c][0])

const status = reactive({
    category: categoryPicker,
    emojiMap: emojis
})

function convertToEmoji(unified) {
    return String.fromCodePoint(...unified.split('-').map(e => `0x${e}`))
}

function calcSpriteSheet(sheet_x, sheet_y) {
    return `${100 / 60 * sheet_x}% ${100 / 60 * sheet_y}%`
}

function changeCategory(category){ // TODO 此函数没完成
    console.log(category)
    const scrollBarTop=getScrollTop()

    // document.getElementById(category).scrollBy({top:100,behavior:'smooth'})
    document.getElementById(category).scrollIntoView({ behavior: 'smooth',block:'start' })
    // const scrollBarTop2=getScrollTop()
    // console.log(`滚动条高度差：${scrollBarTop2-scrollBarTop}`)
    // window.scrollBy(0,0)
}

function getScrollTop(){
    var scrollTop = 0
    if(document.documentElement && document.documentElement.scrollTop){
        scrollTop = document.documentElement.scrollTop
    }else if(document.body){
        scrollTop = document.body.scrollTop
    }
    return scrollTop
}

function chooseEmoji(name){
    // console.log(name)
    emit('emojiName',[name])
}
</script>