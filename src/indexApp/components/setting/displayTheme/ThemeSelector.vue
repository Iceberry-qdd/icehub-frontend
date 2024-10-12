<!-- eslint-disable vue/html-self-closing -->
<template>
    <div class="gap-x-2 gap-y-4 grid grid-cols-3">
        <div class="flex-1 light text-center">
            <div
                :class="{'ring-[3px] ring-offset-2': props.theme === 'light'}"
                class="aspect-[168.61/112] bg-white border-[1px] cursor-pointer gap-2 grid grid-cols-3 p-4 relative rounded-[12px]"
                @click="emits('select', 'light')">
                <span class="col-span-2"></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span class="col-span-3"></span>
                <span></span>
                <span class="col-span-2"></span>
            </div>
            <div class="cursor-default mt-2">浅色模式</div>
        </div>
        <div class="dark flex-1 text-center">
            <div
                :class="{'ring-[3px] ring-offset-2': props.theme === 'dark'}"
                class="aspect-[168.61/112] bg-[#121212] border-[1px] cursor-pointer gap-2 grid grid-cols-3 p-4 relative rounded-[12px]"
                @click="emits('select', 'dark')">
                <span class="col-span-2"></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span class="col-span-3"></span>
                <span></span>
                <span class="col-span-2"></span>
            </div>
            <div class="cursor-default mt-2">深色模式</div>
        </div>
        <div class="flex-1 followSystem text-center">
            <div
                :class="{'ring-[3px] ring-offset-2': props.theme === 'followSystem'}"
                class="aspect-[168.61/112] border-[1px] cursor-pointer gap-2 grid grid-cols-3 p-4 relative rounded-[12px]"
                @click="emits('select', 'followSystem')">
                <span class="col-span-2"></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span class="col-span-3"></span>
                <span></span>
                <span class="col-span-2"></span>
            </div>
            <div class="cursor-default mt-2">跟随系统</div>
        </div>
    </div>
</template>

<style scoped>
div[class~="light"] span{
    background-color: #f4f4f5;
}

div[class~="dark"] span{
    background-color: #404040;
}

div[class~="followSystem"] span{
    background-color: #f4f4f5;
}

div[class~="followSystem"] :is(span:nth-child(3),span:nth-child(7)){
    background-color: #404040;
}

div[class~="followSystem"]>div:first-child{
    background: linear-gradient(45deg, #121212 50%, white 50%);
}

div[class~="followSystem"] span:first-child{
    background: linear-gradient(45deg, #404040 41.5%, #f4f4f5 41.5%);
}

div[class~="followSystem"] span:nth-child(4){
    background: linear-gradient(45deg, #404040 30.5%, #f4f4f5 30.5%);
}

div[class~="followSystem"] span:nth-child(6){
    background: linear-gradient(45deg, #404040 57.2%, #f4f4f5 57.2%);
}

div[class~="followSystem"] span:nth-child(8){
    background: linear-gradient(45deg, #404040 58.5%, #f4f4f5 58.5%);
}
</style>

<script setup>
const emits = defineEmits(['select'])
const props = defineProps({
    /** 生效的主题名 */
    theme: {
        type:String,
        required: true
    }
})
</script>