<template>
    <div class="dark:text-white/25 flex flex-col h-full items-center justify-center text-gray-300 w-full">
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="font-bold select-none text-[6rem]">404</div>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="dark:text-inherit select-none text-[0.9rem] text-neutral-400">
            <span>该页面不存在，</span>
            <span
                class="cursor-pointer dark:text-blue-300 text-blue-500"
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