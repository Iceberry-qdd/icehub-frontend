<template>
    <div class="flex flex-col h-64 items-center justify-center w-full">
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="font-bold select-none text-[64pt] text-gray-300">404</div>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="select-none text-[11pt] text-stone-500">
            <span>该页面不存在，</span>
            <span
                class="active:text-blue-600 cursor-pointer text-blue-500"
                @click="backToIndex">
                点此返回主页
            </span>
        </div>
    </div>
</template>

<script setup>
function backToIndex(){
    window.location = `${window.location.origin}/index.html`
}
</script>