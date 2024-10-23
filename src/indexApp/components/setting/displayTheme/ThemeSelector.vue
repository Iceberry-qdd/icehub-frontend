<!-- eslint-disable vue/html-self-closing -->
<template>
    <div class="gap-x-2 gap-y-4 grid grid-cols-3">
        <div class="flex-1 light text-center">
            <div
                :class="{'ring-[3px] ring-offset-2 ring-primary-inActive dark:ring-onPrimary ring-offset-primaryContainer': props.theme === 'light'}"
                class="aspect-[168.61/112] bg-white border-[1px] border-gray-300 cursor-pointer dark:border-neutral-700 gap-2 grid grid-cols-3 p-4 relative rounded-[12px]"
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
                :class="{'ring-[3px] ring-offset-2 ring-primary-inActive dark:ring-onPrimary ring-offset-primaryContainer': props.theme === 'dark'}"
                class="aspect-[168.61/112] bg-[#121212] border-[1px] border-gray-300 cursor-pointer dark:border-neutral-700 gap-2 grid grid-cols-3 p-4 relative rounded-[12px]"
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
                :class="{'ring-[3px] ring-offset-2 ring-primary-inActive dark:ring-onPrimary ring-offset-primaryContainer': props.theme === 'followSystem'}"
                class="aspect-[168.61/112] border-[1px] border-gray-300 cursor-pointer dark:border-neutral-700 gap-2 grid grid-cols-3 p-4 relative rounded-[12px]"
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

@media not all and (min-width: 640px) {
    span:nth-of-type(7),span:nth-of-type(8){
        display: none;
    }

    div[class~="followSystem"] span:first-child{
        background: linear-gradient(45deg, #404040 45%, #f4f4f5 45%);
    }

    div[class~="followSystem"] span:nth-child(4){
        background: linear-gradient(45deg, #404040 48%, #f4f4f5 48%);
    }

    div[class~="followSystem"] span:nth-child(6){
        background: linear-gradient(45deg, #404040 68%, #f4f4f5 68%);
    }
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